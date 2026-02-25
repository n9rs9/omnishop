"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { TopBar } from "@/components/dashboard/top-bar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import {
  Image,
  Sparkles,
  Wand2,
  Zap,
  Layers,
  Download,
} from "lucide-react"

export default function OmniIAPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")

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

  return (
    <div style={{ zoom: "1.25" }} className="fixed inset-0 flex overflow-hidden bg-background">
      <div className="hidden w-[260px] shrink-0 lg:block h-full">
        <SidebarNav />
      </div>

      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <TopBar userName={userName} />

        <main className="h-full overflow-hidden px-6 py-6">
          <div className="h-full flex flex-col">
            {/* HEADER */}
            <div className="flex items-center gap-3 mb-3 shrink-0">
              <div>
                <h1 className="text-lg font-bold text-foreground">Omni IA</h1>
                <p className="text-[10px] text-muted-foreground">Votre assistant intelligent</p>
              </div>
            </div>

            {/* MODULE CRÉATION FLYER - Compact, ne dépasse pas le separator */}
            <div className="flex items-start justify-center pt-2">
              <div className="w-full max-w-[280px]">
                {/* 
                  STRUCTURE EN 4 COUCHES :
                  1. Contour extérieur épais dégradé bleu (3px)
                  2. Contour intérieur #0a0b0e (8px - épaisseur doublée)
                  3. Couche de fond #0a0b0e (intérieur du contour)
                  4. Gradient overlay bleu→transparent (s'arrête très tôt - 40%)
                */}
                
                {/* COUCHE 1 : CONTOUR EXTÉRIEUR ÉPAIS BLEU */}
                <div className="relative rounded-2xl p-[3px] bg-gradient-to-b from-blue-600 via-blue-500 to-blue-600 shadow-xl shadow-blue-500/30">
                  
                  {/* COUCHE 2 : CONTOUR INTÉRIEUR #0a0b0e (8px - épaisseur doublée) */}
                  <div className="relative rounded-[17px] p-[8px] bg-[#0a0b0e]">
                    
                    {/* COUCHE 3 : COUCHE DE FOND #0a0b0e */}
                    <div className="relative rounded-[9px] bg-[#0a0b0e] overflow-hidden">
                      
                      {/* BACKGROUND À POINTILLÉS (derrière le contenu) */}
                      <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                        backgroundSize: '12px 12px',
                        backgroundPosition: '0 0'
                      }} />
                      
                      {/* COUCHE 4 : GRADIENT OVERLAY (bleu → transparent, s'arrête très tôt - 40%) */}
                      <div className="absolute inset-0 pointer-events-none rounded-[9px]" style={{ 
                        background: 'linear-gradient(180deg, rgba(37,99,235,0.6) 0%, rgba(37,99,235,0.3) 25%, transparent 40%)' 
                      }} />
                      
                      {/* CONTENU (au-dessus du gradient et des pointillés) */}
                      <div className="relative z-10">
                        
                        {/* HEADER DU MODULE */}
                        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/5">
                          <div className="flex items-center gap-2">
                            <div className="size-8 rounded-md bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/40">
                              <Image className="size-4 text-white" />
                            </div>
                            <div>
                              <h2 className="text-xs font-bold text-white">Création de Flyer</h2>
                              <p className="text-[8px] text-muted-foreground">Générez des flyers</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold text-blue-300 bg-blue-500/20 border border-blue-500/30">
                              <Zap className="size-2.5 mr-1" />
                              IA
                            </span>
                          </div>
                        </div>

                        {/* CORPS DU MODULE */}
                        <div className="p-3">
                          {/* ZONE DE PRÉVISUALISATION */}
                          <div className="relative rounded-lg bg-[#121216] border border-white/5 p-3 mb-3">
                            <div className="aspect-video rounded-md bg-[#1a1a1f] border border-white/5 flex items-center justify-center mb-2">
                              <div className="text-center">
                                <Image className="size-6 text-muted-foreground/50 mx-auto mb-0.5" />
                                <p className="text-[9px] text-muted-foreground">Aperçu</p>
                              </div>
                            </div>
                            
                            {/* TAGS */}
                            <div className="flex flex-wrap gap-1">
                              <Tag icon={Layers} label="Templates" />
                              <Tag icon={Sparkles} label="IA" />
                              <Tag icon={Download} label="HD" />
                            </div>
                          </div>

                          {/* FEATURES LIST - GRID 2x2 */}
                          <div className="grid grid-cols-2 gap-1.5 mb-3">
                            <FeatureCard 
                              icon={Wand2} 
                              title="Génération" 
                              desc="Auto" 
                              gradient="from-blue-500 to-cyan-500"
                            />
                            <FeatureCard 
                              icon={Layers} 
                              title="Templates" 
                              desc="50+ modèles" 
                              gradient="from-purple-500 to-pink-500"
                            />
                            <FeatureCard 
                              icon={Image} 
                              title="Export" 
                              desc="PNG, PDF" 
                              gradient="from-green-500 to-emerald-500"
                            />
                            <FeatureCard 
                              icon={Zap} 
                              title="Rapide" 
                              desc="Quelques sec." 
                              gradient="from-yellow-500 to-orange-500"
                            />
                          </div>

                          {/* BOUTON D'ACTION */}
                          <Button className="w-full h-8 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold cursor-pointer shadow-lg shadow-blue-500/30 text-[10px] rounded-md">
                            <Wand2 className="mr-1 size-3.5" />
                            Créer mon flyer
                          </Button>

                          {/* BADGE GRATUITY */}
                          <div className="mt-2 text-center">
                            <span className="inline-flex items-center gap-1 text-[8px] font-medium text-muted-foreground">
                              <Sparkles className="size-2 text-blue-500" />
                              Gratuit & Illimité
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function Tag({ icon: Icon, label }: { icon: React.ElementType, label: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-medium text-muted-foreground bg-[#1a1a1f] border border-white/5 hover:border-white/10 transition-colors cursor-default">
      <Icon className="size-2.5" />
      {label}
    </span>
  )
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  desc, 
  gradient 
}: { 
  icon: React.ElementType
  title: string
  desc: string
  gradient: string
}) {
  return (
    <div className="rounded-md bg-[#121216] border border-white/5 p-2 hover:border-white/10 transition-colors">
      <div className={cn(
        "size-6 rounded-md mb-1.5 flex items-center justify-center bg-gradient-to-br",
        gradient
      )}>
        <Icon className="size-3 text-white" />
      </div>
      <p className="text-[9px] font-bold text-white mb-0.5">{title}</p>
      <p className="text-[8px] text-muted-foreground">{desc}</p>
    </div>
  )
}
