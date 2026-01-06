import { createClient } from '@/lib/supabase/client'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  provider: string | null
  last_sign_in_at: string | null
  total_declarations: number
  total_alerts: number
  created_at: string
  updated_at: string
}

export interface Declaration {
  id: string
  user_id: string
  first_name: string
  last_name: string
  country: string
  person_hash: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Match {
  id: string
  declaration_id_1: string
  declaration_id_2: string
  person_hash: string
  match_score: number // Score de similarité (0.0 à 1.0)
  user_1_notified: boolean
  user_2_notified: boolean
  created_at: string
}

/**
 * Récupère le profil de l'utilisateur connecté
 */
export async function getUserProfile(): Promise<Profile | null> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

/**
 * Met à jour le profil de l'utilisateur
 */
export async function updateUserProfile(updates: Partial<Profile>): Promise<Profile | null> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return null
  }

  return data
}

/**
 * Génère un hash pour une personne (pour le matching anonyme)
 * Version client-side utilisant Web Crypto API avec normalisation avancée
 */
export async function generatePersonHash(
  firstName: string,
  lastName: string,
  country: string
): Promise<string> {
  // Fonction pour normaliser et extraire le prénom principal
  const normalizeFirstName = (name: string): string => {
    let normalized = name.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    
    // Supprime les tirets et espaces pour prendre uniquement le premier prénom
    // "Marie-Anne" → "marie"
    // "Marie Anne" → "marie"
    // "Jean-Pierre" → "jean"
    normalized = normalized.split(/[-\s]+/)[0]
    
    return normalized
  }
  
  // Fonction pour normaliser le nom de famille
  const normalizeLastName = (name: string): string => {
    let normalized = name.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    
    // Supprime tous les espaces et tirets
    // "De La Cruz" → "delacruz"
    // "Van-Berg" → "vanberg"
    normalized = normalized.replace(/[-\s]+/g, '')
    
    return normalized
  }
  
  // Normalise les données
  const normalizedFirst = normalizeFirstName(firstName)
  const normalizedLast = normalizeLastName(lastName)
  const normalizedCountry = country.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  
  // Combine les données
  const combined = `${normalizedFirst}|${normalizedLast}|${normalizedCountry}`
  
  console.log('🔍 Hash generation:', {
    original: { firstName, lastName, country },
    normalized: { first: normalizedFirst, last: normalizedLast, country: normalizedCountry },
    combined
  })
  
  // Génère le hash SHA-256
  const encoder = new TextEncoder()
  const data = encoder.encode(combined)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  
  // Convertit en string hexadécimal
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  return hashHex
}

/**
 * Crée une nouvelle déclaration
 */
export async function createDeclaration(
  firstName: string,
  lastName: string,
  country: string
): Promise<{ success: boolean; data?: Declaration; error?: string }> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Utilisateur non connecté' }
  }

  try {
    // Génère le hash
    const personHash = await generatePersonHash(firstName, lastName, country)

    // Vérifier si une déclaration similaire existe déjà
    const { data: existingDeclarations } = await supabase
      .from('declarations')
      .select('id, first_name, last_name, country')
      .eq('user_id', user.id)
      .eq('person_hash', personHash)
      .eq('is_active', true)
      .limit(1)

    if (existingDeclarations && existingDeclarations.length > 0) {
      const existing = existingDeclarations[0]
      return { 
        success: false, 
        error: `Tu as déjà déclaré ${existing.first_name} ${existing.last_name} (${existing.country})` 
      }
    }

    // Créer la nouvelle déclaration
    const { data, error } = await supabase
      .from('declarations')
      .insert({
        user_id: user.id,
        first_name: firstName,
        last_name: lastName,
        country: country,
        person_hash: personHash
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Error creating declaration:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      
      // Gérer l'erreur de contrainte unique
      if (error.code === '23505') {
        return { 
          success: false, 
          error: 'Cette déclaration existe déjà' 
        }
      }
      
      // Erreur de permissions RLS
      if (error.code === '42501' || error.message?.includes('policy')) {
        return { 
          success: false, 
          error: 'Permissions insuffisantes. Vérifie que les politiques RLS sont configurées.' 
        }
      }
      
      return { 
        success: false, 
        error: `Erreur: ${error.message || 'Impossible de créer la déclaration'}` 
      }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Unexpected error creating declaration:', error)
    return { 
      success: false, 
      error: 'Une erreur inattendue s\'est produite' 
    }
  }
}

/**
 * Récupère toutes les déclarations de l'utilisateur
 */
export async function getUserDeclarations(): Promise<Declaration[]> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('declarations')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching declarations:', error)
    return []
  }

  return data || []
}

/**
 * Supprime une déclaration
 */
export async function deleteDeclaration(declarationId: string): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('declarations')
    .delete()
    .eq('id', declarationId)

  if (error) {
    console.error('Error deleting declaration:', error)
    return false
  }

  return true
}

/**
 * Désactive une déclaration (soft delete)
 */
export async function deactivateDeclaration(declarationId: string): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('declarations')
    .update({ is_active: false })
    .eq('id', declarationId)

  if (error) {
    console.error('Error deactivating declaration:', error)
    return false
  }

  return true
}

/**
 * Récupère les matches de l'utilisateur
 */
export async function getUserMatches(): Promise<Match[]> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Récupère d'abord les déclarations de l'utilisateur
  const declarations = await getUserDeclarations()
  const declarationIds = declarations.map(d => d.id)

  if (declarationIds.length === 0) return []

  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .or(`declaration_id_1.in.(${declarationIds.join(',')}),declaration_id_2.in.(${declarationIds.join(',')})`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching matches:', error)
    return []
  }

  return data || []
}

/**
 * Marque un match comme notifié
 */
export async function markMatchAsNotified(matchId: string, isUser1: boolean): Promise<boolean> {
  const supabase = createClient()
  
  const field = isUser1 ? 'user_1_notified' : 'user_2_notified'
  
  const { error } = await supabase
    .from('matches')
    .update({ [field]: true })
    .eq('id', matchId)

  if (error) {
    console.error('Error marking match as notified:', error)
    return false
  }

  return true
}

/**
 * Récupère les déclarations avec leurs matches
 */
export async function getDeclarationsWithMatches(): Promise<any[]> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('declarations_with_matches')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching declarations with matches:', error)
    return []
  }

  return data || []
}

/**
 * Compte le nombre de matches non notifiés
 */
export async function getUnreadMatchesCount(): Promise<number> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const declarations = await getUserDeclarations()
  const declarationIds = declarations.map(d => d.id)

  if (declarationIds.length === 0) return 0

  const { count, error } = await supabase
    .from('matches')
    .select('*', { count: 'exact', head: true })
    .or(`declaration_id_1.in.(${declarationIds.join(',')}),declaration_id_2.in.(${declarationIds.join(',')})`)
    .or('user_1_notified.eq.false,user_2_notified.eq.false')

  if (error) {
    console.error('Error counting unread matches:', error)
    return 0
  }

  return count || 0
}

/**
 * Vérifie si l'utilisateur a un profil
 */
export async function checkUserHasProfile(): Promise<boolean> {
  const profile = await getUserProfile()
  return profile !== null
}

/**
 * Crée manuellement un profil (utile pour migration)
 */
export async function createProfileManually(): Promise<Profile | null> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      email: user.email!,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      provider: user.app_metadata?.provider || null,
      last_sign_in_at: user.last_sign_in_at || null
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating profile:', error)
    return null
  }

  return data
}

/**
 * Récupère les statistiques globales de l'application
 */
export async function getGlobalStats() {
  const supabase = createClient()
  
  try {
    // Appeler la fonction SQL qui contourne les RLS pour les stats publiques
    const { data, error } = await supabase.rpc('get_global_stats')

    if (error) {
      console.error('Erreur RPC get_global_stats:', error)
      throw error
    }

    console.log('Stats depuis fonction RPC:', data)

    // La fonction RPC retourne un array avec un seul objet
    const stats = data && data.length > 0 ? data[0] : { total_users: 0, total_declarations: 0, total_matches: 0 }

    const result = {
      totalUsers: Number(stats.total_users) || 0,
      totalDeclarations: Number(stats.total_declarations) || 0,
      totalMatches: Number(stats.total_matches) || 0
    }

    console.log('Stats finales:', result)

    return result
  } catch (error) {
    console.error('Error fetching global stats:', error)
    return {
      totalUsers: 0,
      totalDeclarations: 0,
      totalMatches: 0
    }
  }
}
