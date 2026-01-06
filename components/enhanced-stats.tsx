"use client"

import { useEffect, useState } from "react"
import { Users, Heart, TrendingUp, Eye } from "lucide-react"
import { getGlobalStats } from "@/lib/supabase/database"

export function EnhancedStats() {
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalDeclarations, setTotalDeclarations] = useState(0)
  const [revealedDeceptions, setRevealedDeceptions] = useState(0)
  const [displayUsers, setDisplayUsers] = useState(0)
  const [displayDeclarations, setDisplayDeclarations] = useState(0)
  const [displayDeceptions, setDisplayDeceptions] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Charger les vraies stats depuis la base de données
  useEffect(() => {
    const loadStats = async () => {
      console.log('🔍 Début du chargement des stats...')
      setIsLoading(true)
      const stats = await getGlobalStats()
      console.log('📊 Stats reçues:', stats)
      setTotalUsers(stats.totalUsers)
      setTotalDeclarations(stats.totalDeclarations)
      setRevealedDeceptions(stats.totalMatches)
      setIsLoading(false)
      console.log('✅ Stats chargées:', {
        users: stats.totalUsers,
        declarations: stats.totalDeclarations,
        matches: stats.totalMatches
      })
    }
    loadStats()
  }, [])

  // Animation de compteur au montage (quand les stats sont chargées)
  useEffect(() => {
    if (isLoading) return

    const duration = 2000 // 2 secondes
    const steps = 60
    const stepDelay = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      
      // Utiliser Math.ceil pour garantir qu'on voit au moins 1 pendant l'animation
      setDisplayUsers(Math.ceil(totalUsers * progress))
      setDisplayDeclarations(Math.ceil(totalDeclarations * progress))
      setDisplayDeceptions(Math.ceil(revealedDeceptions * progress))

      if (currentStep >= steps) {
        clearInterval(interval)
        setDisplayUsers(totalUsers)
        setDisplayDeclarations(totalDeclarations)
        setDisplayDeceptions(revealedDeceptions)
      }
    }, stepDelay)

    return () => clearInterval(interval)
  }, [isLoading, totalUsers, totalDeclarations, revealedDeceptions])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 max-w-7xl mx-auto">
      {/* Total Users */}
      <div className="group text-center space-y-4 sm:space-y-5 transition-all hover:scale-105 duration-300">
        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full gradient-primary shadow-pink flex items-center justify-center mx-auto float-animation">
          <Users className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
        </div>
        {isLoading ? (
          <div className="h-20 sm:h-24 md:h-28 lg:h-32 flex items-center justify-center">
            <div className="w-48 sm:w-64 h-16 sm:h-20 bg-gray-200 animate-pulse rounded-lg" />
          </div>
        ) : (
          <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent tabular-nums">
            {displayUsers.toLocaleString()}
          </div>
        )}
        <p className="text-base sm:text-xl font-bold text-foreground">Utilisateurs totaux 🌍</p>
        <div className="h-7 sm:h-8">
          {!isLoading && displayUsers > 0 && (
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>En temps réel</span>
            </div>
          )}
        </div>
      </div>

      {/* Total Declarations */}
      <div className="group text-center space-y-4 sm:space-y-5 transition-all hover:scale-105 duration-300">
        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full gradient-secondary shadow-purple flex items-center justify-center mx-auto float-animation" style={{ animationDelay: '0.3s' }}>
          <Eye className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
        </div>
        {isLoading ? (
          <div className="h-20 sm:h-24 md:h-28 lg:h-32 flex items-center justify-center">
            <div className="w-48 sm:w-64 h-16 sm:h-20 bg-gray-200 animate-pulse rounded-lg" />
          </div>
        ) : (
          <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black bg-linear-to-r from-secondary to-accent bg-clip-text text-transparent tabular-nums">
            {displayDeclarations.toLocaleString()}
          </div>
        )}
        <p className="text-base sm:text-xl font-bold text-foreground">Déclarations actives 👁️</p>
        <div className="h-7 sm:h-8">
          {!isLoading && displayDeclarations > 0 && (
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-secondary/10 text-secondary text-xs sm:text-sm font-semibold">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>En temps réel</span>
            </div>
          )}
        </div>
      </div>

      {/* Revealed Deceptions */}
      <div className="group text-center space-y-4 sm:space-y-5 transition-all hover:scale-105 duration-300">
        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full gradient-accent shadow-orange flex items-center justify-center mx-auto float-animation" style={{ animationDelay: '0.6s' }}>
          <Heart className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
        </div>
        {isLoading ? (
          <div className="h-20 sm:h-24 md:h-28 lg:h-32 flex items-center justify-center">
            <div className="w-48 sm:w-64 h-16 sm:h-20 bg-gray-200 animate-pulse rounded-lg" />
          </div>
        ) : (
          <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black bg-linear-to-r from-accent to-primary bg-clip-text text-transparent tabular-nums">
            {displayDeceptions.toLocaleString()}
          </div>
        )}
        <p className="text-base sm:text-xl font-bold text-foreground">Tromperies dévoilées 💔</p>
        <div className="h-7 sm:h-8">
          {!isLoading && displayDeceptions > 0 && (
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-accent/10 text-accent text-xs sm:text-sm font-semibold">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>En temps réel</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
