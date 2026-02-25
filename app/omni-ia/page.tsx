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
            <div className="flex items-center gap-3 mb-4 shrink-0">
              <div className="size-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Omni IA</h1>
                <p className="text-xs text-muted-foreground">Votre assistant intelligent</p>
              </div>
            </div>

            {/* MODULE CRÉATION FLYER */}
            <div className="flex-1 flex items-center justify-center pb-8">
              <div className="w-full max-w-lg">
                {/* 
                  STRUCTURE EN 3 COUCHES :
                  1. Contour extérieur épais dégradé (4px)
                  2. Couche intermédiaire sombre (intérieur du contour)
                  3. Gradient overlay coloré→transparent (du haut vers le bas)
                */}
                
                {/* COUCHE 1 : CONTOUR EXTÉRIEUR ÉPAIS */}
                <div className="relative rounded-3xl p-[4px] bg-gradient-to-b from-purple-600 via-pink-500 to-purple-600 shadow-2xl shadow-purple-500/30">
                  
                  {/* COUCHE 2 : COUCHE INTERMÉDIAIRE SOMBRE */}
                  <div className="relative rounded-[22px] bg-[#0d0d10]">
                    
                    {/* COUCHE 3 : GRADIENT OVERLAY (coloré → transparent) */}
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-600/40 via-pink-500/20 to-transparent pointer-events-none rounded-[22px]" />
                    
                    {/* CONTENU (au-dessus du gradient) */}
                    <div className="relative z-10">
                      
                      {/* HEADER DU MODULE */}
                      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="size-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/40">
                            <Image className="size-6 text-white" />
                          </div>
                          <div>
                            <h2 className="text-base font-bold text-white">Création de Flyer</h2>
                            <p className="text-[10px] text-muted-foreground">Générez des flyers professionnels</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold text-purple-300 bg-purple-500/20 border border-purple-500/30">
                            <Zap className="size-3 mr-1" />
                            IA Power
                          </span>
                        </div>
                      </div>

                      {/* CORPS DU MODULE */}
                      <div className="p-6">
                        {/* ZONE DE PRÉVISUALISATION */}
                        <div className="relative rounded-2xl bg-[#121216] border border-white/5 p-6 mb-5">
                          <div className="aspect-video rounded-xl bg-[#1a1a1f] border border-white/5 flex items-center justify-center mb-4">
                            <div className="text-center">
                              <Image className="size-12 text-muted-foreground/50 mx-auto mb-2" />
                              <p className="text-xs text-muted-foreground">Aperçu du flyer</p>
                            </div>
                          </div>
                          
                          {/* TAGS */}
                          <div className="flex flex-wrap gap-2">
                            <Tag icon={Layers} label="Templates" />
                            <Tag icon={Sparkles} label="IA Auto" />
                            <Tag icon={Download} label="Export HD" />
                          </div>
                        </div>

                        {/* FEATURES LIST - GRID 2x2 */}
                        <div className="grid grid-cols-2 gap-3 mb-5">
                          <FeatureCard 
                            icon={Wand2} 
                            title="Génération IA" 
                            desc="Création automatique" 
                            gradient="from-purple-500 to-pink-500"
                          />
                          <FeatureCard 
                            icon={Layers} 
                            title="Templates Pro" 
                            desc="50+ modèles inclus" 
                            gradient="from-blue-500 to-cyan-500"
                          />
                          <FeatureCard 
                            icon={Image} 
                            title="Export HD" 
                            desc="PNG, PDF, SVG" 
                            gradient="from-green-500 to-emerald-500"
                          />
                          <FeatureCard 
                            icon={Zap} 
                            title="Rapide" 
                            desc="Quelques secondes" 
                            gradient="from-yellow-500 to-orange-500"
                          />
                        </div>

                        {/* BOUTON D'ACTION */}
                        <Button className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold cursor-pointer shadow-xl shadow-purple-500/30 text-sm rounded-xl">
                          <Wand2 className="mr-2 size-5" />
                          Créer mon flyer
                        </Button>

                        {/* BADGE GRATUITY */}
                        <div className="mt-4 text-center">
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                            <Sparkles className="size-3 text-purple-500" />
                            Gratuit & Illimité avec Omni IA
                          </span>
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
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium text-muted-foreground bg-[#1a1a1f] border border-white/5 hover:border-white/10 transition-colors cursor-default">
      <Icon className="size-3.5" />
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
    <div className="rounded-xl bg-[#121216] border border-white/5 p-4 hover:border-white/10 transition-colors">
      <div className={cn(
        "size-9 rounded-xl mb-2.5 flex items-center justify-center bg-gradient-to-br",
        gradient
      )}>
        <Icon className="size-4 text-white" />
      </div>
      <p className="text-xs font-bold text-white mb-1">{title}</p>
      <p className="text-[10px] text-muted-foreground">{desc}</p>
    </div>
  )
}
