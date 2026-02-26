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
  Wand2,
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
      {/* SIDEBAR - SANS POINTILLÉS */}
      <div className="hidden w-[260px] shrink-0 lg:block h-full">
        <SidebarNav />
      </div>

      {/* ZONE PRINCIPALE - AVEC FOND POINTILLÉ */}
      <div className="flex flex-1 flex-col h-full overflow-hidden relative">
        {/* FOND POINTILLÉ (uniquement sur la zone principale, pas la sidebar) */}
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
            {/* HEADER */}
            <div className="flex items-center gap-3 mb-3 shrink-0">
              <div>
                <h1 className="text-lg font-bold text-foreground">Omni IA</h1>
                <p className="text-[10px] text-muted-foreground">Votre assistant intelligent</p>
              </div>
            </div>

            {/* MODULE CRÉATION FLYER */}
            <div className="flex items-start justify-center pt-2">
              <div className="w-full max-w-[480px]">
                {/*
                  STRUCTURE :
                  1. Contour extérieur épais multi-color (3px)
                  2. Contour intérieur #0a0b0e (8px)
                  3. Couche de fond #0a0b0e
                  4. Gradient overlay blanc→transparent (smooth)
                */}
                
                {/* COUCHE 1 : CONTOUR EXTÉRIEUR ÉPAIS MULTI-COLOR */}
                <div className="relative rounded-2xl p-[3px] shadow-xl" style={{ background: 'linear-gradient(180deg, #f5e3d0 0%, #f7c9c7 25%, #f6d9ea 50%, #d8d9ee 75%, #d6eff7 100%)' }}>
                  
                  {/* COUCHE 2 : CONTOUR INTÉRIEUR #0a0b0e (8px) */}
                  <div className="relative rounded-[17px] p-[8px] bg-[#0a0b0e]">
                    
                    {/* COUCHE 3 : COUCHE DE FOND #0a0b0e */}
                    <div className="relative rounded-[9px] bg-[#0a0b0e] overflow-hidden">
                      
                      {/* COUCHE 4 : GRADIENT OVERLAY (blanc → transparent, smooth) */}
                      <div className="absolute inset-0 pointer-events-none rounded-[9px]" style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 35%, transparent 65%)'
                      }} />
                      
                      {/* CONTENU (au-dessus du gradient) */}
                      <div className="relative z-10">
                        
                        {/* HEADER DU MODULE */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                          <div className="flex items-center gap-2">
                            <div className="size-9 rounded-md bg-[#0a0b0e] flex items-center justify-center">
                              <img src="/iconfile.png" alt="" className="size-5" />
                            </div>
                            <div>
                              <h2 className="text-xs font-bold text-white">Création de Flyer</h2>
                              <p className="text-[9px] text-muted-foreground">Générez des flyers pros</p>
                            </div>
                          </div>
                        </div>

                        {/* CORPS DU MODULE */}
                        <div className="p-4">
                          {/* ZONE DE PRÉVISUALISATION */}
                          <div className="relative rounded-lg bg-[#121216] border border-white/5 p-4 mb-4">
                            <div className="aspect-video rounded-md bg-[#1a1a1f] border border-white/5 flex items-center justify-center mb-3">
                              <div className="text-center">
                                <Image className="size-8 text-muted-foreground/50 mx-auto mb-1" />
                                <p className="text-[10px] text-muted-foreground">Aperçu du flyer</p>
                              </div>
                            </div>

                            {/* CHAMP DE DISCUSSION */}
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Décris ton flyer..."
                                className="flex-1 rounded-lg bg-[#1a1a1f] border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-blue-500/50"
                              />
                              <span className="inline-flex items-center px-2 py-1.5 rounded-lg text-xs font-medium text-[#f6339a] bg-[#f6339a]/20 border border-[#f6339a]/30 whitespace-nowrap">
                                <Image className="size-3.5 mr-1.5" />
                                Image
                              </span>
                            </div>
                          </div>

                          {/* BOUTON D'ACTION */}
                          <Button className="w-full h-10 bg-white hover:bg-gray-100 text-black font-bold cursor-pointer text-sm rounded-lg">
                            <Wand2 className="mr-2 size-4" />
                            Créer mon flyer
                          </Button>
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
