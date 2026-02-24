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
            <h2 className="mb-2 text-2xl font-bold text-card-foreground">Bienvenue {userName} !</h2>
            <p className="mb-8 text-sm text-muted-foreground">
              Configure ton espace Omnishop en quelques clics.
            </p>

            <form onSubmit={handleCompleteOnboarding} className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Canal principal</label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: 'whatsapp', name: 'WhatsApp', color: 'bg-[#25D366]' },
                    { id: 'snapchat', name: 'Snapchat', color: 'bg-[#FFFC00]' },
                    { id: 'instagram', name: 'Instagram', color: 'bg-[#8E27F5]' },
                    { id: 'tiktok', name: 'TikTok', color: 'bg-[#E1306C]' },
                    { id: 'telegram', name: 'Telegram', color: 'bg-[#27B7F5]' },
                    { id: 'autre', name: 'Autre', color: 'bg-gray-500' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlatform(p.id)}
                      className={`flex items-center gap-2.5 rounded-lg border px-4 py-2 text-sm transition-colors ${
                        platform === p.id 
                          ? 'border-primary bg-primary/10 font-bold text-primary ring-2 ring-primary ring-offset-0' 
                          : 'border-border bg-background text-foreground hover:bg-muted'
                      }`}
                    >
                      <span className={`block h-3.5 w-3.5 rounded-full ${p.color} ${p.id === 'snapchat' ? 'border border-black/20' : ''}`} />
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Besoin prioritaire</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'stock', name: 'Stocks', desc: 'Gérer les quantités et éviter les ruptures' },
                    { id: 'clients', name: 'Clients', desc: 'Fiches clients, CRM et relances' },
                    { id: 'colis', name: 'Colis', desc: 'Suivi centralisé des trackings' },
                    { id: 'tout', name: 'Complet 🚀', desc: 'L\'outil tout-en-un pour un oeil sur tout' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFocus(f.id)}
                      className={`flex flex-col items-start rounded-lg border p-4 text-left transition-colors ${
                        focus === f.id 
                          ? 'border-primary bg-primary/10 ring-2 ring-primary ring-offset-0' 
                          : 'border-border bg-background hover:bg-muted'
                      }`}
                    >
                      <span className={`text-base font-bold ${focus === f.id ? 'text-primary' : 'text-foreground'}`}>
                        {f.name}
                      </span>
                      <span className="mt-1 text-sm text-muted-foreground leading-snug">{f.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={savingOnboarding || !isFormComplete}
                className={`mt-6 flex h-12 w-full items-center justify-center rounded-lg text-base font-bold shadow-sm transition-all duration-200 ${
                  isFormComplete 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    : 'bg-muted text-muted-foreground cursor-not-allowed opacity-70'
                }`}
              >
                {savingOnboarding ? 'Configuration en cours...' : 'Démarrer mon espace Omnishop'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DASHBOARD BLOQUÉ SANS SCROLL - ZOOM APPLIQUÉ SUR LE CONTENEUR FIXE */}
      <div 
        style={{ zoom: "1.25" }} 
        className={`fixed inset-0 flex overflow-hidden bg-background transition-all duration-300 ${showOnboarding ? 'blur-sm pointer-events-none opacity-50' : ''}`}
      >
        <div className="hidden w-[260px] shrink-0 lg:block h-full">
          <SidebarNav />
        </div>

        <div className="flex flex-1 flex-col h-full overflow-hidden">
          <TopBar userName={userName} />

          {/* On remplace flex-1 par une hauteur calculée ou fixe sans overflow-y-auto global */}
          <main className="h-full overflow-hidden px-4 py-6 lg:px-6">
            <div className="mx-auto max-w-6xl h-full flex flex-col">
              <StatsCards />

              {/* Conteneur des grilles avec alignement strict en haut */}
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