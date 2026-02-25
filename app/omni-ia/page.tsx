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

            {/* MODULE CRÉATION FLYER - Style Gumloop Dark */}
            <div className="flex-1 flex items-center justify-center pb-8">
              <div className="w-full max-w-lg">
                {/* CARTE PRINCIPALE AVEC BORDURE DÉGRADÉE */}
                <div className="relative rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-purple-500/20 p-[1px]">
                  {/* CONTENU */}
                  <div className="relative rounded-2xl bg-[#0d0d0f] overflow-hidden">
                    {/* HEADER DU MODULE */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <Image className="size-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-white">Création de Flyer</h2>
                          <p className="text-[10px] text-muted-foreground">Générez des flyers professionnels</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20">
                          <Zap className="size-3 mr-1" />
                          IA Power
                        </span>
                      </div>
                    </div>

                    {/* CORPS DU MODULE */}
                    <div className="p-5">
                      {/* ZONE DE PRÉVISUALISATION */}
                      <div className="relative rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/5 p-6 mb-5">
                        <div className="aspect-video rounded-lg bg-[#1a1a1f] flex items-center justify-center mb-4">
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

                      {/* FEATURES LIST */}
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
                      <Button className="w-full h-11 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold cursor-pointer shadow-lg shadow-purple-500/25 text-sm">
                        <Wand2 className="mr-2 size-4" />
                        Créer mon flyer
                      </Button>

                      {/* BADGE GRATUITÉ */}
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
        </main>
      </div>
    </div>
  )
}

function Tag({ icon: Icon, label }: { icon: React.ElementType, label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium text-muted-foreground bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-default">
      <Icon className="size-3" />
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
    <div className="rounded-xl bg-[#1a1a1f] border border-white/5 p-3 hover:border-white/10 transition-colors">
      <div className={cn(
        "size-8 rounded-lg mb-2 flex items-center justify-center bg-gradient-to-br",
        gradient
      )}>
        <Icon className="size-4 text-white" />
      </div>
      <p className="text-xs font-bold text-white">{title}</p>
      <p className="text-[10px] text-muted-foreground">{desc}</p>
    </div>
  )
}
