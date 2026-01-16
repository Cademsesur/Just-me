"use client"

import { Button } from "@/components/ui/button"
import { EnhancedStats } from "@/components/enhanced-stats"
import { AuthModal } from "@/components/auth-modal"
import { useEffect, useState } from "react"
import { Shield, Heart, Eye, CheckCircle2, Link2, ChevronDown } from "lucide-react"
import { getGlobalStats } from "@/lib/supabase/database"

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
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

  // FAQ data
  const faqItems = [
    {
      icon: "⚖️",
      iconBg: "from-green-500/10 to-green-600/20",
      question: "Est-ce que c'est légal ?",
      answer: (
        <>
          <p className="mb-3"><strong className="text-foreground">100% légal.</strong> JusteMoi est une plateforme de <strong>déclarations volontaires</strong>. Chaque personne déclare son propre partenaire de son plein gré.</p>
          <p>✅ Pas de tracking, pas de surveillance, pas d'espionnage. Juste des personnes qui veulent vérifier leur situation.</p>
        </>
      )
    },
    {
      icon: "🔒",
      iconBg: "from-purple-500/10 to-purple-600/20",
      question: "Mon/ma partenaire saura-t-il/elle que je l'ai vérifié(e) ?",
      answer: (
        <>
          <p className="mb-3"><strong className="text-foreground">NON. Jamais.</strong> C'est le cœur même du système. Si <strong>personne d'autre</strong> n'a déclaré ton/ta partenaire, <strong className="text-primary">personne ne saura jamais</strong> que tu as fait une vérification.</p>
          <p>🛡️ Vous êtes alertés UNIQUEMENT si vous avez tous les deux déclaré des personnes différentes.</p>
        </>
      )
    },
    {
      icon: "🎁",
      iconBg: "from-pink-500/10 to-pink-600/20",
      question: "C'est vraiment 100% gratuit ? Aucun piège ?",
      answer: (
        <>
          <p className="mb-3"><strong className="text-foreground">Oui, totalement gratuit.</strong> Tu peux créer ton compte, déclarer ton/ta partenaire, et recevoir des alertes sans jamais payer un centime.</p>
          <p>💎 À l'avenir, on proposera peut-être une option payante pour <strong>voir qui a déclaré ton/ta partenaire</strong>. Mais la fonctionnalité de base restera <strong className="text-primary">gratuite pour toujours</strong>.</p>
        </>
      )
    },
    {
      icon: "🔧",
      iconBg: "from-blue-500/10 to-blue-600/20",
      question: "Comment ça fonctionne techniquement ?",
      answer: (
        <>
          <p className="mb-3">Notre algorithme intelligent vérifie <strong>instantanément</strong> si quelqu'un d'autre a déjà déclaré cette même personne.</p>
          <div className="space-y-2">
            <p>✅ <strong className="text-foreground">Pas de match ?</strong> → Tu vis tranquille.</p>
            <p>⚡ <strong className="text-foreground">Match détecté ?</strong> → Vous êtes alertés instantanément.</p>
          </div>
        </>
      )
    },
    {
      icon: "👁️",
      iconBg: "from-orange-500/10 to-orange-600/20",
      question: "Qui peut voir mes déclarations ?",
      answer: (
        <>
          <p className="mb-3"><strong className="text-foreground">PERSONNE.</strong> Tes déclarations sont <strong>100% privées et cryptées</strong>. Même nous, les créateurs de JusteMoi, on ne peut pas les voir.</p>
          <p>🔐 Seul toi peux voir tes propres déclarations. L'algorithme compare les empreintes cryptées, pas les noms en clair.</p>
        </>
      )
    },
    {
      icon: "🗑️",
      iconBg: "from-red-500/10 to-red-600/20",
      question: "Puis-je supprimer mes données à tout moment ?",
      answer: (
        <>
          <p className="mb-3"><strong className="text-foreground">Oui, absolument.</strong> Tu peux supprimer une déclaration spécifique ou ton compte complet à tout moment.</p>
          <p>♻️ Conformément au RGPD, toutes tes données seront <strong>définitivement supprimées</strong> de nos serveurs.</p>
        </>
      )
    },
    {
      icon: "✏️",
      iconBg: "from-yellow-500/10 to-yellow-600/20",
      question: "Et si je me trompe dans l'orthographe du nom ?",
      answer: (
        <>
          <p className="mb-3">Pas de panique ! Tu peux <strong>modifier ou supprimer</strong> une déclaration à tout moment.</p>
          <p>💡 Notre algorithme normalise les noms (majuscules, accents, espaces) pour éviter les erreurs.</p>
        </>
      )
    }
  ]

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
              <span className="text-xl sm:text-4xl font-extrabold tracking-wide text-white">JusteMoi</span>
            </div>
          </div>

          {/* Titre principal avec gradient - optimisé mobile */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 sm:mb-12 text-balance leading-[1.1] sm:leading-[1.05] tracking-tighter px-2 sm:px-4 animate-fade-in-up">
            Es-tu vraiment{" "}
            <span className="gradient-text-animated inline-block">
              le/la seul(e)
            </span>{" "}
            ? 💔
          </h1>

          {/* Sous-titre - taille réduite mobile */}
          <p className="text-lg sm:text-2xl md:text-3xl text-foreground/80 mb-10 sm:mb-14 text-balance max-w-4xl mx-auto leading-relaxed px-4 text-center font-medium animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <strong className="text-foreground">Le doute te ronge ?</strong> L'incertitude t'empêche d'avancer ? 😔
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            Il est temps de <span className="text-primary font-bold">reprendre le contrôle</span> et de <span className="text-primary font-bold">savoir enfin</span>. ✨
          </p>

          {/* CTA Button - full width mobile */}
          <div className="flex justify-center mb-12 sm:mb-20 px-4 animate-fade-in-scale" style={{ animationDelay: '0.4s' }}>
            <Button
              onClick={() => setShowAuthModal(true)}
              size="lg"
              className="gradient-primary hover:opacity-90 text-white px-8 sm:px-16 py-6 sm:py-9 text-base sm:text-2xl rounded-full transition-smooth hover:scale-105 active:scale-95 cursor-pointer font-bold shadow-pink hover-glow w-full sm:w-auto max-w-md group relative overflow-hidden"
            >
              <Eye className="mr-2 sm:mr-3 w-5 h-5 sm:w-7 sm:h-7 group-hover:animate-blink" />
              <span>Vérifier maintenant</span>
            </Button>
          </div>
          
          {/* Sous-texte CTA - nouveau */}
          <p className="text-sm sm:text-base text-foreground/60 mb-12 sm:mb-16 text-center px-4 animate-fade-in-up font-medium" style={{ animationDelay: '0.5s' }}>
            ⚡ 30 secondes • 🔒 100% anonyme • 🎁 Totalement gratuit
          </p>

          {/* Stats modernes - responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-7 max-w-5xl mx-auto px-4">
            <div className="flex flex-col items-center gap-2 sm:gap-3 p-6 sm:p-8 rounded-2xl bg-white shadow-pink hover-lift transition-smooth animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full gradient-primary flex items-center justify-center mb-1 sm:mb-2">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <span className="text-sm sm:text-lg font-bold text-foreground tracking-wide">Anonymat absolu 🔒</span>
              <span className="text-xs sm:text-base text-muted-foreground text-center">Personne ne saura jamais que tu as vérifié</span>
            </div>
            <div className="flex flex-col items-center gap-2 sm:gap-3 p-6 sm:p-8 rounded-2xl bg-white shadow-purple hover-lift transition-smooth animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
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
                {statsLoading ? 'Chargement...' : 'Ont déjà repris le contrôle'}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 sm:gap-3 p-6 sm:p-8 rounded-2xl bg-white shadow-orange hover-lift transition-smooth animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full gradient-accent flex items-center justify-center mb-1 sm:mb-2 animate-heartbeat">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <span className="text-sm sm:text-lg font-bold text-foreground tracking-wide">
                {statsLoading ? (
                  <span className="inline-block w-16 h-5 bg-gray-200 animate-pulse rounded"></span>
                ) : (
                  `${formatNumber(stats.totalMatches)} situation${stats.totalMatches > 1 ? 's' : ''} ✨`
                )}
              </span>
              <span className="text-xs sm:text-base text-muted-foreground text-center">
                {statsLoading ? 'Chargement...' : 'Clarifiées à ce jour'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section Pourquoi JusteMoi */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative bg-linear-to-b from-background to-background/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-20 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-2 sm:py-3 rounded-full bg-primary/10 border border-primary/20 mb-6 sm:mb-8">
              <span className="text-sm sm:text-base font-bold text-primary tracking-wide">Pourquoi JusteMoi ? 💡</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6 text-balance leading-tight px-2 sm:px-4 tracking-tighter">
              La première plateforme{" "}
              <span className="gradient-text-animated inline-block">
                collaborative
              </span>{" "}
              de vérification
            </h2>
            <p className="text-foreground/70 text-lg sm:text-2xl text-balance font-medium px-4 tracking-wide max-w-3xl mx-auto">
              Ni stalking, ni espionnage. Juste une <span className="text-primary font-bold">communauté qui s'entraide</span> pour vivre dans la transparence. ✨
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Carte 1: Système collaboratif */}
            <div className="relative p-6 sm:p-10 rounded-3xl bg-white shadow-pink hover-lift transition-smooth group animate-slide-in-left">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl gradient-primary shadow-lg flex items-center justify-center mb-5 sm:mb-6 float-animation group-hover:scale-110 transition-transform">
                <Link2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground text-balance tracking-wide">
                Système collaboratif unique 🤝
              </h3>
              <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed text-balance mb-4">
                JusteMoi fonctionne grâce à <strong className="text-foreground">la collaboration</strong>. Chacun déclare anonymement son partenaire. Si deux personnes déclarent des personnes différentes portant le même nom, <strong className="text-primary">elles sont toutes deux alertées instantanément</strong>.
              </p>
              <p className="text-xs sm:text-base text-foreground/60 leading-relaxed text-balance">
                💡 Plus on est nombreux, plus le système est efficace et protecteur pour tous.
              </p>
            </div>

            {/* Carte 2: Anonymat garanti */}
            <div className="relative p-6 sm:p-10 rounded-3xl bg-white shadow-purple hover-lift transition-smooth group animate-slide-in-right">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl gradient-secondary shadow-lg flex items-center justify-center mb-5 sm:mb-6 float-animation group-hover:scale-110 transition-transform" style={{ animationDelay: '0.5s' }}>
                <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground text-balance tracking-wide">
                Anonymat total garanti 🔒
              </h3>
              <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed text-balance mb-4">
                <strong className="text-foreground">Personne ne saura jamais que tu as vérifié</strong> quelqu'un, sauf si vous déclarez tous les deux des personnes différentes. Dans ce cas, vous êtes alertés mutuellement car la situation est ambiguë.
              </p>
              <p className="text-xs sm:text-base text-foreground/60 leading-relaxed text-balance">
                🛡️ Si pas de correspondance → tu vis tranquille, personne ne sait rien.
              </p>
            </div>

            {/* Carte 3: Gratuit pour toujours */}
            <div className="relative p-6 sm:p-10 rounded-3xl bg-white shadow-orange hover-lift transition-smooth group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl gradient-accent shadow-lg flex items-center justify-center mb-5 sm:mb-6 float-animation group-hover:scale-110 transition-transform" style={{ animationDelay: '1s' }}>
                <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground text-balance tracking-wide">
                Gratuit pour toujours 🎁
              </h3>
              <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed text-balance mb-4">
                Vérifier ton couple, créer des déclarations, recevoir des alertes : <strong className="text-foreground">tout est 100% gratuit</strong>. Notre mission est de rendre la transparence accessible à tous.
              </p>
              <p className="text-xs sm:text-base text-foreground/60 leading-relaxed text-balance">
                💎 Aucun abonnement, aucun paiement caché, jamais.
              </p>
            </div>

            {/* Carte 4: Résultats instantanés */}
            <div className="relative p-6 sm:p-10 rounded-3xl bg-white shadow-pink hover-lift transition-smooth group animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl gradient-primary shadow-lg flex items-center justify-center mb-5 sm:mb-6 float-animation group-hover:scale-110 transition-transform" style={{ animationDelay: '1.5s' }}>
                <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground text-balance tracking-wide">
                Résultats instantanés ⚡
              </h3>
              <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed text-balance mb-4">
                Dès que tu crées une déclaration, <strong className="text-foreground">notre algorithme intelligent vérifie instantanément</strong> s'il y a une correspondance. Si oui, tu es alerté immédiatement.
              </p>
              <p className="text-xs sm:text-base text-foreground/60 leading-relaxed text-balance">
                ⏱️ Pas d'attente, pas de délai. Tu sais tout de suite.
              </p>
            </div>
          </div>

          {/* CTA intermédiaire après "Pourquoi JusteMoi?" */}
          <div className="text-center mt-12 sm:mt-20">
            <div className="max-w-2xl mx-auto">
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                Convaincu(e) par le concept ? 🎯
              </p>
              <Button
                size="lg"
                className="text-sm sm:text-base md:text-lg px-8 sm:px-12 py-5 sm:py-6 rounded-2xl font-bold hover-lift shadow-elevated cursor-pointer"
                onClick={() => setShowAuthModal(true)}
              >
                Je veux être sûr(e) maintenant 💫
              </Button>
              <p className="text-xs sm:text-sm text-muted-foreground mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <span className="flex items-center gap-1">
                  ⚡ <strong>30 secondes</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  🔒 <strong>100% anonyme</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  🎁 <strong>Totalement gratuit</strong>
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Scénarios concrets - Storytelling */}
      <section className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8 relative bg-linear-to-b from-background to-background/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-20 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-2 sm:py-3 rounded-full bg-secondary/10 border border-secondary/20 mb-6 sm:mb-8">
              <span className="text-sm sm:text-base font-bold text-secondary tracking-wide">Histoires réelles 📖</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6 text-balance leading-tight px-2 sm:px-4 tracking-tighter">
              Et si c'était{" "}
              <span className="gradient-text-animated inline-block">
                ton histoire
              </span>{" "}
              ? 💭
            </h2>
            <p className="text-foreground/70 text-lg sm:text-2xl text-balance font-medium px-4 tracking-wide max-w-3xl mx-auto">
              Des milliers de personnes ont déjà utilisé JusteMoi. Voici ce qui leur est arrivé.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
            {/* Scénario 1 : Situation révélée */}
            <div className="relative p-6 sm:p-10 rounded-3xl bg-white shadow-pink hover-lift transition-smooth animate-slide-in-left">
              <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-linear-to-br from-primary/10 to-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-2xl sm:text-3xl">👤</span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">Sarah, 28 ans</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Lyon, France</p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-sm sm:text-base">1</span>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1">
                    <strong className="text-foreground">Des doutes depuis plusieurs semaines.</strong> Sarah sentait que Thomas, son copain, avait un comportement étrange.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-sm sm:text-base">2</span>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1">
                    <strong className="text-foreground">Elle déclare "Thomas" sur JusteMoi.</strong> En 30 secondes, c'est fait. Personne ne sait qu'elle a vérifié.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-sm sm:text-base">⚡</span>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1">
                    <strong className="text-accent">Alerte instantanée !</strong> Quelqu'un d'autre a aussi déclaré Thomas. <strong className="text-foreground">Sarah et cette autre personne</strong> sont toutes deux alertées de la situation.
                  </p>
                </div>

                <div className="p-4 sm:p-5 bg-linear-to-br from-green-50 to-green-100/50 border border-green-200 rounded-xl sm:rounded-2xl">
                  <p className="text-xs sm:text-sm text-green-800 leading-relaxed">
                    <strong className="block mb-2 text-sm sm:text-base">✨ Le résultat :</strong>
                    Sarah découvre qu'elle n'est pas la seule à déclarer Thomas. Elle a la <strong>confirmation de ses doutes</strong> et peut prendre une décision éclairée pour <strong>passer à autre chose</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Scénario 2 : Rassurance totale */}
            <div className="relative p-6 sm:p-10 rounded-3xl bg-white shadow-purple hover-lift transition-smooth animate-slide-in-right">
              <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-linear-to-br from-secondary/10 to-secondary/20 flex items-center justify-center shrink-0">
                  <span className="text-2xl sm:text-3xl">👤</span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">Marc, 32 ans</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Paris, France</p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-sm sm:text-base">1</span>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1">
                    <strong className="text-foreground">Une simple vérification.</strong> Marc voulait juste s'assurer que Julie, sa copine, est vraiment exclusive avec lui.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-sm sm:text-base">2</span>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1">
                    <strong className="text-foreground">Il déclare "Julie" sur JusteMoi.</strong> En quelques secondes, c'est fait. Totalement anonyme.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-sm sm:text-base">✅</span>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1">
                    <strong className="text-green-600">Aucune correspondance.</strong> Personne d'autre n'a déclaré Julie. <strong className="text-foreground">Marc est le seul</strong> à l'avoir déclarée.
                  </p>
                </div>

                <div className="p-4 sm:p-5 bg-linear-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl sm:rounded-2xl">
                  <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                    <strong className="block mb-2 text-sm sm:text-base">🛡️ Le résultat :</strong>
                    Marc a retrouvé sa <strong>paix d'esprit</strong>. Julie ne saura <strong className="text-primary">JAMAIS</strong> qu'il a vérifié. Il sait maintenant qu'il est vraiment le seul dans sa vie.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Message empathique */}
          <div className="mt-12 sm:mt-16 text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-base sm:text-xl text-foreground/80 font-medium max-w-3xl mx-auto leading-relaxed px-4">
              💙 <strong className="text-foreground">Aucun jugement.</strong> Juste la possibilité de{" "}
              <span className="text-primary font-bold">savoir</span>, pour pouvoir{" "}
              <span className="text-secondary font-bold">avancer</span>. 
              Que ce soit vers la clarté ou vers la tranquillité d'esprit.
            </p>
          </div>
        </div>
      </section>

      {/* Section Stats en temps réel - Redesigned */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-6 sm:mb-8">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-primary tracking-wide">EN DIRECT ⚡</span>
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
                Inscris-toi (30 sec) 🚀
              </h3>
              <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed text-balance mb-4">
                Connexion rapide via <span className="font-bold text-foreground">Google ou email</span>. Aucune information sensible demandée, juste ton nom pour te reconnaître.
              </p>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground/60">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>100% gratuit, toujours</span>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="relative p-6 sm:p-10 rounded-3xl bg-white shadow-purple hover-lift transition-smooth group animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl gradient-secondary shadow-lg flex items-center justify-center mb-5 sm:mb-8 float-animation group-hover:scale-110 transition-transform" style={{ animationDelay: '0.5s' }}>
                <span className="text-2xl sm:text-4xl font-black text-white">2</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground text-balance tracking-wide">
                Déclare ton/ta partenaire 💕
              </h3>
              <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed text-balance mb-4">
                Juste <span className="font-bold text-foreground">prénom + nom + pays</span>, rien de plus. <strong className="text-primary">PERSONNE</strong> ne peut voir que tu l'as déclaré(e).
              </p>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground/60">
                <Shield className="w-4 h-4 text-purple-500 shrink-0" />
                <span>Anonymat absolu garanti</span>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="relative p-6 sm:p-10 rounded-3xl bg-white shadow-orange hover-lift transition-smooth group animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl gradient-accent shadow-lg flex items-center justify-center mb-5 sm:mb-8 float-animation group-hover:scale-110 transition-transform" style={{ animationDelay: '1s' }}>
                <CheckCircle2 className="w-8 h-8 sm:w-12 sm:h-12 text-white group-hover:rotate-12 transition-transform" />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground text-balance tracking-wide">
                Reçois une alerte si besoin 🎯
              </h3>
              <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed text-balance mb-4">
                <strong className="text-foreground">Si ton/ta partenaire déclare quelqu'un d'autre</strong>, vous êtes <strong className="text-accent">tous les deux alertés instantanément</strong>. ⚡
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-green-600">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Pas de match ? Tu vis tranquille 😌</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground/60">
                  <Eye className="w-4 h-4 shrink-0" />
                  <span>Personne ne saura rien</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA intermédiaire après "Comment ça marche" */}
          <div className="text-center mt-12 sm:mt-20">
            <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-linear-to-br from-primary/5 via-secondary/5 to-accent/5 border border-primary/10">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                C'est simple, rapide et sécurisé. Qu'attends-tu ? ⏱️
              </p>
              <p className="text-sm sm:text-base text-muted-foreground mb-5 sm:mb-6 leading-relaxed">
                Plus tu attends, plus le doute grandit. Reprends le contrôle maintenant. 💪
              </p>
              <Button
                size="lg"
                className="text-sm sm:text-base md:text-lg px-8 sm:px-12 py-5 sm:py-6 rounded-2xl font-bold hover-lift shadow-elevated cursor-pointer"
                onClick={() => setShowAuthModal(true)}
              >
                Fini les doutes, je commence 🚀
              </Button>
              <p className="text-xs sm:text-sm text-muted-foreground mt-4">
                👥 {stats.totalUsers ? `${formatNumber(stats.totalUsers)} personnes` : 'Des milliers de personnes'} l'ont déjà fait aujourd'hui
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Redesigned */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background/50 to-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6">
              <span className="text-xs sm:text-sm font-semibold text-primary">Questions fréquentes 💬</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 bg-linear-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent leading-tight">
              Toutes tes questions ont une réponse 🤔
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Les réponses dont tu as besoin pour te sentir en sécurité
            </p>
          </div>

          {/* FAQ Accordion - Compact mais cohérent */}
          <div className="space-y-3 sm:space-y-4">
            {faqItems.map((faq, index) => (
              <div
                key={index}
                className={`rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300 ${
                  openFaqIndex === index
                    ? 'bg-white shadow-elevated border-2 border-primary/20'
                    : 'bg-white/80 shadow-soft border border-border/30 hover:border-primary/10 hover:shadow-lg'
                }`}
              >
                {/* Question Header */}
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full p-5 sm:p-7 flex items-center justify-between gap-4 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1">
                    <div
                      className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br ${faq.iconBg} flex items-center justify-center text-lg sm:text-xl transition-transform duration-300 ${
                        openFaqIndex === index ? 'scale-110' : ''
                      }`}
                    >
                      <span>{faq.icon}</span>
                    </div>
                    <h3
                      className={`text-base sm:text-lg md:text-xl font-bold transition-colors duration-300 ${
                        openFaqIndex === index ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`shrink-0 w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
                      openFaqIndex === index
                        ? 'rotate-180 text-primary'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>

                {/* Answer Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaqIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-5 sm:px-7 pb-5 sm:pb-7 pt-0">
                    <div className="pl-0 sm:pl-16 text-sm sm:text-base text-muted-foreground leading-relaxed space-y-3">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA après FAQ */}
          <div className="text-center mt-12 sm:mt-16">
            <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-linear-to-br from-primary/5 via-secondary/5 to-accent/5 border border-primary/10">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                Prêt(e) à en avoir le cœur net ? 💭
              </p>
              <Button
                size="lg"
                className="text-sm sm:text-base md:text-lg px-8 sm:px-10 py-5 sm:py-6 rounded-xl sm:rounded-2xl font-bold hover-lift shadow-elevated cursor-pointer"
                onClick={() => setShowAuthModal(true)}
              >
                Je vérifie maintenant ✨
              </Button>
              <p className="text-xs sm:text-sm text-muted-foreground mt-4 flex items-center justify-center gap-3 flex-wrap">
                <span>⚡ <strong>30 sec</strong></span>
                <span>•</span>
                <span>🔒 <strong>Anonyme</strong></span>
                <span>•</span>
                <span>🎁 <strong>Gratuit</strong></span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rejoins le mouvement Section - Redesigned */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-primary/5 via-secondary/5 to-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-6">
              <span className="text-xs sm:text-sm font-semibold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">Communauté 🌍</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              Plus on est nombreux, plus c'est efficace 🚀
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Rejoins la communauté qui fait bouger les choses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
            {/* Pourquoi rejoindre */}
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-border/50 shadow-soft hover:shadow-elevated transition-all hover-lift">
              <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center shadow-pink">
                  <span className="text-2xl sm:text-3xl">🎯</span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                  Pourquoi rejoindre ?
                </h3>
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-lg sm:text-xl">💪</span>
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-bold text-foreground mb-1">
                      Tu aides des milliers de personnes
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Chaque déclaration rend le système plus efficace pour tout le monde
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <span className="text-lg sm:text-xl">🔮</span>
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-bold text-foreground mb-1">
                      Accès anticipé aux nouvelles features
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Teste en avant-première : chat, révélation d'identité, et plus
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <span className="text-lg sm:text-xl">🎁</span>
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-bold text-foreground mb-1">
                      Parrainage & récompenses
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Programme de parrainage exclusif à venir
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comment participer */}
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-linear-to-br from-primary/5 to-secondary/5 border-2 border-primary/20 shadow-soft hover:shadow-elevated transition-all hover-lift">
              <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-linear-to-br from-secondary to-accent flex items-center justify-center shadow-purple">
                  <span className="text-2xl sm:text-3xl">💎</span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                  Comment participer ?
                </h3>
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center shrink-0 text-white font-bold text-sm sm:text-base">
                    1
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-bold text-foreground mb-1">
                      Utilise JusteMoi régulièrement
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Reste actif et contribue à la communauté
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-secondary to-accent flex items-center justify-center shrink-0 text-white font-bold text-sm sm:text-base">
                    2
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-bold text-foreground mb-1">
                      Partage discrètement
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Parle de JusteMoi à ceux qui en ont besoin
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-accent to-primary flex items-center justify-center shrink-0 text-white font-bold text-sm sm:text-base">
                    3
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-bold text-foreground mb-1">
                      Rejoins notre Discord
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Communauté bientôt disponible
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-white rounded-xl border border-primary/20">
                <p className="text-xs sm:text-sm text-center text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">🌟 Objectif :</strong> 101 000 membres pour rendre JusteMoi incontournable
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button
              size="lg"
              className="text-base sm:text-lg md:text-xl px-10 sm:px-14 py-6 sm:py-7 rounded-xl sm:rounded-2xl font-bold shadow-elevated hover-lift bg-linear-to-r from-primary via-secondary to-accent text-white cursor-pointer"
              onClick={() => setShowAuthModal(true)}
            >
              Je rejoins le mouvement maintenant 🚀
            </Button>
            <p className="text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-5">
              Rejoins {stats.totalUsers ? formatNumber(stats.totalUsers) : 'des milliers de'} personnes qui ont déjà repris le contrôle ✨
            </p>
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
              Tu mérites la paix d'esprit
            </span>
            .
          </h2>

          <p className="text-lg sm:text-2xl text-foreground/70 mb-10 sm:mb-16 text-balance max-w-3xl mx-auto leading-relaxed px-4 text-center font-medium tracking-wide">
            Ne reste pas dans le doute. Rejoins les{" "}
            {statsLoading ? (
              <span className="inline-block w-16 h-6 bg-gray-200 animate-pulse rounded align-middle"></span>
            ) : (
              <strong className="text-foreground font-bold">{formatNumber(stats.totalUsers)}</strong>
            )}{" "}
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
