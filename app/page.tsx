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
  
  // États pour l'onboarding
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
        // On récupère les métadonnées de l'utilisateur
        const metadata = session.user.user_metadata
        setUserName(metadata?.full_name || "Vendeur")

        // Si l'onboarding n'est pas terminé, on affiche la modal
        if (metadata?.onboarding_completed !== true) {
          setShowOnboarding(true)
        }
        setIsAuthorized(true)
      }
    }

    checkAuth()
  }, [router])

  // Fonction pour valider le questionnaire
  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingOnboarding(true)

    // On met à jour le profil dans Supabase
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
      {/* LA MODAL D'ONBOARDING */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl sm:p-8 text-card-foreground">
            <h2 className="mb-2 text-2xl font-bold">Bienvenue {userName} ! 🎉</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Pour configurer ton cerveau Omnishop, dis-nous en un peu plus sur ta façon de travailler.
            </p>

            <form onSubmit={handleCompleteOnboarding} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">Où vends-tu le plus ?</label>
                <select 
                  value={platform} 
                  onChange={(e) => setPlatform(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="snapchat">Snapchat</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="autre">Autre / Physique</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Quel est ton besoin principal aujourd'hui ?</label>
                <select 
                  value={focus} 
                  onChange={(e) => setFocus(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="stock">Gérer mes stocks et éviter les ruptures</option>
                  <option value="clients">Gérer mes clients (CRM, relances)</option>
                  <option value="colis">Centraliser le suivi de mes colis</option>
                  <option value="tout">Un peu de tout, je veux tout casser 🚀</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={savingOnboarding}
                className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {savingOnboarding ? 'Configuration en cours...' : 'Accéder à mon Dashboard'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LE DASHBOARD CLASSIQUE */}
      <div className={`flex h-dvh overflow-hidden bg-background ${showOnboarding ? 'blur-sm pointer-events-none' : ''}`}>
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