"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { TopBar } from "@/components/dashboard/top-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

export default function AnalyticsPage() {
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

  // Données factices pour la démo
  const revenueData = [
    { month: "Jan", value: 4200 },
    { month: "Fév", value: 5800 },
    { month: "Mar", value: 4900 },
    { month: "Avr", value: 7200 },
    { month: "Mai", value: 6100 },
    { month: "Juin", value: 8400 },
    { month: "Juil", value: 9200 },
  ]

  const ordersData = [
    { day: "Lun", count: 12 },
    { day: "Mar", count: 18 },
    { day: "Mer", count: 15 },
    { day: "Jeu", count: 24 },
    { day: "Ven", count: 21 },
    { day: "Sam", count: 9 },
    { day: "Dim", count: 6 },
  ]

  const topProducts = [
    { name: "Wireless Headphones Pro", sales: 156, revenue: 15600, growth: 12.5 },
    { name: "Ergonomic Keyboard MX", sales: 89, revenue: 8900, growth: 8.2 },
    { name: "Smart Desk Lamp", sales: 134, revenue: 6700, growth: -3.1 },
    { name: "USB-C Hub Adapter", sales: 201, revenue: 5025, growth: 24.8 },
  ]

  const stats = [
    { title: "Revenu total", value: "47,820€", change: "+12.5%", trend: "up", icon: DollarSign, color: "text-green-500" },
    { title: "Commandes", value: "1,284", change: "+8.2%", trend: "up", icon: ShoppingCart, color: "text-blue-500" },
    { title: "Clients actifs", value: "428", change: "+15.3%", trend: "up", icon: Users, color: "text-purple-500" },
    { title: "Produits vendus", value: "2,847", change: "-2.4%", trend: "down", icon: Package, color: "text-orange-500" },
  ]

  const maxRevenue = Math.max(...revenueData.map(d => d.value))
  const maxOrders = Math.max(...ordersData.map(d => d.count))

  return (
    <div style={{ zoom: "1.15" }} className="fixed inset-0 flex overflow-hidden bg-background">
      <div className="hidden w-[260px] shrink-0 lg:block h-full">
        <SidebarNav />
      </div>

      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <TopBar userName={userName} />

        <main className="h-full overflow-hidden px-6 py-6">
          <div className="h-full overflow-auto">
            {/* EN-TÊTE */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Suivez vos performances et prenez de meilleures décisions
              </p>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat) => {
                const Icon = stat.icon
                const isUp = stat.trend === "up"
                return (
                  <Card key={stat.title} className="border-border/50 bg-card/60 backdrop-blur-sm">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                          <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                          <div className={cn(
                            "flex items-center gap-1 mt-2 text-xs font-medium",
                            isUp ? "text-green-500" : "text-red-500"
                          )}>
                            {isUp ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                            {stat.change}
                          </div>
                        </div>
                        <div className={cn("size-10 rounded-lg bg-muted flex items-center justify-center", stat.color)}>
                          <Icon className={cn("size-5", stat.color)} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* GRAPHIQUES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* REVENUE MENSUEL */}
              <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Revenu mensuel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end gap-3">
                    {revenueData.map((item) => (
                      <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full bg-gradient-to-t from-primary/80 to-primary rounded-t-md transition-all hover:from-primary hover:to-primary/90"
                          style={{ height: `${(item.value / maxRevenue) * 100}%` }}
                        />
                        <span className="text-xs text-muted-foreground">{item.month}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* COMMANDES PAR JOUR */}
              <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Commandes par jour</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end gap-3">
                    {ordersData.map((item) => (
                      <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full bg-gradient-to-t from-blue-500/80 to-blue-500 rounded-t-md transition-all hover:from-blue-500 hover:to-blue-400"
                          style={{ height: `${(item.count / maxOrders) * 100}%` }}
                        />
                        <span className="text-xs text-muted-foreground">{item.day}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* TOP PRODUITS */}
            <Card className="border-border/50 bg-card/60 backdrop-blur-sm mb-8">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Top produits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, i) => (
                    <div key={product.name} className="flex items-center gap-4">
                      <div className="size-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sales} ventes</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">{product.revenue.toLocaleString()}€</p>
                        <p className={cn(
                          "text-xs font-medium",
                          product.growth >= 0 ? "text-green-500" : "text-red-500"
                        )}>
                          {product.growth >= 0 ? "+" : ""}{product.growth}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AUTRES MÉTRIQUES */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* TAUX DE CONVERSION */}
              <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Taux de conversion</p>
                    <p className="text-4xl font-black text-foreground mt-2">3.2%</p>
                    <p className="text-xs text-green-500 mt-2 flex items-center justify-center gap-1">
                      <TrendingUp className="size-3.5" /> +0.4% ce mois
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* VALEUR MOYENNE PANIER */}
              <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Panier moyen</p>
                    <p className="text-4xl font-black text-foreground mt-2">37.2€</p>
                    <p className="text-xs text-green-500 mt-2 flex items-center justify-center gap-1">
                      <TrendingUp className="size-3.5" /> +2.1% ce mois
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* CLIENTS RÉCURRENTS */}
              <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Clients récurrents</p>
                    <p className="text-4xl font-black text-foreground mt-2">28%</p>
                    <p className="text-xs text-red-500 mt-2 flex items-center justify-center gap-1">
                      <TrendingDown className="size-3.5" /> -1.2% ce mois
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
