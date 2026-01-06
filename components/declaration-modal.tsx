"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Eye, Loader2, Check, ChevronsUpDown } from "lucide-react"
import { createDeclaration } from "@/lib/supabase/database"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface DeclarationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

// Liste complète des pays du monde avec drapeaux
const countries = [
  { name: "Afghanistan", flag: "🇦🇫" },
  { name: "Afrique du Sud", flag: "🇿🇦" },
  { name: "Albanie", flag: "🇦🇱" },
  { name: "Algérie", flag: "🇩🇿" },
  { name: "Allemagne", flag: "🇩🇪" },
  { name: "Andorre", flag: "🇦🇩" },
  { name: "Angola", flag: "🇦🇴" },
  { name: "Antigua-et-Barbuda", flag: "🇦🇬" },
  { name: "Arabie Saoudite", flag: "🇸🇦" },
  { name: "Argentine", flag: "🇦🇷" },
  { name: "Arménie", flag: "🇦🇲" },
  { name: "Australie", flag: "🇦🇺" },
  { name: "Autriche", flag: "🇦🇹" },
  { name: "Azerbaïdjan", flag: "🇦🇿" },
  { name: "Bahamas", flag: "🇧🇸" },
  { name: "Bahreïn", flag: "🇧🇭" },
  { name: "Bangladesh", flag: "🇧🇩" },
  { name: "Barbade", flag: "🇧🇧" },
  { name: "Belgique", flag: "🇧🇪" },
  { name: "Belize", flag: "🇧🇿" },
  { name: "Bénin", flag: "🇧🇯" },
  { name: "Bhoutan", flag: "🇧🇹" },
  { name: "Biélorussie", flag: "🇧🇾" },
  { name: "Birmanie", flag: "🇲🇲" },
  { name: "Bolivie", flag: "🇧🇴" },
  { name: "Bosnie-Herzégovine", flag: "🇧🇦" },
  { name: "Botswana", flag: "🇧🇼" },
  { name: "Brésil", flag: "🇧🇷" },
  { name: "Brunei", flag: "🇧🇳" },
  { name: "Bulgarie", flag: "🇧🇬" },
  { name: "Burkina Faso", flag: "🇧🇫" },
  { name: "Burundi", flag: "🇧🇮" },
  { name: "Cambodge", flag: "🇰🇭" },
  { name: "Cameroun", flag: "🇨🇲" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Cap-Vert", flag: "🇨🇻" },
  { name: "Centrafrique", flag: "🇨🇫" },
  { name: "Chili", flag: "🇨🇱" },
  { name: "Chine", flag: "🇨🇳" },
  { name: "Chypre", flag: "🇨🇾" },
  { name: "Colombie", flag: "🇨🇴" },
  { name: "Comores", flag: "🇰🇲" },
  { name: "Congo", flag: "🇨🇬" },
  { name: "Congo (RDC)", flag: "🇨🇩" },
  { name: "Corée du Nord", flag: "🇰🇵" },
  { name: "Corée du Sud", flag: "🇰🇷" },
  { name: "Costa Rica", flag: "🇨🇷" },
  { name: "Côte d'Ivoire", flag: "🇨🇮" },
  { name: "Croatie", flag: "🇭🇷" },
  { name: "Cuba", flag: "🇨🇺" },
  { name: "Danemark", flag: "🇩🇰" },
  { name: "Djibouti", flag: "🇩🇯" },
  { name: "Dominique", flag: "🇩🇲" },
  { name: "Égypte", flag: "🇪🇬" },
  { name: "Émirats Arabes Unis", flag: "🇦🇪" },
  { name: "Équateur", flag: "🇪🇨" },
  { name: "Érythrée", flag: "🇪🇷" },
  { name: "Espagne", flag: "🇪🇸" },
  { name: "Estonie", flag: "🇪🇪" },
  { name: "Eswatini", flag: "🇸🇿" },
  { name: "États-Unis", flag: "🇺🇸" },
  { name: "Éthiopie", flag: "🇪🇹" },
  { name: "Fidji", flag: "🇫🇯" },
  { name: "Finlande", flag: "🇫🇮" },
  { name: "France", flag: "🇫🇷" },
  { name: "Gabon", flag: "🇬🇦" },
  { name: "Gambie", flag: "🇬🇲" },
  { name: "Géorgie", flag: "🇬🇪" },
  { name: "Ghana", flag: "🇬🇭" },
  { name: "Grèce", flag: "🇬🇷" },
  { name: "Grenade", flag: "🇬🇩" },
  { name: "Guatemala", flag: "🇬🇹" },
  { name: "Guinée", flag: "🇬🇳" },
  { name: "Guinée-Bissau", flag: "🇬🇼" },
  { name: "Guinée Équatoriale", flag: "🇬🇶" },
  { name: "Guyana", flag: "🇬🇾" },
  { name: "Haïti", flag: "🇭🇹" },
  { name: "Honduras", flag: "🇭🇳" },
  { name: "Hongrie", flag: "🇭🇺" },
  { name: "Inde", flag: "🇮🇳" },
  { name: "Indonésie", flag: "🇮🇩" },
  { name: "Irak", flag: "🇮🇶" },
  { name: "Iran", flag: "🇮🇷" },
  { name: "Irlande", flag: "🇮🇪" },
  { name: "Islande", flag: "🇮🇸" },
  { name: "Israël", flag: "🇮🇱" },
  { name: "Italie", flag: "🇮🇹" },
  { name: "Jamaïque", flag: "🇯🇲" },
  { name: "Japon", flag: "🇯🇵" },
  { name: "Jordanie", flag: "🇯🇴" },
  { name: "Kazakhstan", flag: "🇰🇿" },
  { name: "Kenya", flag: "🇰🇪" },
  { name: "Kirghizistan", flag: "🇰🇬" },
  { name: "Kiribati", flag: "🇰🇮" },
  { name: "Koweït", flag: "🇰🇼" },
  { name: "Laos", flag: "🇱🇦" },
  { name: "Lesotho", flag: "🇱🇸" },
  { name: "Lettonie", flag: "🇱🇻" },
  { name: "Liban", flag: "🇱🇧" },
  { name: "Liberia", flag: "🇱🇷" },
  { name: "Libye", flag: "🇱🇾" },
  { name: "Liechtenstein", flag: "🇱🇮" },
  { name: "Lituanie", flag: "🇱🇹" },
  { name: "Luxembourg", flag: "🇱🇺" },
  { name: "Macédoine du Nord", flag: "🇲🇰" },
  { name: "Madagascar", flag: "🇲🇬" },
  { name: "Malaisie", flag: "🇲🇾" },
  { name: "Malawi", flag: "🇲🇼" },
  { name: "Maldives", flag: "🇲🇻" },
  { name: "Mali", flag: "🇲🇱" },
  { name: "Malte", flag: "🇲🇹" },
  { name: "Maroc", flag: "🇲🇦" },
  { name: "Marshall", flag: "🇲🇭" },
  { name: "Maurice", flag: "🇲🇺" },
  { name: "Mauritanie", flag: "🇲🇷" },
  { name: "Mexique", flag: "🇲🇽" },
  { name: "Micronésie", flag: "🇫🇲" },
  { name: "Moldavie", flag: "🇲🇩" },
  { name: "Monaco", flag: "🇲🇨" },
  { name: "Mongolie", flag: "🇲🇳" },
  { name: "Monténégro", flag: "🇲🇪" },
  { name: "Mozambique", flag: "🇲🇿" },
  { name: "Namibie", flag: "🇳🇦" },
  { name: "Nauru", flag: "🇳🇷" },
  { name: "Népal", flag: "🇳🇵" },
  { name: "Nicaragua", flag: "🇳🇮" },
  { name: "Niger", flag: "🇳🇪" },
  { name: "Nigeria", flag: "🇳🇬" },
  { name: "Norvège", flag: "🇳🇴" },
  { name: "Nouvelle-Zélande", flag: "🇳🇿" },
  { name: "Oman", flag: "🇴🇲" },
  { name: "Ouganda", flag: "🇺🇬" },
  { name: "Ouzbékistan", flag: "🇺🇿" },
  { name: "Pakistan", flag: "🇵🇰" },
  { name: "Palaos", flag: "🇵🇼" },
  { name: "Palestine", flag: "🇵🇸" },
  { name: "Panama", flag: "🇵🇦" },
  { name: "Papouasie-Nouvelle-Guinée", flag: "🇵🇬" },
  { name: "Paraguay", flag: "🇵🇾" },
  { name: "Pays-Bas", flag: "🇳🇱" },
  { name: "Pérou", flag: "🇵🇪" },
  { name: "Philippines", flag: "🇵🇭" },
  { name: "Pologne", flag: "🇵🇱" },
  { name: "Portugal", flag: "🇵🇹" },
  { name: "Qatar", flag: "🇶🇦" },
  { name: "Roumanie", flag: "🇷🇴" },
  { name: "Royaume-Uni", flag: "🇬🇧" },
  { name: "Russie", flag: "🇷🇺" },
  { name: "Rwanda", flag: "🇷🇼" },
  { name: "Saint-Christophe-et-Niévès", flag: "🇰🇳" },
  { name: "Saint-Marin", flag: "🇸🇲" },
  { name: "Saint-Vincent-et-les-Grenadines", flag: "🇻🇨" },
  { name: "Sainte-Lucie", flag: "🇱🇨" },
  { name: "Salomon", flag: "🇸🇧" },
  { name: "Salvador", flag: "🇸🇻" },
  { name: "Samoa", flag: "🇼🇸" },
  { name: "São Tomé-et-Principe", flag: "🇸🇹" },
  { name: "Sénégal", flag: "🇸🇳" },
  { name: "Serbie", flag: "🇷🇸" },
  { name: "Seychelles", flag: "🇸🇨" },
  { name: "Sierra Leone", flag: "🇸🇱" },
  { name: "Singapour", flag: "🇸🇬" },
  { name: "Slovaquie", flag: "🇸🇰" },
  { name: "Slovénie", flag: "🇸🇮" },
  { name: "Somalie", flag: "🇸🇴" },
  { name: "Soudan", flag: "🇸🇩" },
  { name: "Soudan du Sud", flag: "🇸🇸" },
  { name: "Sri Lanka", flag: "🇱🇰" },
  { name: "Suède", flag: "🇸🇪" },
  { name: "Suisse", flag: "🇨🇭" },
  { name: "Suriname", flag: "🇸🇷" },
  { name: "Syrie", flag: "🇸🇾" },
  { name: "Tadjikistan", flag: "🇹🇯" },
  { name: "Tanzanie", flag: "🇹🇿" },
  { name: "Tchad", flag: "🇹🇩" },
  { name: "Tchéquie", flag: "🇨🇿" },
  { name: "Thaïlande", flag: "🇹🇭" },
  { name: "Timor Oriental", flag: "🇹🇱" },
  { name: "Togo", flag: "🇹🇬" },
  { name: "Tonga", flag: "🇹🇴" },
  { name: "Trinité-et-Tobago", flag: "🇹🇹" },
  { name: "Tunisie", flag: "🇹🇳" },
  { name: "Turkménistan", flag: "🇹🇲" },
  { name: "Turquie", flag: "🇹🇷" },
  { name: "Tuvalu", flag: "🇹🇻" },
  { name: "Ukraine", flag: "🇺🇦" },
  { name: "Uruguay", flag: "🇺🇾" },
  { name: "Vanuatu", flag: "🇻🇺" },
  { name: "Vatican", flag: "🇻🇦" },
  { name: "Venezuela", flag: "🇻🇪" },
  { name: "Viêt Nam", flag: "🇻🇳" },
  { name: "Yémen", flag: "🇾🇪" },
  { name: "Zambie", flag: "🇿🇲" },
  { name: "Zimbabwe", flag: "🇿🇼" }
].sort((a, b) => a.name.localeCompare(b.name))

export function DeclarationModal({ open, onOpenChange, onSuccess }: DeclarationModalProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [country, setCountry] = useState("")
  const [countryOpen, setCountryOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log('📝 Création de déclaration...', { firstName, lastName, country })
      const result = await createDeclaration(firstName, lastName, country)
      console.log('📊 Résultat:', result)

      if (result.success && result.data) {
        console.log('✅ Succès!')
        toast({
          title: "✅ Déclaration enregistrée !",
          description: "Tu seras notifié en cas de correspondance.",
          duration: 5000,
        })

        // Reset form
        setFirstName("")
        setLastName("")
        setCountry("")
        onOpenChange(false)
        
        // Appel du callback de succès
        if (onSuccess) {
          onSuccess()
        }
      } else {
        // Afficher le message d'erreur spécifique
        console.log('❌ Erreur:', result.error)
        toast({
          title: "❌ Erreur",
          description: result.error || "Impossible d'enregistrer la déclaration. Réessaye.",
          duration: 7000,
        })
      }
    } catch (error) {
      console.error('💥 Exception lors de la création:', error)
      toast({
        title: "❌ Erreur",
        description: "Une erreur est survenue. Vérifie ta connexion.",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValid = firstName.trim() && lastName.trim() && country

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-white border-0 shadow-2xl overflow-hidden p-0">
        {/* Header avec gradient */}
        <div className="gradient-primary p-6 sm:p-8 relative overflow-hidden">
          {/* Effet de fond */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full blur-2xl" />
          </div>
          
          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Eye className="w-6 h-6 text-white animate-blink" />
              </div>
              <DialogTitle className="text-2xl sm:text-3xl font-black text-white">
                Nouvelle déclaration 💕
              </DialogTitle>
            </div>
            <DialogDescription className="text-white/90 text-base sm:text-lg leading-relaxed">
              Renseigne les informations de la personne avec qui tu es en relation. Ton identité reste <strong className="text-white font-bold">100% anonyme</strong>. 🔒
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form content */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-foreground font-semibold text-base flex items-center gap-2">
              Prénom <span className="text-primary">*</span>
            </Label>
            <Input
              id="firstName"
              placeholder="Ex: Marie"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-gray-50 border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl h-12 text-base transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-foreground font-semibold text-base flex items-center gap-2">
              Nom <span className="text-primary">*</span>
            </Label>
            <Input
              id="lastName"
              placeholder="Ex: Dupont"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-gray-50 border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl h-12 text-base transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="text-foreground font-semibold text-base flex items-center gap-2">
              Pays <span className="text-primary">*</span>
            </Label>
            <Popover open={countryOpen} onOpenChange={setCountryOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={countryOpen}
                  className="w-full justify-between bg-white border-2 border-primary/20 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:border-primary hover:text-black focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl h-12 text-base font-normal transition-all"
                >
                  {country ? (
                    <span className="flex items-center gap-2">
                      <span className="text-xl">{countries.find(c => c.name === country)?.flag}</span>
                      {country}
                    </span>
                  ) : (
                    "Sélectionne un pays"
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-white border-2 border-gray-200 rounded-xl shadow-xl" align="start">
                <Command className="bg-white rounded-xl">
                  <CommandInput placeholder="Rechercher un pays..." className="h-12 text-base" />
                  <CommandList>
                    <CommandEmpty>Aucun pays trouvé.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      {countries.map((c) => (
                        <CommandItem
                          key={c.name}
                          value={c.name}
                          onSelect={(currentValue) => {
                            setCountry(currentValue === country.toLowerCase() ? "" : c.name)
                            setCountryOpen(false)
                          }}
                          className="cursor-pointer hover:bg-primary/10 rounded-lg"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              country === c.name ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span className="flex items-center gap-2">
                            <span className="text-xl">{c.flag}</span>
                            {c.name}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Info box avec gradient subtil */}
          <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-2 border-primary/20 rounded-2xl p-5">
            <p className="text-sm sm:text-base text-foreground leading-relaxed">
              <strong className="font-bold text-primary">🔐 100% Anonyme :</strong> Personne ne saura que c'est toi qui as fait
              cette déclaration. Seule une <strong className="font-bold">correspondance mutuelle</strong> sera révélée. ✨
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 cursor-pointer border-2 border-primary/20 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:border-primary hover:text-black rounded-xl h-12 font-semibold transition-all hover:scale-105 active:scale-95"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 gradient-primary hover:opacity-90 text-white cursor-pointer font-bold rounded-xl h-12 shadow-pink hover:shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-5 w-5" />
                  Valider la déclaration
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
