"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, BellRing, Eye, Check, X, Loader2, AlertTriangle } from "lucide-react"
import { useMatches } from "@/hooks/use-matches"
import { getUserDeclarations } from "@/lib/supabase/database"
import type { Declaration } from "@/lib/supabase/database"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface MatchWithDetails {
  id: string
  created_at: string
  myDeclaration: Declaration | null
  otherDeclaration: Declaration | null
  isNotified: boolean
}

export function MatchesPanel() {
  const { matches, unreadCount, loading, loadMatches, markAsRead } = useMatches()
  const [matchesWithDetails, setMatchesWithDetails] = useState<MatchWithDetails[]>([])
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<MatchWithDetails | null>(null)
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [myDeclarations, setMyDeclarations] = useState<Declaration[]>([])
  const [myDeclarationIds, setMyDeclarationIds] = useState<string[]>([])

  // Charger les déclarations une seule fois au montage
  useEffect(() => {
    const loadMyDeclarations = async () => {
      const declarations = await getUserDeclarations()
      setMyDeclarations(declarations)
      setMyDeclarationIds(declarations.map(d => d.id))
    }
    loadMyDeclarations()
  }, [])

  // Charger les détails quand matches change (et qu'on a les déclarations)
  useEffect(() => {
    if (myDeclarations.length > 0 && matches.length > 0) {
      loadMatchDetails()
    } else if (matches.length === 0) {
      setMatchesWithDetails([])
      setLoadingDetails(false)
    }
  }, [matches, myDeclarations])

  const loadMatchDetails = async () => {
    setLoadingDetails(true)

    const details: MatchWithDetails[] = matches.map((match) => {
      const isMyDeclaration1 = myDeclarationIds.includes(match.declaration_id_1)
      const myDeclarationId = isMyDeclaration1 ? match.declaration_id_1 : match.declaration_id_2
      
      const myDeclaration = myDeclarations.find(d => d.id === myDeclarationId) || null
      const isNotified = isMyDeclaration1 ? match.user_1_notified : match.user_2_notified

      return {
        id: match.id,
        created_at: match.created_at,
        myDeclaration,
        otherDeclaration: null, // On ne révèle pas l'autre déclaration (anonymat)
        isNotified
      }
    })

    setMatchesWithDetails(details)
    setLoadingDetails(false)
  }

  const handleMatchClick = (match: MatchWithDetails) => {
    setSelectedMatch(match)
    setShowMatchModal(true)
  }

  const handleCloseModal = async () => {
    // Marquer comme lu à la fermeture du modal si pas encore notifié
    if (selectedMatch && !selectedMatch.isNotified && selectedMatch.myDeclaration) {
      const matchData = matches.find(m => m.id === selectedMatch.id)
      
      if (matchData) {
        const isUser1 = myDeclarationIds.includes(matchData.declaration_id_1)
        await markAsRead(selectedMatch.id, isUser1)
      }
    }
    
    setShowMatchModal(false)
    setSelectedMatch(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "À l'instant"
    if (diffMins < 60) return `Il y a ${diffMins} min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffDays < 7) return `Il y a ${diffDays}j`
    
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short' 
    })
  }

  if (loading || loadingDetails) {
    return (
      <Card className="p-8 border-0 bg-white shadow-purple overflow-hidden relative animate-pulse">
        {/* Floating gradient circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/10 rounded-full blur-2xl" />
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-7 bg-gray-200 rounded-lg w-48" />
            <div className="h-4 bg-gray-200 rounded-lg w-32" />
          </div>
        </div>
        
        {/* Skeleton pour les notifications */}
        <div className="space-y-4 relative z-10">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
                  <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
                </div>
                <div className="w-20 h-6 bg-gray-200 rounded-full" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-16" />
                  <div className="h-5 bg-gray-200 rounded w-24" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-16" />
                  <div className="h-5 bg-gray-200 rounded w-24" />
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="h-10 bg-gray-200 rounded-xl flex-1" />
                <div className="h-10 bg-gray-200 rounded-xl flex-1" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className="p-8 border-0 bg-white shadow-purple overflow-hidden relative hover-scale">
        {/* Floating gradient circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/10 rounded-full blur-2xl" />
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl gradient-primary shadow-pink flex items-center justify-center float-animation relative">
              {unreadCount > 0 ? (
                <BellRing className="w-7 h-7 text-white animate-pulse" />
              ) : (
                <Bell className="w-7 h-7 text-white" />
              )}
              {unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 gradient-accent text-white text-xs font-bold border-2 border-white shadow-orange animate-bounce">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Notifications 🔔
              </h2>
              <p className="text-sm font-medium text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} nouveau${unreadCount > 1 ? 'x' : ''} match${unreadCount > 1 ? 's' : ''} ! 🎉` : 'Tout est à jour ✨'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          {matchesWithDetails.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-5 float-animation">
                <Eye className="w-10 h-10 text-primary" />
              </div>
              <p className="text-foreground font-semibold text-lg mb-2">
                Aucun match pour le moment 👀
              </p>
              <p className="text-muted-foreground text-sm">
                Tu seras notifié dès qu'une correspondance est trouvée ! 💫
              </p>
            </div>
          ) : (
            matchesWithDetails.map((match) => (
              <div
                key={match.id}
                onClick={() => handleMatchClick(match)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden group ${
                  !match.isNotified
                    ? 'bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-primary/30 shadow-lg hover:shadow-pink hover:scale-[1.02]'
                    : 'bg-gray-50 border-gray-200 hover:border-primary/20 hover:shadow-md hover:scale-[1.01]'
                }`}
              >
                {/* Shimmer effect for unread */}
                {!match.isNotified && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                )}
                
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      !match.isNotified 
                        ? 'gradient-primary shadow-pink' 
                        : 'bg-gray-200'
                    }`}>
                      {!match.isNotified ? (
                        <BellRing className="w-6 h-6 text-white animate-pulse" />
                      ) : (
                        <Check className="w-6 h-6 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-base mb-1 flex items-center gap-2">
                        <span>🎉 Match trouvé !</span>
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {match.myDeclaration && (
                          <>
                            Concernant{' '}
                            <span className="font-bold text-foreground">
                              {match.myDeclaration.first_name} {match.myDeclaration.last_name}
                            </span>
                          </>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span>⏱️</span>
                        {formatDate(match.created_at)}
                      </p>
                    </div>
                  </div>
                  {!match.isNotified && (
                    <Badge className="gradient-accent text-white text-xs font-bold px-3 py-1 shadow-orange animate-pulse border-0">
                      Nouveau
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Modal de détails du match - Dating App Style */}
      <Dialog open={showMatchModal} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[550px] bg-white border-0 shadow-2xl p-0 overflow-hidden">
          {/* Gradient Header avec effet flottant */}
          <div className="gradient-primary p-8 relative overflow-hidden">
            {/* Floating light effects */}
            <div className="absolute top-2 right-4 w-20 h-20 bg-white/20 rounded-full blur-xl" />
            <div className="absolute -top-4 left-8 w-16 h-16 bg-white/10 rounded-full blur-lg" />
            <div className="absolute bottom-4 right-12 w-12 h-12 bg-white/15 rounded-full blur-md" />
            
            <DialogHeader className="relative z-10">
              <div className="flex items-center justify-center mb-5">
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center float-animation">
                  <BellRing className="w-10 h-10 text-white animate-pulse" />
                </div>
              </div>
              <DialogTitle className="text-3xl font-bold text-center text-white mb-2">
                🎉 Match trouvé !
              </DialogTitle>
              <DialogDescription className="text-center text-base pt-2 text-white/90 font-medium">
                Une autre personne a également déclaré cette personne ! 💕
              </DialogDescription>
            </DialogHeader>
          </div>

          {selectedMatch?.myDeclaration && (
            <div className="space-y-5 p-6 sm:p-8">
              {/* Ta déclaration */}
              <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-2 border-primary/20 rounded-2xl p-5 hover-scale">
                <p className="text-xs font-semibold text-primary mb-3 uppercase tracking-wide">
                  ✨ Ta déclaration
                </p>
                <p className="font-bold text-2xl mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {selectedMatch.myDeclaration.first_name}{' '}
                  {selectedMatch.myDeclaration.last_name}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span>📍</span>
                  {selectedMatch.myDeclaration.country}
                </p>
              </div>

              {/* Alert box */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-2 border-orange-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-orange-700 mb-1">
                      ⚠️ Correspondance détectée
                    </p>
                    <p className="text-xs text-orange-600 leading-relaxed">
                      Une autre personne a déclaré quelqu'un avec un nom très similaire dans le même pays.
                      Par respect de l'anonymat, nous ne révélons pas l'identité de l'autre utilisateur.
                    </p>
                  </div>
                </div>
              </div>

              {/* Info box */}
              <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-5">
                <p className="text-xs text-center text-muted-foreground leading-relaxed">
                  🔒 <strong className="text-foreground">100% Anonyme :</strong> L'autre personne ne sait pas
                  que c'est toi. Vous avez tous les deux fait une déclaration mutuelle. ✨
                </p>
              </div>

              {/* Button */}
              <Button
                onClick={() => setShowMatchModal(false)}
                className="w-full gradient-primary text-white font-bold py-6 rounded-xl shadow-pink hover:shadow-xl transition-all hover:scale-105 active:scale-95 text-base"
              >
                Compris ! 👍
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
