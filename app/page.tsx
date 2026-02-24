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
      <div className="flex h-dvh items-center justify-center bg-background text-foreground text-xl font-bold">
        Chargement...
      </div>
    )
  }

  const isFormComplete = platform !== "" && focus !== ""

  return (
    <>
      {/* MODAL ONBOARDING (Inchangée) */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-8 shadow-2xl">
            <h2 className="mb-2 text-2xl font-bold text-card-foreground">Bienvenue {userName} !</h2>
            <form onSubmit={handleCompleteOnboarding} className="space-y-8">
               {/* ... (Reste de ton formulaire) ... */}
               <button type="submit" disabled={!isFormComplete || savingOnboarding} className="w-full bg-primary p-3 rounded-lg font-bold">Démarrer</button>
            </form>
          </div>
        </div>
      )}

      {/* DASHBOARD AVEC ALIGNEMENT PARFAIT */}
      <div 
        style={{ zoom: "1.25" }} 
        className={`flex h-screen w-screen overflow-hidden bg-background transition-all duration-300 ${showOnboarding ? 'blur-sm pointer-events-none opacity-50' : ''}`}
      >
        {/* Sidebar : pb-6 pour s'aligner sur le padding du contenu */}
        <aside className="hidden w-[260px] shrink-0 lg:block h-full">
          <SidebarNav />
        </aside>

        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar userName={userName} />

          {/* On utilise flex-col et h-full pour que RecentOrders s'étire jusqu'au bas du padding */}
          <main className="flex-1 overflow-hidden px-4 pb-6 pt-6 lg:px-6">
            <div className="mx-auto max-w-6xl h-full flex flex-col gap-6">
              <div className="shrink-0">
                <StatsCards />
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-5 flex-1 min-h-0 items-stretch pb-1">
                <div className="xl:col-span-3 flex flex-col h-full overflow-hidden">
                  <RecentOrders />
                </div>
                <div className="xl:col-span-2 flex flex-col h-full overflow-hidden">
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