"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Copy, RefreshCw } from "lucide-react"

export function MarketingModule({ userName }: { userName: string }) {
  const [contentType, setContentType] = useState("email")
  const [topic, setTopic] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    
    // Simulate IA response
    setTimeout(() => {
      const templates: Record<string, string> = {
        email: `Bonjour,\n\nSujet: ${topic || "Découvrez notre nouvelle offre"}\n\nVous êtes important pour nous. Découvrez comment ${topic || "nos produits"} peuvent transformer votre expérience.\n\n[Lien CTA]\n\nCordialement,\n${userName}`,
        post: `📢 ${topic || "Une grande annonce!"}\n\nDécouvrez comment on peut vous aider! 🎯\n\n✨ Avantage 1\n✨ Avantage 2\n✨ Avantage 3\n\nVous intéressé? 👇\n#OmniShop #Marketing`,
        sms: `Salut! ${topic || "Découvrez nos nouvelles offres"} 🎉. Cliquez ici: [LIEN]. Valable 48h seulement!`,
      }
      setGeneratedContent(templates[contentType] || "")
      setIsGenerating(false)
    }, 1500)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent)
  }

  return (
    <div className="space-y-6">
      {/* Templates */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-purple-500" />
            Générateur de Contenu
          </CardTitle>
          <CardDescription>Créez du contenu marketing automatiquement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Type Selection */}
          <div className="flex gap-2 flex-wrap">
            {["email", "post", "sms"].map((type) => (
              <Button
                key={type}
                variant={contentType === type ? "default" : "outline"}
                onClick={() => setContentType(type)}
                className="capitalize"
              >
                {type === "email" ? "📧 Email" : type === "post" ? "📱 Post" : "💬 SMS"}
              </Button>
            ))}
          </div>

          {/* Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">Sujet ou thème</label>
            <Input
              placeholder="Ex: Nouvelle collection d'été, Promotion Black Friday..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white gap-2"
          >
            <Sparkles className="size-4" />
            {isGenerating ? "Génération en cours..." : "Générer le contenu"}
          </Button>

          {/* Generated Content */}
          {generatedContent && (
            <div className="space-y-2">
              <label className="text-sm font-medium block">Contenu généré</label>
              <Textarea
                readOnly
                value={generatedContent}
                className="min-h-32 bg-muted/50"
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={copyToClipboard} className="flex-1 gap-2">
                  <Copy className="size-4" />
                  Copier
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGenerate}
                  className="gap-2"
                  disabled={isGenerating}
                >
                  <RefreshCw className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Campaign Templates */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Campagnes Prêtes</CardTitle>
          <CardDescription>Utilisez nos templates pré-configurés</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "Bienvenue", desc: "Pour nouveaux clients" },
            { name: "Relance", desc: "Pour clients inactifs" },
            { name: "Promo Flash", desc: "Offre limitée" },
            { name: "Cross-sell", desc: "Produits complémentaires" },
          ].map((template) => (
            <Button key={template.name} variant="outline" className="h-20 flex-col items-start justify-start p-4">
              <div className="font-semibold text-sm">{template.name}</div>
              <div className="text-xs text-muted-foreground">{template.desc}</div>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
