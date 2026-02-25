"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BarChart3, TrendingUp, Package, DollarSign, Download } from "lucide-react"

export function AnalyseModule({ userName }: { userName: string }) {
  const [period, setPeriod] = useState("week")

  const stats = [
    { title: "Ventes", value: "€12,450", change: "+12.5%", icon: DollarSign, color: "text-green-500" },
    { title: "Commandes", value: "248", change: "+8.2%", icon: BarChart3, color: "text-blue-500" },
    { title: "Stocks Critiques", value: "5", change: "-3 cette semaine", icon: Package, color: "text-orange-500" },
    { title: "Tendance", value: "Hausse", change: "Excellente semaine", icon: TrendingUp, color: "text-emerald-500" },
  ]

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex gap-2">
          {["day", "week", "month"].map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "outline"}
              onClick={() => setPeriod(p)}
              className="capitalize"
            >
              {p === "day" ? "Aujourd'hui" : p === "week" ? "Cette semaine" : "Ce mois"}
            </Button>
          ))}
        </div>
        <Button variant="outline" className="ml-auto gap-2">
          <Download className="size-4" />
          Exporter
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  <p className="text-xs text-emerald-600 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="size-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights */}
      <Card className="border-2 bg-gradient-to-br from-purple-500/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5 text-purple-500" />
            Insights IA
          </CardTitle>
          <CardDescription>Analyse intelligente de vos données</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">📊 <strong>Votre meilleure catégorie:</strong> Électronique avec 45% des ventes</p>
            <p className="text-muted-foreground">⚠️ <strong>À améliorer:</strong> Les Accessoires ne représentent que 8% des ventes</p>
            <p className="text-muted-foreground">✅ <strong>Tendance positive:</strong> Les ventes du week-end augmentent de 23%</p>
            <p className="text-muted-foreground">🎯 <strong>Recommandation:</strong> Lancez une promo sur les Accessoires pour diversifier vos revenus</p>
          </div>
        </CardContent>
      </Card>

      {/* Performance Chart Placeholder */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Performance Graphique</CardTitle>
          <CardDescription>Évolution de vos ventes sur la période</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/30 rounded-lg border border-border flex items-center justify-center text-muted-foreground">
            📈 Graphique de performance (intégration chart)
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
