"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye } from "lucide-react"

interface DeclarationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { firstName: string; lastName: string; country: string }) => void
}

const countries = [
  "France",
  "Belgique",
  "Suisse",
  "Canada",
  "États-Unis",
  "Royaume-Uni",
  "Allemagne",
  "Espagne",
  "Italie",
  "Portugal",
  "Maroc",
  "Algérie",
  "Tunisie",
  "Sénégal",
  "Côte d'Ivoire",
  "Cameroun",
  "Congo",
  "Autre",
]

export function DeclarationModal({ open, onOpenChange, onSubmit }: DeclarationModalProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [country, setCountry] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSubmit({ firstName, lastName, country })

    // Reset form
    setFirstName("")
    setLastName("")
    setCountry("")
    setIsSubmitting(false)
    onOpenChange(false)
  }

  const isValid = firstName.trim() && lastName.trim() && country

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-primary/20">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Eye className="w-5 h-5 text-primary animate-blink" />
            </div>
            <DialogTitle className="text-2xl font-bold">Nouvelle déclaration</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground text-base">
            Renseigne les informations de la personne avec qui tu es en relation. Ton identité reste 100% anonyme.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-foreground font-medium">
              Prénom
            </Label>
            <Input
              id="firstName"
              placeholder="Ex: Marie"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-background border-primary/20 focus:border-primary/40"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-foreground font-medium">
              Nom
            </Label>
            <Input
              id="lastName"
              placeholder="Ex: Dupont"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-background border-primary/20 focus:border-primary/40"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="text-foreground font-medium">
              Pays
            </Label>
            <Select value={country} onValueChange={setCountry} required>
              <SelectTrigger className="bg-background border-primary/20 focus:border-primary/40">
                <SelectValue placeholder="Sélectionne un pays" />
              </SelectTrigger>
              <SelectContent className="bg-card border-primary/20">
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground text-pretty">
              <strong className="text-foreground">100% Anonyme :</strong> Personne ne saura que c'est toi qui as fait
              cette déclaration. Seule une correspondance mutuelle sera révélée.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 cursor-pointer border-primary/20 hover:bg-primary/5"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer font-semibold"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? "Envoi..." : "Valider la déclaration"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
