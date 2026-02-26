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

            {/* MODULE CRÉATION FLYER - STYLE GUMLOOP */}
            <div className="flex items-start justify-center pt-2">
              <div className="w-full max-w-[700px]">
                {/* CONTAINER PRINCIPAL AVEC BORDURE DÉGRADÉE */}
                <div className="relative rounded-2xl p-[2px] shadow-lg" style={{ background: 'linear-gradient(90deg, #f5e3d0 0%, #f7c9c7 25%, #f6d9ea 50%, #d8d9ee 75%, #d6eff7 100%)' }}>
                  
                  {/* CONTENU INTÉRIEUR */}
                  <div className="relative rounded-[14px] bg-white overflow-hidden">
                    
                    {/* ZONE DE TEXTE */}
                    <div className="p-5">
                      <textarea
                        placeholder="Décris ton flyer..."
                        className="w-full h-24 resize-none bg-transparent text-base text-gray-800 placeholder:text-gray-400 focus:outline-none"
                      />
                      
                      {/* TAG */}
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 mt-2">
                        Tab
                      </span>
                    </div>

                    {/* BARRE D'OUTILS INFÉRIEURE */}
                    <div className="flex items-center justify-between px-4 pb-4">
                      {/* ICÔNES GAUCHE */}
                      <div className="flex items-center gap-1.5">
                        <button className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                          <svg className="size-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                          <svg className="size-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                          <svg className="size-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                          <svg className="size-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </button>
                      </div>

                      {/* BOUTONS DROITE */}
                      <div className="flex items-center gap-2">
                        <button className="px-4 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 cursor-pointer transition-colors">
                          Build
                        </button>
                        <button className="px-4 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 cursor-pointer transition-colors">
                          Ask
                        </button>
                        <button className="p-2 rounded-full bg-gradient-to-br from-blue-400 to-pink-400 cursor-pointer transition-opacity hover:opacity-90">
                          <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                        </button>
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
