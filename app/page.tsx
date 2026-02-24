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
  const [platform, setPlatform] = useState("whatsapp")
  const [focus, setFocus] = useState("stock")
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
      <div className="flex h-dvh items-center justify-center bg-background text-foreground">
        Chargement du cerveau Omnishop...
      </div>
    )
  }

  return (
    <>
      {/* LA MODAL D'ONBOARDING (Ultra compacte, sans SVG) */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[400px] rounded-lg border border-border bg-card p-5 shadow-2xl">
            <h2 className="mb-1 text-lg font-bold text-card-foreground">Bienvenue {userName} !</h2>
            <p className="mb-5 text-xs text-muted-foreground">
              Configure ton espace Omnishop.
            </p>

            <form onSubmit={handleCompleteOnboarding} className="space-y-5">
              
              {/* SECTION CANAL */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Canal principal</label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'whatsapp', name: 'WhatsApp', color: 'bg-[#25D366]' },
                    { id: 'snapchat', name: 'Snapchat', color: 'bg-[#FFFC00]' },
                    { id: 'instagram', name: 'Instagram', color: 'bg-[#E1306C]' },
                    { id: 'tiktok', name: 'TikTok', color: 'bg-black dark:bg-white' },
                    { id: 'autre', name: 'Autre', color: 'bg-gray-500' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlatform(p.id)}
                      className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition-colors ${
                        platform === p.id 
                          ? 'border-primary bg-primary/10 font-bold text-primary ring-1 ring-primary ring-offset-0' 
                          : 'border-border bg-background text-foreground hover:bg-muted'
                      }`}
                    >
                      {/* Pastille de couleur au lieu des SVG */}
                      <span className={`block h-2.5 w-2.5 rounded-full ${p.color} ${p.id === 'snapchat' ? 'border border-black/20' : ''}`} />
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION BESOIN */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Besoin prioritaire</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'stock', name: 'Stocks', desc: 'Gérer quantités' },
                    { id: 'clients', name: 'Clients', desc: 'Fiches CRM' },
                    { id: 'colis', name: 'Colis', desc: 'Suivi trackings' },
                    { id: 'tout', name: 'Complet 🚀', desc: 'Tout-en-un' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFocus(f.id)}
                      className={`flex flex-col items-start rounded-md border px-3 py-2 text-left transition-colors ${
                        focus === f.id 
                          ? 'border-primary bg-primary/10 ring-1 ring-primary ring-offset-0' 
                          : 'border-border bg-background hover:bg-muted'
                      }`}
                    >
                      <span className={`text-xs font-bold ${focus === f.id ? 'text-primary' : 'text-foreground'}`}>
                        {f.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground leading-tight">{f.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* BOUTON DE VALIDATION */}
              <button
                type="submit"
                disabled={savingOnboarding}
                className="mt-4 w-full rounded-md bg-primary py-2.5 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {savingOnboarding ? 'Configuration...' : 'Démarrer'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LE DASHBOARD CLASSIQUE */}
      <div className={`flex h-dvh overflow-hidden bg-background transition-all duration-300 ${showOnboarding ? 'blur-sm pointer-events-none opacity-50' : ''}`}>
        <div className="hidden w-[260px] shrink-0 lg:block">
          <SidebarNav />
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar userName={userName} />

          <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-6">
            <div className="mx-auto max-w-6xl">
              <StatsCards />

              <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
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