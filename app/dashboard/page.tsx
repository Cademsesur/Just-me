"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eye, Bell, LogOut, Plus, Users, AlertTriangle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DeclarationModal } from "@/components/declaration-modal"

interface DemoUser {
  id: string
  email: string
  full_name: string
  avatar_url: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<DemoUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeclarationModalOpen, setIsDeclarationModalOpen] = useState(false)
  const [declarations, setDeclarations] = useState<any[]>([])

  useEffect(() => {
    const demoUserStr = localStorage.getItem("justme_demo_user")
    if (demoUserStr) {
      setUser(JSON.parse(demoUserStr))
    } else {
      router.push("/")
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("justme_demo_user")
    router.push("/")
  }

  const handleDeclarationSubmit = (data: { firstName: string; lastName: string; country: string }) => {
    console.log("[v0] New declaration:", data)
    setDeclarations([...declarations, { ...data, id: Date.now(), createdAt: new Date() }])
  }

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

  const hasDeclarations = declarations.length > 0

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0516] via-[#0a0a0a] to-[#0a0a0a] -z-10" />
      <div className="fixed top-0 left-0 w-full h-[40vh] bg-[radial-gradient(ellipse_at_top,rgba(109,40,217,0.08),transparent_50%)] -z-10" />

      {/* Header */}
      <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 bg-primary/5">
                <Eye className="w-5 h-5 text-primary animate-blink" />
                <span className="text-xl font-bold">JustMe</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative cursor-pointer hover:bg-primary/10">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full" />
              </Button>

              <div className="flex items-center gap-3 px-3 py-2 rounded-full border border-primary/20 bg-primary/5">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.full_name} />
                  <AvatarFallback className="bg-primary/20 text-primary">{user.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:inline">{user.full_name}</span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="cursor-pointer hover:bg-accent/10 hover:text-accent"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Welcome Section */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground">
            Bienvenue, {user.full_name.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground text-lg">
            Gère tes relations et découvre la vérité en toute confidentialité.
          </p>
        </div>

        {!hasDeclarations && (
          <Card className="p-8 sm:p-12 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 mb-8 sm:mb-12">
            <div className="text-center max-w-2xl mx-auto">
              <Eye className="w-20 h-20 text-primary mx-auto mb-6 animate-blink" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">Prêt à découvrir la vérité ?</h2>
              <p className="text-muted-foreground mb-8 text-lg sm:text-xl text-pretty">
                Fais ta première déclaration pour savoir si quelqu'un d'autre est avec cette personne.
              </p>
              <Button
                size="lg"
                onClick={() => setIsDeclarationModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 sm:px-12 py-6 sm:py-7 text-lg sm:text-xl rounded-full cursor-pointer font-semibold shimmer"
              >
                <Plus className="mr-2 w-6 h-6" />
                Faire ma première déclaration
              </Button>
            </div>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <Card className="p-6 border-primary/20 bg-card hover:border-primary/40 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{declarations.length}</p>
                <p className="text-sm text-muted-foreground">Déclarations actives</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-primary/20 bg-card hover:border-primary/40 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Alertes reçues</p>
              </div>
            </div>
          </Card>
        </div>

        {hasDeclarations && (
          <Card className="p-6 sm:p-8 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-foreground">Ajouter une nouvelle déclaration</h3>
                <p className="text-muted-foreground">
                  Tu peux déclarer autant de relations que tu veux, en toute anonymité.
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => setIsDeclarationModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-6 rounded-full cursor-pointer font-semibold shimmer whitespace-nowrap"
              >
                <Plus className="mr-2 w-5 h-5" />
                Nouvelle déclaration
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Declaration Modal */}
      <DeclarationModal
        open={isDeclarationModalOpen}
        onOpenChange={setIsDeclarationModalOpen}
        onSubmit={handleDeclarationSubmit}
      />
    </main>
  )
}
