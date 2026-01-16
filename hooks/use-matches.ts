"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getUserMatches, markMatchAsNotified, getUserDeclarations } from '@/lib/supabase/database'
import type { Match } from '@/lib/supabase/database'

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [myDeclarationIds, setMyDeclarationIds] = useState<string[]>([])
  const supabase = createClient()

  const loadMatches = async () => {
    setLoading(true)
    
    try {
      // Charger en parallèle pour plus de rapidité
      const [userMatches, myDeclarations] = await Promise.all([
        getUserMatches(),
        getUserDeclarations()
      ])
      
      const declarationIds = myDeclarations.map(d => d.id)
      setMyDeclarationIds(declarationIds)
      setMatches(userMatches)
      
      // Compter les matches non lus pour CET utilisateur spécifiquement
      const unread = userMatches.filter(m => {
        const isUser1 = declarationIds.includes(m.declaration_id_1)
        const isUser2 = declarationIds.includes(m.declaration_id_2)
        
        // Si je suis user_1, vérifier user_1_notified
        // Si je suis user_2, vérifier user_2_notified
        if (isUser1 && !m.user_1_notified) return true
        if (isUser2 && !m.user_2_notified) return true
        
        return false
      }).length
      
      setUnreadCount(unread)
    } catch (error) {
      console.error('Erreur chargement matches:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMatches()

    // Écouter les nouveaux matches en temps réel
    const channel = supabase
      .channel('matches-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches'
        },
        async (payload) => {
          console.log('🎉 Nouveau match détecté!', payload)
          
          // Recharger les matches
          await loadMatches()
          
          // Afficher notification système si disponible
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🎉 JusteMoi - Match trouvé !', {
              body: 'Quelqu\'un d\'autre a déclaré la même personne que toi.',
              icon: '/icon.svg',
              badge: '/icon.svg',
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const markAsRead = async (matchId: string, isUser1: boolean) => {
    // Mise à jour optimiste de l'état local AVANT l'appel API
    setMatches(prevMatches => 
      prevMatches.map(match => 
        match.id === matchId 
          ? {
              ...match,
              user_1_notified: isUser1 ? true : match.user_1_notified,
              user_2_notified: !isUser1 ? true : match.user_2_notified
            }
          : match
      )
    )
    
    // Mettre à jour le compteur immédiatement
    setUnreadCount(prev => Math.max(0, prev - 1))
    
    // Appel API en arrière-plan (sans recharger)
    const success = await markMatchAsNotified(matchId, isUser1)
    
    // Si l'API échoue, on pourrait annuler l'update optimiste ici
    if (!success) {
      console.error('Échec du marquage comme lu')
      // Optionnel: recharger pour sync avec le serveur
      await loadMatches()
    }
    
    return success
  }

  return {
    matches,
    unreadCount,
    loading,
    loadMatches,
    markAsRead
  }
}
