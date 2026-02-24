"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase" // Ton bon chemin !

import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { TopBar } from "@/components/dashboard/top-bar"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { InventoryOverview } from "@/components/dashboard/inventory-overview"

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      // On vérifie s'il y a une session active
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        // Pas de session ? Dehors !
        router.push("/login")
      } else {
        // Connecté ? On affiche le dashboard
        setIsAuthorized(true)
      }
    }

    checkAuth()
  }, [router])

  // On affiche un petit message pendant la vérification pour éviter un flash du dashboard
  if (!isAuthorized) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background text-foreground">
        Chargement du cerveau Omnishop...
      </div>
    )
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden w-[260px] shrink-0 lg:block">
        <SidebarNav />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />

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
  )
}