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
      data: { onboarding_completed: true, sales_platform: platform, main_focus: focus }
    })
    setShowOnboarding(false)
    setSavingOnboarding(false)
  }

  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground text-2xl font-bold">
        Chargement...
      </div>
    )
  }

  const isFormComplete = platform !== "" && focus !== ""

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-background">
      
      {showOnboarding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-10 shadow-2xl">
            <h2 className="mb-2 text-3xl font-bold">Bienvenue {userName} !</h2>
            <p className="mb-8 text-base text-muted-foreground font-medium">Configure ton espace Omnishop en quelques clics.</p>
            <form onSubmit={handleCompleteOnboarding} className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Canal principal</label>
                <div className="flex flex-wrap gap-3">
                  {['whatsapp', 'snapchat', 'instagram', 'tiktok', 'telegram', 'autre'].map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPlatform(id)}
                      className={`flex items-center gap-2.5 rounded-lg border-2 px-4 py-2 text-sm transition-all ${platform === id ? 'border-primary bg-primary/10 font-bold text-primary' : 'border-border bg-background'}`}
                    >
                      <span className={`h-3 w-3 rounded-full ${id === 'whatsapp' ? 'bg-[#25D366]' : id === 'snapchat' ? 'bg-[#FFFC00]' : 'bg-primary'}`} />
                      {id.charAt(0).toUpperCase() + id.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Besoin prioritaire</label>
                <div className="grid grid-cols-2 gap-4">
                  {[{ id: 'stock', name: 'Stocks', desc: 'Gérer les quantités' }, { id: 'clients', name: 'Clients', desc: 'CRM & Relances' }, { id: 'colis', name: 'Colis', desc: 'Suivi trackings' }, { id: 'tout', name: 'Complet 🚀', desc: 'Tout-en-un' }].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFocus(f.id)}
                      className={`flex flex-col items-start rounded-lg border-2 p-4 text-left transition-all ${focus === f.id ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}
                    >
                      <span className="text-base font-bold">{f.name}</span>
                      <span className="text-xs text-muted-foreground">{f.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                disabled={savingOnboarding || !isFormComplete}
                className={`mt-4 flex h-12 w-full items-center justify-center rounded-lg text-base font-bold transition-all ${isFormComplete ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'}`}
              >
                Démarrer mon espace
              </button>
            </form>
          </div>
        </div>
      )}

      <div className={`flex flex-1 overflow-hidden transition-all duration-500 ${showOnboarding ? 'blur-xl opacity-30' : ''}`}>
        <aside className="hidden w-[280px] shrink-0 lg:flex flex-col border-r border-border/50 bg-card overflow-hidden">
          <SidebarNav />
        </aside>

        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar userName={userName} />
          <main className="flex-1 p-6 overflow-hidden flex flex-col gap-6" style={{ zoom: "1.1" }}>
            <div className="shrink-0"><StatsCards /></div>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-5 flex-1 min-h-0">
              <div className="xl:col-span-3 bg-card rounded-xl border border-border/50 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto"><RecentOrders /></div>
              </div>
              <div className="xl:col-span-2 bg-card rounded-xl border border-border/50 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto"><InventoryOverview /></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}