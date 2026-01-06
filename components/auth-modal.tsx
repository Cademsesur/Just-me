"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        console.error('Error logging in:', error.message)
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Error:', error)
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white border-0 shadow-2xl p-0 overflow-hidden">
        {/* Gradient Header avec effets flottants */}
        <div className="gradient-primary p-8 sm:p-10 relative overflow-hidden">
          {/* Floating light effects */}
          <div className="absolute top-4 right-8 w-24 h-24 bg-white/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute -top-6 left-12 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <div className="absolute bottom-6 right-16 w-16 h-16 bg-white/15 rounded-full blur-lg" style={{ animationDelay: '1s' }} />
          
          <DialogHeader className="relative z-10">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center float-animation shadow-xl">
                <Eye className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-blink" />
              </div>
            </div>
            <DialogTitle className="text-3xl sm:text-4xl font-extrabold text-center text-white mb-3">
              Découvre la vérité 💔
            </DialogTitle>
            <DialogDescription className="text-center text-white/90 text-base sm:text-lg pt-2 font-medium px-4">
              Connecte-toi pour commencer à vérifier.<br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              C'est <strong className="text-white">rapide</strong>, <strong className="text-white">anonyme</strong> et <strong className="text-white">gratuit</strong>. ✨
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content section */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Benefits badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
              <div className="text-2xl mb-1">🔒</div>
              <p className="text-xs font-bold text-primary">Anonyme</p>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl border border-secondary/20">
              <div className="text-2xl mb-1">⚡</div>
              <p className="text-xs font-bold text-secondary">Rapide</p>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl border border-accent/20">
              <div className="text-2xl mb-1">💯</div>
              <p className="text-xs font-bold text-accent">Gratuit</p>
            </div>
          </div>

          {/* Google Login Button */}
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 hover:border-primary/30 py-6 sm:py-7 text-base sm:text-lg rounded-xl cursor-pointer font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-3 h-6 w-6 animate-spin text-primary" />
                Connexion en cours...
              </>
            ) : (
              <>
                <svg className="mr-3 h-6 w-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuer avec Google
              </>
            )}
          </Button>

          {/* Info box */}
          <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-2 border-primary/20 rounded-2xl p-4">
            <p className="text-xs text-center text-muted-foreground leading-relaxed">
              🔐 <strong className="text-foreground">100% Sécurisé :</strong> Nous ne partageons jamais tes données.
              Ton identité reste <span className="text-primary font-semibold">totalement anonyme</span>. 💯
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
