"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye, Loader2 } from "lucide-react"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDemoLogin = async () => {
    setIsLoading(true)

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Set demo user in localStorage
    const demoUser = {
      id: "demo-user-" + Date.now(),
      email: "demo@justme.app",
      full_name: "Utilisateur Demo",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
    }

    localStorage.setItem("justme_demo_user", JSON.stringify(demoUser))

    // Redirect to dashboard
    window.location.href = "/dashboard"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-primary/20">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
              <Eye className="w-8 h-8 text-primary animate-blink" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-center text-foreground">Découvre la vérité</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground text-base pt-2">
            Connecte-toi pour commencer à vérifier. C'est rapide, anonyme et gratuit.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground text-center mb-3">
              OAuth Google ne fonctionne pas dans l'environnement de prévisualisation v0.
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Utilisez le mode démo pour tester l'interface. L'authentification réelle fonctionnera après déploiement.
            </p>
          </div>

          <Button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base rounded-full cursor-pointer font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              <>
                <Eye className="mr-2 h-5 w-5" />
                Tester avec un compte démo
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center px-4">
            En continuant, tu acceptes nos conditions d'utilisation et notre politique de confidentialité.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
