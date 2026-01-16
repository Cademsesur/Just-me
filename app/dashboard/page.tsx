"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Bell, BellRing, LogOut, Plus, Users, AlertTriangle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DeclarationModal } from "@/components/declaration-modal"
import { MatchesPanel } from "@/components/matches-panel"
import { createClient } from "@/lib/supabase/client"
import { useUser } from "@/hooks/use-user"
import { useMatches } from "@/hooks/use-matches"
import { getUserDeclarations } from "@/lib/supabase/database"
import type { User } from "@supabase/supabase-js"

interface DemoUser {
  id: string
  email: string
  full_name: string
  avatar_url: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user: supabaseUser, loading: supabaseLoading } = useUser()
  const { unreadCount } = useMatches()
  const [user, setUser] = useState<User | DemoUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeclarationModalOpen, setIsDeclarationModalOpen] = useState(false)
  const [declarations, setDeclarations] = useState<any[]>([])
  const [isLoadingDeclarations, setIsLoadingDeclarations] = useState(true)
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      // Priority 1: Use Supabase user if available
      if (supabaseUser) {
        setUser(supabaseUser)
        setIsLoading(false)
        return
      }

      // Priority 2: Try to get session directly
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setUser(session.user)
        setIsLoading(false)
        return
      }

      // No user found, redirect to home
      router.push("/")
      setIsLoading(false)
    }

    if (!supabaseLoading) {
      checkAuth()
    }
  }, [supabaseUser, supabaseLoading, router, supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const loadDeclarations = async () => {
    setIsLoadingDeclarations(true)
    const userDeclarations = await getUserDeclarations()
    setDeclarations(userDeclarations)
    setIsLoadingDeclarations(false)
  }

  const handleDeclarationSuccess = () => {
    // Recharger les déclarations après création
    loadDeclarations()
  }

  // Charger les déclarations au montage
  useEffect(() => {
    if (user) {
      loadDeclarations()
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Eye className="w-12 h-12 text-primary mx-auto mb-4 animate-blink" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  // Helper functions to safely access user properties
  const getUserName = () => {
    if ('full_name' in user) {
      return user.full_name
    }
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur'
  }

  const getUserAvatar = () => {
    if ('avatar_url' in user) {
      return user.avatar_url
    }
    return user.user_metadata?.avatar_url || "/placeholder.svg"
  }

  const hasDeclarations = declarations.length > 0

  return (
    <main className="min-h-screen gradient-bg text-foreground">
      {/* Fond moderne avec dégradé doux */}
      <div className="fixed inset-0 gradient-bg -z-10" />
      
      {/* Formes décoratives flottantes */}
      <div className="fixed top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="fixed bottom-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Header Navigation - Dating App Style */}
      <header className="border-b border-primary/10 bg-white/95 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 md:py-4">
          <div className="flex items-center justify-between gap-2">
            {/* Logo avec gradient */}
            <div className="flex items-center">
              <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-full gradient-primary shadow-pink transition-all duration-300 hover:scale-105 cursor-pointer">
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white animate-blink" />
                <span className="text-sm sm:text-base md:text-lg lg:text-xl font-extrabold tracking-wide text-white">JusteMoi</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Notification Bell */}
              <div className="relative group">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative cursor-pointer hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 rounded-full transition-all hover:scale-110 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  {unreadCount > 0 ? (
                    <BellRing className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary animate-pulse" />
                  ) : (
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                  {unreadCount > 0 && (
                    <Badge 
                      className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex items-center justify-center p-0 gradient-accent text-white text-[10px] sm:text-xs font-bold border border-white shadow-orange animate-bounce"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* User Profile Button */}
              <div className="relative">
                <button className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border border-primary/20 shadow-sm hover:shadow-pink hover:border-primary/30 transition-all hover:scale-105 cursor-pointer">
                  <Avatar className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 ring-1 sm:ring-2 ring-primary/30 ring-offset-1 sm:ring-offset-2">
                    <AvatarImage src={getUserAvatar()} alt={getUserName()} />
                    <AvatarFallback className="gradient-primary text-white font-bold text-xs sm:text-sm">{getUserName().charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-[11px] sm:text-xs md:text-sm font-bold hidden sm:inline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent max-w-20 sm:max-w-24 md:max-w-30 truncate">
                    {getUserName()}
                  </span>
                </button>
              </div>

              {/* Logout button */}
              <div className="relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="cursor-pointer hover:bg-red-50 hover:text-red-500 rounded-full transition-all hover:scale-110 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
        {/* Welcome Section moderne */}
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-14 text-center animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-2 sm:mb-3 md:mb-4 gradient-text-animated tracking-tight sm:tracking-tighter">
            Salut {getUserName().split(" ")[0]} ! 👋
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto px-2">
            Découvre la vérité sur tes relations en toute <span className="font-bold text-primary">confidentialité</span> 🔒
          </p>
        </div>

        {isLoadingDeclarations ? (
          // Skeleton de chargement
          <div className="space-y-6 sm:space-y-8 animate-pulse">
            {/* Grande card "Nouvelle déclaration" skeleton */}
            <Card className="p-8 sm:p-10 border-0 bg-gradient-to-br from-gray-100 to-gray-50 shadow-lg">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center sm:text-left space-y-3">
                  <div className="h-8 bg-gray-200 rounded-lg max-w-xs mx-auto sm:mx-0" />
                  <div className="h-5 bg-gray-200 rounded-lg max-w-md mx-auto sm:mx-0" />
                </div>
                <div className="h-14 w-56 bg-gray-200 rounded-full" />
              </div>
            </Card>
            
            {/* Deux petites cards Stats skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <Card className="p-7 sm:p-8 border-0 bg-gray-100 shadow-lg">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-12 bg-gray-200 rounded-lg w-20" />
                    <div className="h-4 bg-gray-200 rounded-lg w-32" />
                  </div>
                </div>
              </Card>
              <Card className="p-7 sm:p-8 border-0 bg-gray-100 shadow-lg">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-12 bg-gray-200 rounded-lg w-20" />
                    <div className="h-4 bg-gray-200 rounded-lg w-32" />
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Skeleton pour les déclarations actives */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <div className="h-8 bg-gray-200 rounded-lg w-64" />
                <div className="h-8 w-32 bg-gray-200 rounded-full" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6 border-0 bg-gray-100 shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200" />
                      <div className="h-6 w-16 bg-gray-200 rounded-full" />
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="h-3 bg-gray-200 rounded w-16 mb-1" />
                        <div className="h-5 bg-gray-200 rounded w-24" />
                      </div>
                      <div>
                        <div className="h-3 bg-gray-200 rounded w-16 mb-1" />
                        <div className="h-5 bg-gray-200 rounded w-32" />
                      </div>
                      <div>
                        <div className="h-3 bg-gray-200 rounded w-16 mb-1" />
                        <div className="h-4 bg-gray-200 rounded w-28" />
                      </div>
                      <div className="pt-3 border-t border-gray-300">
                        <div className="h-3 bg-gray-200 rounded w-full" />
                      </div>
                    </div>
                    
                    <div className="mt-4 h-10 bg-gray-200 rounded-lg" />
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : !hasDeclarations ? (
          <Card className="p-4 sm:p-8 md:p-12 border-0 gradient-primary shadow-pink mb-8 sm:mb-12 hover-lift transition-smooth overflow-hidden relative group animate-fade-in-scale">
            {/* Effet shimmer background */}
            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
              <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-white rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            
            <div className="text-center max-w-2xl mx-auto relative z-10">
              {/* Icon container */}
              <div className="mb-4 sm:mb-6 inline-block">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center float-animation group-hover:scale-110 transition-transform">
                  <Eye className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white animate-blink" />
                </div>
              </div>
              
              {/* Title */}
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold mb-3 sm:mb-4 md:mb-5 text-white drop-shadow-lg leading-tight">
                Prêt à découvrir la vérité ? 💫
              </h2>
              
              {/* Description */}
              <p className="text-white/90 mb-5 sm:mb-6 md:mb-8 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-lg mx-auto px-2">
                Fais ta première déclaration pour savoir si quelqu'un d'autre partage cette relation secrète...
              </p>
              
              {/* Button */}
              <Button
                size="lg"
                onClick={() => setIsDeclarationModalOpen(true)}
                className="bg-white hover:bg-white/90 text-primary w-full sm:w-auto px-6 sm:px-10 md:px-14 py-3.5 sm:py-4 md:py-6 lg:py-7 text-sm sm:text-base md:text-lg lg:text-xl rounded-full cursor-pointer font-bold shadow-xl hover-glow transition-smooth hover:scale-105 active:scale-95 group/btn inline-flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 shrink-0 group-hover/btn:rotate-90 transition-transform" />
                <span className="leading-tight">
                  Faire ma 1ère déclaration
                </span>
              </Button>
            </div>
          </Card>
        ) : null}

        {/* Quick Stats modernes - Style cohérent avec gradient backgrounds */}
        {!isLoadingDeclarations && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-7 mb-6 sm:mb-8 md:mb-10 lg:mb-14">
          {/* Card Déclarations */}
          <Card className="p-5 sm:p-6 md:p-7 lg:p-8 border-0 bg-linear-to-br from-primary/5 via-white to-white shadow-pink hover-lift transition-smooth group cursor-pointer relative overflow-hidden animate-slide-in-left">
            {/* Floating gradient circle */}
            <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-primary/10 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
            
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-xl sm:rounded-2xl gradient-primary shadow-pink flex items-center justify-center float-animation group-hover:scale-110 transition-transform shrink-0">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-3xl sm:text-4xl md:text-5xl font-black bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-0.5 sm:mb-1 tracking-tighter">
                  {declarations.length}
                </p>
                <p className="text-xs sm:text-sm md:text-base font-semibold text-muted-foreground">
                  Déclaration{declarations.length > 1 ? 's' : ''} active{declarations.length > 1 ? 's' : ''} 💕
                </p>
                {declarations.length > 0 && (
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-pulse" />
                    <p className="text-[10px] sm:text-xs text-primary/70 font-medium">En surveillance</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Card Alertes */}
          <Card className="p-5 sm:p-6 md:p-7 lg:p-8 border-0 bg-linear-to-br from-secondary/5 via-white to-white shadow-purple hover-lift transition-smooth group cursor-pointer relative overflow-hidden animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
            {/* Floating gradient circle */}
            <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-secondary/10 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
            
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-xl sm:rounded-2xl gradient-secondary shadow-purple flex items-center justify-center float-animation group-hover:scale-110 transition-transform shrink-0" style={{ animationDelay: '0.3s' }}>
                {unreadCount > 0 ? (
                  <BellRing className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-white animate-pulse" />
                ) : (
                  <Bell className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-3xl sm:text-4xl md:text-5xl font-black bg-linear-to-r from-secondary via-accent to-secondary bg-clip-text text-transparent mb-0.5 sm:mb-1 tracking-tighter">
                  {unreadCount}
                </p>
                <p className="text-xs sm:text-sm md:text-base font-semibold text-muted-foreground">
                  Alerte{unreadCount > 1 ? 's' : ''} reçue{unreadCount > 1 ? 's' : ''} 🔔
                </p>
                {unreadCount > 0 && (
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent animate-pulse" />
                    <p className="text-[10px] sm:text-xs text-accent/70 font-medium animate-bounce-gentle">Nouvelles notifications</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
        )}

        {!isLoadingDeclarations && hasDeclarations && (
          <Card className="p-5 sm:p-6 md:p-8 lg:p-10 border-0 bg-linear-to-br from-secondary/10 via-primary/5 to-accent/10 shadow-purple mb-6 sm:mb-8 md:mb-10 hover-lift transition-smooth group animate-fade-in-scale">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 gradient-text-animated">
                  Ajouter une nouvelle déclaration ✨
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg px-2 sm:px-0">
                  Tu peux déclarer autant de relations que tu veux, <span className="font-bold text-foreground">en toute anonymité</span> 🤫
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => setIsDeclarationModalOpen(true)}
                className="gradient-secondary hover:opacity-90 text-white px-6 sm:px-8 py-3 sm:py-4 md:py-5 lg:py-7 rounded-full cursor-pointer font-bold shadow-purple hover-glow transition-smooth hover:scale-105 active:scale-95 whitespace-nowrap group/btn w-full sm:w-auto text-sm sm:text-base md:text-lg"
              >
                <Plus className="mr-2 w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:rotate-90 transition-transform shrink-0" />
                Nouvelle déclaration
              </Button>
            </div>
          </Card>
        )}

        {/* Notifications Panel - Affiché en priorité si notifications */}
        {(showNotifications || unreadCount > 0) && (
          <div className="mb-10 sm:mb-14">
            <MatchesPanel />
          </div>
        )}

        {/* Liste des déclarations actives */}
        {!isLoadingDeclarations && hasDeclarations && (
          <div className="mb-6 sm:mb-8 md:mb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text-animated tracking-tighter">
                Mes déclarations actives 📋
              </h2>
              <Badge variant="secondary" className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 font-bold">
                {declarations.length} déclaration{declarations.length > 1 ? 's' : ''}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {declarations.map((declaration, index) => (
                <Card
                  key={declaration.id}
                  className="p-4 sm:p-5 md:p-6 border-0 bg-linear-to-br from-white via-primary/5 to-secondary/5 shadow-lg hover-lift transition-smooth group cursor-pointer animate-fade-in-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full gradient-primary shadow-pink flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-blink" />
                    </div>
                    <Badge className="bg-primary/10 text-primary border-0 font-semibold hover:bg-primary/20 text-xs">
                      Active
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-0.5 sm:mb-1">
                        Prénom
                      </p>
                      <p className="text-base sm:text-lg font-bold text-foreground truncate">
                        {declaration.first_name}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-0.5 sm:mb-1">
                        Nom
                      </p>
                      <p className="text-base sm:text-lg font-bold text-foreground truncate">
                        {declaration.last_name}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-0.5 sm:mb-1">
                        Pays
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1.5 sm:gap-2">
                        <span className="text-base sm:text-lg">🌍</span>
                        <span className="truncate">{declaration.country}</span>
                      </p>
                    </div>
                    
                    <div className="pt-2 sm:pt-3 border-t border-gray-200">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Déclaré le {new Date(declaration.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-[10px] sm:text-xs text-center text-muted-foreground">
                      🔒 <strong className="text-primary">100% Anonyme</strong> - En surveillance
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Declaration Modal */}
      <DeclarationModal
        open={isDeclarationModalOpen}
        onOpenChange={setIsDeclarationModalOpen}
        onSuccess={handleDeclarationSuccess}
      />
    </main>
  )
}
