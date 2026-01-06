"use client"

import { Button } from "@/components/ui/button"
import { EnhancedStats } from "@/components/enhanced-stats"
import { AuthModal } from "@/components/auth-modal"
import { useEffect, useState } from "react"
import { Shield, Heart, Eye, CheckCircle2, Link2 } from "lucide-react"
import { getGlobalStats } from "@/lib/supabase/database"

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeclarations: 0,
    totalMatches: 0
  })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    setIsVisible(true)
    
    // Charger les stats
    loadStats()
    
    // Detect scroll for header background
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const loadStats = async () => {
    setStatsLoading(true)
    const globalStats = await getGlobalStats()
    setStats(globalStats)
    setStatsLoading(false)
  }

  // Formater les nombres avec des séparateurs
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  return (
    <main className="min-h-screen gradient-bg text-foreground overflow-x-hidden relative">
      {/* Fond moderne avec dégradé doux */}
      <div className="fixed inset-0 gradient-bg -z-10" />
      
      {/* Formes décoratives flottantes - cachées sur mobile pour performance */}
      <div className="hidden md:block fixed top-10 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="hidden md:block fixed top-1/3 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="hidden md:block fixed bottom-20 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative pt-20 sm:pt-20 pb-16 sm:pb-32">
        <div
          className={`relative z-10 text-center max-w-6xl w-full transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {/* Logo moderne - plus petit sur mobile */}
          <div className="mb-8 sm:mb-14 inline-flex items-center justify-center">
            <div className="flex items-center gap-2 sm:gap-3 px-5 sm:px-10 py-3 sm:py-5 rounded-full gradient-primary shadow-pink">
              <Eye className="w-5 h-5 sm:w-8 sm:h-8 text-white animate-blink" />
              <span className="text-xl sm:text-4xl font-extrabold tracking-wide text-white">JustMe</span>
            </div>
          </div>

          {/* Titre principal avec gradient - optimisé mobile */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 sm:mb-12 text-balance leading-[1.1] sm:leading-[1.05] tracking-tighter px-2 sm:px-4 animate-fade-in-up">
            Cette personne te{" "}
            <span className="gradient-text-animated inline-block">
              trompe-t-elle
            </span>{" "}
            ? 💔
          </h1>

          {/* Sous-titre - taille réduite mobile */}
          <p className="text-lg sm:text-2xl md:text-3xl text-foreground/80 mb-10 sm:mb-14 text-balance max-w-4xl mx-auto leading-relaxed px-4 text-center font-medium animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <strong className="text-foreground">L'infidélité existe.</strong> Les mensonges aussi. 😔
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            Mais tu n'as plus à vivre dans <span className="text-primary font-bold">l'incertitude</span>. ✨
          </p>

          {/* CTA Button - full width mobile */}
          <div className="flex justify-center mb-12 sm:mb-20 px-4 animate-fade-in-scale" style={{ animationDelay: '0.4s' }}>
            <Button
              onClick={() => setShowAuthModal(true)}
              size="lg"
              className="gradient-primary hover:opacity-90 text-white px-8 sm:px-16 py-6 sm:py-9 text-base sm:text-2xl rounded-full transition-smooth hover:scale-105 active:scale-95 cursor-pointer font-bold shadow-pink hover-glow w-full sm:w-auto max-w-md group relative overflow-hidden"
            >
              <Eye className="mr-2 sm:mr-3 w-5 h-5 sm:w-7 sm:h-7 group-hover:animate-blink" />
              <span>Découvrir la vérité</span>
            </Button>
          </div>

          {/* Stats modernes - responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-7 max-w-5xl mx-auto px-4">
            <div className="flex flex-col items-center gap-2 sm:gap-3 p-6 sm:p-8 rounded-2xl bg-white shadow-pink hover-lift transition-smooth animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full gradient-primary flex items-center justify-center mb-1 sm:mb-2">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <span className="text-sm sm:text-lg font-bold text-foreground tracking-wide">Totalement anonyme 🔒</span>
              <span className="text-xs sm:text-base text-muted-foreground text-center">Personne ne saura jamais</span>
            </div>
            <div className="flex flex-col items-center gap-2 sm:gap-3 p-6 sm:p-8 rounded-2xl bg-white shadow-purple hover-lift transition-smooth animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full gradient-secondary flex items-center justify-center mb-1 sm:mb-2">
                <Eye className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <span className="text-sm sm:text-lg font-bold text-foreground tracking-wide">
                {statsLoading ? (
                  <span className="inline-block w-16 h-5 bg-gray-200 animate-pulse rounded"></span>
                ) : (
                  `${formatNumber(stats.totalUsers)} utilisateur${stats.totalUsers > 1 ? 's' : ''} 🌍`
                )}
              </span>
              <span className="text-xs sm:text-base text-muted-foreground text-center">
                {statsLoading ? 'Chargement...' : 'Actifs sur la plateforme'}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 sm:gap-3 p-6 sm:p-8 rounded-2xl bg-white shadow-orange hover-lift transition-smooth animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full gradient-accent flex items-center justify-center mb-1 sm:mb-2 animate-heartbeat">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <span className="text-sm sm:text-lg font-bold text-foreground tracking-wide">
                {statsLoading ? (
                  <span className="inline-block w-16 h-5 bg-gray-200 animate-pulse rounded"></span>
                ) : (
                  `${formatNumber(stats.totalMatches)} tromperie${stats.totalMatches > 1 ? 's' : ''} 💔`
                )}
              </span>
              <span className="text-xs sm:text-base text-muted-foreground text-center">
                {statsLoading ? 'Chargement...' : 'Dévoilées à ce jour'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section Stats en temps réel */}
      <section className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-18 animate-fade-in-scale">
            <div className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-2 sm:py-3 rounded-full gradient-primary shadow-pink mb-6 sm:mb-8 animate-bounce-gentle">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white animate-pulse" />
              <span className="text-sm sm:text-base font-bold text-white tracking-wide">En ce moment même ⚡</span>
            </div>
          </div>

          <EnhancedStats />
        </div>
      </section>

      {/* Section Comment ça marche */}
      <section className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-24 animate-fade-in-up">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6 text-balance leading-tight px-2 sm:px-4 tracking-tighter">
              Comment ça marche ? 🤔
            </h2>
            <p className="text-foreground/70 text-lg sm:text-2xl text-balance font-medium px-4 tracking-wide">
              Simple. Rapide. <span className="text-primary font-bold">Efficace</span>. ✨
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
            {/* Étape 1 */}
            <div className="relative p-6 sm:p-10 rounded-3xl bg-white shadow-pink hover-lift transition-smooth group animate-slide-in-left">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl gradient-primary shadow-lg flex items-center justify-center mb-5 sm:mb-8 float-animation group-hover:scale-110 transition-transform">
                <span className="text-2xl sm:text-4xl font-black text-white">1</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground text-balance tracking-wide">
                Crée ton compte 🚀
              </h3>
              <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed text-balance">
                Inscription en <span className="font-bold text-foreground">30 secondes</span> via Google ou email. Totalement gratuit.
              </p>
            </div>

            {/* Étape 2 */}
            <div className="relative p-6 sm:p-10 rounded-3xl bg-white shadow-purple hover-lift transition-smooth group animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl gradient-secondary shadow-lg flex items-center justify-center mb-5 sm:mb-8 float-animation group-hover:scale-110 transition-transform" style={{ animationDelay: '0.5s' }}>
                <span className="text-2xl sm:text-4xl font-black text-white">2</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground text-balance tracking-wide">
                Fais ta déclaration 💕
              </h3>
              <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed text-balance">
                Indique <span className="font-bold text-foreground">anonymement</span> avec qui tu es en couple. Rien n'est visible publiquement.
              </p>
            </div>

            {/* Étape 3 */}
            <div className="relative p-6 sm:p-10 rounded-3xl bg-white shadow-orange hover-lift transition-smooth group animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl gradient-accent shadow-lg flex items-center justify-center mb-5 sm:mb-8 float-animation group-hover:scale-110 transition-transform" style={{ animationDelay: '1s' }}>
                <CheckCircle2 className="w-8 h-8 sm:w-12 sm:h-12 text-white group-hover:rotate-12 transition-transform" />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground text-balance tracking-wide">
                Découvre la vérité 🎯
              </h3>
              <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed text-balance">
                Si cette personne déclare quelqu'un d'autre,{" "}
                <strong className="text-accent font-bold">vous serez tous deux alertés</strong>. Instantanément. ⚡
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section finale CTA */}
      <section className="py-20 sm:py-36 px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-5xl mx-auto relative z-10 w-full animate-fade-in-up">
          <div className="mb-6 sm:mb-10">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full gradient-primary shadow-pink mx-auto flex items-center justify-center float-animation hover:scale-110 transition-transform cursor-pointer">
              <Eye className="w-8 h-8 sm:w-12 sm:h-12 text-white animate-blink" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 sm:mb-10 text-balance leading-tight px-4 tracking-tighter">
            Tu mérites de savoir. ✨
            <br />
            <span className="gradient-text-animated inline-block">
              Tu mérites la vérité
            </span>
            .
          </h2>

          <p className="text-lg sm:text-2xl text-foreground/70 mb-10 sm:mb-16 text-balance max-w-3xl mx-auto leading-relaxed px-4 text-center font-medium tracking-wide">
            Ne reste pas dans le doute. Rejoins les <strong className="text-foreground font-bold">2,1 millions</strong> de
            personnes qui ont choisi la <span className="text-primary font-bold">clarté</span>. 🌟
          </p>

          <Button
            onClick={() => setShowAuthModal(true)}
            size="lg"
            className="gradient-secondary hover:opacity-90 text-white px-10 sm:px-18 py-7 sm:py-10 text-lg sm:text-2xl rounded-full transition-smooth hover:scale-105 active:scale-95 cursor-pointer font-bold shadow-purple hover-glow w-full sm:w-auto max-w-md group relative overflow-hidden"
          >
            <Eye className="mr-2 sm:mr-3 w-6 h-6 sm:w-8 sm:h-8 group-hover:animate-blink" />
            <span className="block sm:inline">Commencer maintenant</span>
          </Button>
        </div>
      </section>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </main>
  )
}
