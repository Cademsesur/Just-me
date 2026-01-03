"use client"

import { Button } from "@/components/ui/button"
import { InteractiveMap } from "@/components/interactive-map"
import { EnhancedStats } from "@/components/enhanced-stats"
import { AuthModal } from "@/components/auth-modal"
import { useEffect, useState } from "react"
import { Shield, Heart, Eye, CheckCircle2, Link2 } from "lucide-react"

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0516] via-[#0a0a0a] to-[#0a0a0a] -z-10" />
      <div className="fixed top-0 left-0 w-full h-[60vh] bg-[radial-gradient(ellipse_at_top,rgba(109,40,217,0.08),transparent_50%)] -z-10" />

      <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative pt-16 sm:pt-20 pb-20 sm:pb-32">
        <div
          className={`relative z-10 text-center max-w-5xl transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="mb-8 sm:mb-12 inline-flex items-center justify-center">
            <div className="flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 rounded-full border-2 border-primary/40 bg-primary/5 backdrop-blur-sm">
              <Eye className="w-5 h-5 sm:w-7 sm:h-7 text-primary animate-blink" />
              <span className="text-2xl sm:text-3xl font-bold tracking-wide text-foreground">JustMe</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-8 sm:mb-10 text-pretty leading-[1.05] tracking-tight px-4">
            <span className="block text-muted-foreground text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6 font-medium text-pretty">
              Ce doute qui te ronge.
            </span>
            Cette personne te <span className="text-primary">trompe-t-elle</span> ?
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 sm:mb-12 text-pretty max-w-3xl mx-auto leading-relaxed px-4 text-center">
            <strong className="text-foreground">L'infidélité existe.</strong> Les mensonges aussi.
            <br />
            Mais tu n'as plus à vivre dans l'incertitude.
          </p>

          <div className="flex justify-center mb-12 sm:mb-16 px-4">
            <Button
              onClick={() => setShowAuthModal(true)}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 sm:px-12 py-5 sm:py-6 text-base sm:text-lg rounded-full transition-all duration-200 hover:scale-[1.02] cursor-pointer font-semibold w-full sm:w-auto relative overflow-hidden shimmer-button"
            >
              <Eye className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              Vérifier maintenant
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-4">
            <div className="flex flex-col items-center gap-2 p-5 sm:p-6 rounded-xl border border-primary/20 bg-primary/5">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-primary mb-1" />
              <span className="text-sm sm:text-base font-semibold text-foreground">Totalement anonyme</span>
              <span className="text-xs sm:text-sm text-muted-foreground">Personne ne saura</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-5 sm:p-6 rounded-xl border border-primary/20 bg-primary/5">
              <Eye className="w-6 h-6 sm:w-7 sm:h-7 text-primary mb-1" />
              <span className="text-sm sm:text-base font-semibold text-foreground">2,1M utilisateurs</span>
              <span className="text-xs sm:text-sm text-muted-foreground">Actifs chaque jour</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-5 sm:p-6 rounded-xl border border-accent/30 bg-accent/5">
              <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-accent mb-1" />
              <span className="text-sm sm:text-base font-semibold text-foreground">47K tromperies</span>
              <span className="text-xs sm:text-sm text-muted-foreground">Dévoilées à ce jour</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-foreground">En ce moment même</span>
            </div>
          </div>

          <EnhancedStats />
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-pretty text-foreground px-4">
              Partout dans le monde
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg text-pretty">
              Des milliers de personnes cherchent la vérité. En ce moment.
            </p>
          </div>

          <InteractiveMap />
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 text-pretty leading-tight text-foreground px-4">
              Comment ça marche ?
            </h2>
            <p className="text-muted-foreground text-lg sm:text-xl text-pretty">Simple. Rapide. Efficace.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="relative p-6 sm:p-8 rounded-2xl border border-primary/20 bg-card hover:border-primary/40 transition-colors">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-5 sm:mb-6">
                <span className="text-2xl sm:text-3xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-foreground text-pretty">Crée ton compte</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty text-left">
                Inscription en 30 secondes via Google ou email. Totalement gratuit.
              </p>
            </div>

            <div className="relative p-6 sm:p-8 rounded-2xl border border-primary/20 bg-card hover:border-primary/40 transition-colors">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-5 sm:mb-6">
                <span className="text-2xl sm:text-3xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-foreground text-pretty">Fais ta déclaration</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty text-left">
                Indique anonymement avec qui tu es en couple. Rien n'est visible publiquement.
              </p>
            </div>

            <div className="relative p-6 sm:p-8 rounded-2xl border border-accent/30 bg-card hover:border-accent/50 transition-colors">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center mb-5 sm:mb-6">
                <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-accent" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-foreground text-pretty">Découvre la vérité</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty text-left">
                Si cette personne déclare quelqu'un d'autre,{" "}
                <strong className="text-accent">vous serez tous deux alertés</strong>. Instantanément.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <div className="mb-6 sm:mb-8">
            <Eye className="w-12 h-12 sm:w-14 sm:h-14 text-primary mx-auto animate-blink" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 sm:mb-8 text-pretty leading-tight text-foreground px-4">
            Tu mérites de savoir.
            <br />
            <span className="text-primary">Tu mérites la vérité</span>.
          </h2>

          <p className="text-lg sm:text-xl text-muted-foreground mb-10 sm:mb-12 text-pretty max-w-2xl mx-auto leading-relaxed px-4 text-center">
            Ne reste pas dans le doute. Rejoins les <strong className="text-foreground">2,1 millions</strong> de
            personnes qui ont choisi la clarté.
          </p>

          <Button
            onClick={() => setShowAuthModal(true)}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 sm:px-14 py-6 sm:py-7 text-lg sm:text-xl rounded-full transition-all duration-200 hover:scale-[1.02] mb-12 sm:mb-16 cursor-pointer font-semibold w-full sm:w-auto relative overflow-hidden shimmer-button"
          >
            <Eye className="mr-2 w-5 h-5 sm:w-6 sm:h-6" />
            Commencer maintenant
          </Button>

          <div className="space-y-6">
            <p className="text-xs sm:text-sm text-muted-foreground text-pretty">
              Partage JustMe à quelqu'un qui en a besoin
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center items-center px-4">
              <Button
                variant="outline"
                className="border-primary/40 hover:bg-primary/10 hover:border-primary rounded-full px-6 cursor-pointer bg-transparent w-full sm:w-auto"
              >
                <svg className="mr-2 w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="instagramGradient" cx="30%" cy="107%" r="150%">
                      <stop offset="0%" stopColor="#fdf497" />
                      <stop offset="5%" stopColor="#fdf497" />
                      <stop offset="45%" stopColor="#fd5949" />
                      <stop offset="60%" stopColor="#d6249f" />
                      <stop offset="90%" stopColor="#285AEB" />
                    </radialGradient>
                  </defs>
                  <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    rx="5"
                    stroke="url(#instagramGradient)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="12" cy="12" r="4" stroke="url(#instagramGradient)" strokeWidth="2" fill="none" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="url(#instagramGradient)" />
                </svg>
                Partager sur Instagram
              </Button>
              <Button
                variant="outline"
                className="border-primary/40 hover:bg-primary/10 hover:border-primary rounded-full px-6 cursor-pointer bg-transparent w-full sm:w-auto"
              >
                <svg className="mr-2 w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
                    fill="#25D366"
                  />
                  <path
                    d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.547 4.142 1.588 5.945L.057 24l6.304-1.654a11.963 11.963 0 005.683 1.448h.005c6.582 0 11.94-5.334 11.943-11.893a11.83 11.83 0 00-3.472-8.452zM12.045 21.785h-.004a9.925 9.925 0 01-5.058-1.383l-.362-.215-3.754.984.999-3.648-.236-.374a9.86 9.86 0 01-1.511-5.26c.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.892 6.993c-.002 5.45-4.436 9.884-9.842 9.884z"
                    fill="#25D366"
                  />
                </svg>
                Partager sur WhatsApp
              </Button>
              <Button
                variant="outline"
                className="border-primary/40 hover:bg-primary/10 hover:border-primary rounded-full px-6 cursor-pointer bg-transparent w-full sm:w-auto"
              >
                <Link2 className="mr-2 w-4 h-4" />
                Copier le lien
              </Button>
            </div>
          </div>
        </div>
      </section>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </main>
  )
}
