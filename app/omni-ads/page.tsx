"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { TopBar } from "@/components/dashboard/top-bar"
import { cn } from "@/lib/utils"

import {
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  Palette,
  Zap,
  Target,
  TrendingUp,
  Heart,
  Star,
  Image,
  Sparkles,
} from "lucide-react"

const templates = [
  { id: 1, name: "Minimaliste", icon: Palette, description: "Épuré & moderne" },
  { id: 2, name: "Dynamique", icon: Zap, description: "Énergique & vif" },
  { id: 3, name: "Premium", icon: Star, description: "Luxe & élégance" },
  { id: 4, name: "Urgence", icon: Target, description: "Promotion & CTA" },
  { id: 5, name: "Tendance", icon: TrendingUp, description: "Style viral" },
  { id: 6, name: "Émotion", icon: Heart, description: "Storytelling" },
  { id: 7, name: "Minimaliste", icon: Palette, description: "Épuré & moderne" },
  { id: 8, name: "Dynamique", icon: Zap, description: "Énergique & vif" },
]

export default function OmniAdsPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/login")
        return
      }
      const metadata = session.user.user_metadata
      setUserName(metadata?.full_name || "Vendeur")
    }
    checkAuth()
  }, [router])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = () => {
    if (!selectedImage || !selectedTemplate) return
    setIsGenerating(true)
    setTimeout(() => {
      setGeneratedImages(Array(6).fill(selectedImage))
      setIsGenerating(false)
    }, 2000)
  }

  const handlePrevTemplate = () => {
    setCurrentTemplateIndex((prev) => (prev > 0 ? prev - 1 : templates.length - 1))
    setSelectedTemplate(templates[currentTemplateIndex > 0 ? currentTemplateIndex - 1 : templates.length - 1].id)
  }

  const handleNextTemplate = () => {
    setCurrentTemplateIndex((prev) => (prev < templates.length - 1 ? prev + 1 : 0))
    setSelectedTemplate(templates[currentTemplateIndex < templates.length - 1 ? currentTemplateIndex + 1 : 0].id)
  }

  useEffect(() => {
    setSelectedTemplate(templates[currentTemplateIndex].id)
  }, [currentTemplateIndex])

  return (
    <div style={{ zoom: "1.25" }} className="fixed inset-0 flex overflow-hidden bg-background">
      <div className="hidden w-[260px] shrink-0 lg:block h-full">
        <SidebarNav />
      </div>

      <div className="flex flex-1 flex-col h-full overflow-hidden relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0'
          }}
        />

        <TopBar userName={userName} />

        <main className="h-full overflow-hidden px-6 py-6 relative z-10">
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6 shrink-0">
              <div>
                <h1 className="text-lg font-bold text-foreground">OmniAds</h1>
                <p className="text-[10px] text-muted-foreground">Transformez vos produits en publicités percutantes</p>
              </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden relative">
              <div className="absolute left-[420px] top-1/2 -translate-y-1/2 w-12 h-[2px] bg-violet-500/50 to-transparent z-0" />
              <div className="absolute left-[420px] top-1/2 -translate-y-1/2 w-12 h-[2px] bg-violet-500/50 to-transparent z-0" style={{ transform: 'translate(-50%, -50%) rotate(15deg)' }} />
              <div className="absolute left-[420px] top-1/2 -translate-y-1/2 w-12 h-[2px] bg-violet-500/50 to-transparent z-0" style={{ transform: 'translate(-50%, -50%) rotate(-15deg)' }} />

              {/* MODULE GAUCHE - INPUTS */}
              <div className="w-[400px] shrink-0 relative z-10">
                <div className="relative rounded-2xl p-[3px] h-full bg-[#a78bfa]">
                  <div className="relative rounded-[11px] bg-[#0a0b0e] h-full overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none rounded-[11px]" style={{
                      background: 'linear-gradient(180deg, rgba(167,139,250,0.15) 0%, rgba(167,139,250,0.05) 20%, transparent 35%)'
                    }} />
                    <div className="relative h-full p-5 flex flex-col">
                      <div className="flex items-center gap-3 mb-5">
                        <img src="/sparkles.png" alt="" className="size-10" />
                        <div>
                          <h3 className="text-sm font-bold text-white">Création Publicitaire</h3>
                          <p className="text-[10px] text-gray-400">2 étapes pour générer 6 variations</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="text-xs font-semibold text-gray-300 mb-2 block">
                          Étape 1 : Photo du produit
                        </label>
                        {!selectedImage ? (
                          <label className="block relative rounded-xl border-2 border-dashed border-violet-500/30 bg-[#0a0b0e] p-6 text-center cursor-pointer hover:border-violet-500/60 hover:bg-[#0f0f12] transition-colors">
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            <Upload className="size-8 text-violet-500/40 mx-auto mb-2" />
                            <p className="text-xs text-gray-400">Déposez une image ou cliquez pour importer</p>
                          </label>
                        ) : (
                          <div className="relative rounded-xl overflow-hidden border border-violet-500/20">
                            <img src={selectedImage} alt="Produit" className="w-full h-40 object-cover" />
                            <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 p-1.5 rounded-full bg-[#0a0b0e]/90 hover:bg-[#0a0b0e] cursor-pointer transition-colors">
                              <X className="size-4 text-gray-400" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* SELECT WINNING REFERENCE */}
                      <div className="relative flex-1">
                        <label className="text-xs font-semibold text-gray-300 mb-2 block">
                          Étape 2 : Select Winning Reference
                        </label>
                        
                        {/* CARD TEMPLATE 2:3 */}
                        <div className="relative h-full flex items-end pb-[88px]">
                          <div className="w-full aspect-[2/3] rounded-xl overflow-hidden border border-white/5 bg-[#121216]">
                            {(() => {
                              const CurrentIcon = templates[currentTemplateIndex].icon
                              return (
                                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                                  <CurrentIcon className="size-12 text-violet-400 mb-3" />
                                  <p className="text-sm font-bold text-white mb-1">{templates[currentTemplateIndex].name}</p>
                                  <p className="text-[10px] text-gray-400 text-center">{templates[currentTemplateIndex].description}</p>
                                </div>
                              )
                            })()}
                          </div>

                          {/* FLECHES NAVIGATION */}
                          <button
                            onClick={handlePrevTemplate}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[#121216]/90 hover:bg-[#1a1a1f] cursor-pointer transition-colors z-10"
                          >
                            <ChevronLeft className="size-5 text-gray-400" />
                          </button>
                          <button
                            onClick={handleNextTemplate}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[#121216]/90 hover:bg-[#1a1a1f] cursor-pointer transition-colors z-10"
                          >
                            <ChevronRight className="size-5 text-gray-400" />
                          </button>
                        </div>

                        {/* BOUTON GÉNÉRER (par dessus) */}
                        <button
                          onClick={handleGenerate}
                          disabled={!selectedImage || !selectedTemplate || isGenerating}
                          className={cn(
                            "absolute bottom-0 left-0 right-0 w-full py-3 rounded-xl text-white text-sm font-bold cursor-pointer transition-all",
                            !selectedImage || !selectedTemplate || isGenerating ? "bg-gray-700 cursor-not-allowed" : "bg-gradient-to-r from-violet-500 to-purple-500 hover:opacity-90"
                          )}
                        >
                          {isGenerating ? (
                            <span className="flex items-center justify-center gap-2">
                              <Sparkles className="size-4 animate-spin" />
                              Génération en cours...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              <Sparkles className="size-4" />
                              Générer 6 variations
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ZONE DROITE - RÉSULTATS */}
              <div className="flex-1 relative z-10">
                <div className="relative rounded-2xl p-[3px] h-full bg-[#a78bfa]">
                  <div className="relative rounded-[11px] bg-[#0a0b0e] h-full overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none rounded-[11px]" style={{
                      background: 'linear-gradient(180deg, rgba(167,139,250,0.15) 0%, rgba(167,139,250,0.05) 20%, transparent 35%)'
                    }} />
                    <div className="relative h-full p-5 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img src="/imageicon.png" alt="" className="size-10" />
                          <div>
                            <h3 className="text-sm font-bold text-white">Variations Publicitaires</h3>
                            <p className="text-[10px] text-gray-400">6 propositions générées par IA</p>
                          </div>
                        </div>
                        {generatedImages.length > 0 && (
                          <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold border border-violet-500/30">
                            {generatedImages.length} variations
                          </span>
                        )}
                      </div>

                      <div className="flex-1 overflow-y-auto">
                        {generatedImages.length === 0 ? (
                          <div className="grid grid-cols-3 gap-3 h-full">
                            {[...Array(6)].map((_, idx) => (
                              <div
                                key={idx}
                                className="relative rounded-xl overflow-hidden border border-white/5 bg-[#121216]"
                              >
                                <div
                                  className="w-full aspect-square bg-gradient-to-b from-[#1a1a1f] via-[#25252e] to-[#1a1a1f] bg-[length:100%_200%] animate-pulse"
                                  style={{
                                    animation: `shimmer 1.5s infinite ${idx * 166}ms`,
                                    background: `linear-gradient(180deg, #1a1a1f 0%, #25252e 50%, #1a1a1f 100%)`,
                                    backgroundSize: '100% 200%',
                                    animation: `shimmer 1.5s infinite ${idx * 166}ms`
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-3">
                            {generatedImages.map((img, idx) => (
                              <div key={idx} className="relative group rounded-xl overflow-hidden border border-white/5 bg-[#121216]">
                                <img src={img} alt={`Variation ${idx + 1}`} className="w-full aspect-square object-cover" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                  <button className="opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-lg bg-white text-gray-700 text-xs font-medium cursor-pointer transition-opacity hover:bg-gray-100">
                                    Télécharger
                                  </button>
                                </div>
                                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-medium">Variation {idx + 1}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 0% 100%;
          }
        }
      `}</style>
    </div>
  )
}
