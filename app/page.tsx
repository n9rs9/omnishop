"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { TopBar } from "@/components/dashboard/top-bar"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { InventoryOverview } from "@/components/dashboard/inventory-overview"

export default function DashboardPage() {
  
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [userName, setUserName] = useState("")
  
  const [platform, setPlatform] = useState("")
  const [focus, setFocus] = useState("")
  const [savingOnboarding, setSavingOnboarding] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login")
      } else {
        const metadata = session.user.user_metadata
        setUserName(metadata?.full_name || "Vendeur")

        if (metadata?.onboarding_completed !== true) {
          setShowOnboarding(true)
        }
        setIsAuthorized(true)
      }
    }

    checkAuth()
  }, [router])

  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingOnboarding(true)

    await supabase.auth.updateUser({
      data: {
        onboarding_completed: true,
        sales_platform: platform,
        main_focus: focus
      }
    })

    setShowOnboarding(false)
    setSavingOnboarding(false)
  }

  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        Chargement du cerveau Omnishop...
      </div>
    )
  }

  const isFormComplete = platform !== "" && focus !== ""

  return (
    <>
      {/* LA MODAL D'ONBOARDING */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-8 shadow-2xl">
            {/* EN-TÊTE ALIGNÉ AU CENTRE */}
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-card-foreground">Bienvenue {userName} !</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Configure ton espace Omnishop en quelques clics.
              </p>
            </div>

            <form onSubmit={handleCompleteOnboarding} className="space-y-12">
              {/* SECTION CANAL - Titre gris, italique et espacé */}
              <div className="space-y-8">
                <label className="block text-sm italic text-muted-foreground">
                  Sur quel canal vendez-vous principalement ?
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: 'whatsapp', name: 'WhatsApp', color: 'bg-[#25D366]' },
                    { id: 'instagram', name: 'Instagram', color: 'bg-[#8E27F5]' },
                    { id: 'snapchat', name: 'Snapchat', color: 'bg-[#FFFC00]' },
                    { id: 'tiktok', name: 'TikTok', color: 'bg-[#E1306C]' },
                    { id: 'telegram', name: 'Telegram', color: 'bg-[#27B7F5]' },
                    { id: 'signal', name: 'Signal', color: 'bg-[#0020CF]' },
                    { id: 'autre', name: 'Autre', color: 'bg-gray-500' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlatform(p.id)}
                      className={`flex items-center gap-2.5 rounded-lg border px-4 py-2.5 text-sm transition-all duration-200 cursor-pointer ${
                        platform === p.id 
                          ? 'border-primary bg-primary font-bold text-primary-foreground shadow-lg' 
                          : 'border-border bg-background text-foreground hover:bg-muted'
                      }`}
                    >
                      <span className={`block h-3 w-3 rounded-full ${p.color} ${p.id === 'snapchat' ? 'border border-black/20' : ''} ${platform === p.id ? 'ring-2 ring-white/50' : ''}`} />
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION BUT - Titre gris, italique et espacé */}
              <div className="space-y-8">
                <label className="block text-sm italic text-muted-foreground">
                  Dans quel but allez-vous utiliser Omnishop ?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'stock', name: 'Gestion des Stocks', desc: 'Suivre les quantités et éviter les ruptures' },
                    { id: 'clients', name: 'Fiches Clients', desc: 'Base de données CRM et relances' },
                    { id: 'colis', name: 'Suivi de Colis', desc: 'Gestion centralisée des trackings' },
                    { id: 'tout', name: 'Complet 🚀', desc: 'L\'outil tout-en-un pour un oeil sur tout' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFocus(f.id)}
                      className={`flex flex-col items-start rounded-lg border p-5 text-left transition-all duration-200 cursor-pointer ${
                        focus === f.id 
                          ? 'border-primary bg-primary text-primary-foreground shadow-lg' 
                          : 'border-border bg-background hover:bg-muted'
                      }`}
                    >
                      <span className={`text-base font-bold ${focus === f.id ? 'text-primary-foreground' : 'text-foreground'}`}>
                        {f.name}
                      </span>
                      <span className={`mt-1.5 text-sm leading-snug ${focus === f.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {f.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={savingOnboarding || !isFormComplete}
                className={`mt-10 flex h-14 w-full items-center justify-center rounded-lg text-base font-bold shadow-md transition-all duration-200 cursor-pointer ${
                  isFormComplete 
                    ? 'bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]' 
                    : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                }`}
              >
                {savingOnboarding ? 'Configuration en cours...' : 'Démarrer mon espace Omnishop'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DASHBOARD SANS SCROLL - ÉCARTS ÉGALISÉS */}
      <div 
        style={{ zoom: "1.25" }} 
        className={`fixed inset-0 flex overflow-hidden bg-background transition-all duration-300 ${showOnboarding ? 'blur-sm pointer-events-none opacity-50' : ''}`}
      >
        <div className="hidden w-[260px] shrink-0 lg:block h-full">
          <SidebarNav />
        </div>

        <div className="flex flex-1 flex-col h-full overflow-hidden">
          <TopBar userName={userName} />

          <main className="h-full overflow-hidden px-6 py-6">
            <div className="h-full flex flex-col">
              <StatsCards />

              <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5 items-start">
                <div className="xl:col-span-3">
                  <RecentOrders />
                </div>
                <div className="xl:col-span-2">
                  <InventoryOverview />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}