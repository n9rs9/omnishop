"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, TrendingUp, AlertTriangle, Target, Lightbulb } from "lucide-react"

export function PredictionModule({ userName }: { userName: string }) {
  const predictions = [
    {
      category: "Ventes",
      prediction: "Hausse de 28%",
      timeframe: "30 prochains jours",
      confidence: "92%",
      icon: TrendingUp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      category: "Produits",
      prediction: "Électronique → Top vendeur",
      timeframe: "Cette semaine",
      confidence: "87%",
      icon: Target,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      category: "Clients",
      prediction: "5 risquent de partir",
      timeframe: "Dans 7 jours",
      confidence: "84%",
      icon: AlertTriangle,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      category: "Opportunité",
      prediction: "Créer bundle Électronique",
      timeframe: "Gain: +€850/mois",
      confidence: "79%",
      icon: Lightbulb,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Predictions Overview */}
      <Card className="border-2 bg-gradient-to-br from-purple-500/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="size-5 text-purple-500" />
            Prédictions Intelligentes
          </CardTitle>
          <CardDescription>Basées sur l'analyse de vos données historiques</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Nos modèles IA analysent vos données en temps réel pour vous offrir des insights prédictifs et des opportunités d'optimisation.
          </div>
        </CardContent>
      </Card>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {predictions.map((pred, idx) => (
          <Card key={idx} className={`border-2 ${pred.bgColor}`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${pred.bgColor} ${pred.color}`}>
                  <pred.icon className="size-6" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">{pred.category}</div>
                  <div className="text-xl font-bold mt-1">{pred.prediction}</div>
                  <div className="text-xs text-muted-foreground mt-2">{pred.timeframe}</div>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs font-medium text-muted-foreground">Confiance:</span>
                    <span className={`text-xs font-bold ${pred.color}`}>{pred.confidence}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Insights */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Analyse Détaillée</CardTitle>
          <CardDescription>Tendances et recommandations approfondies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              title: "📈 Tendance Générale",
              description: "Votre business est en croissance régulière. Les 3 derniers mois montrent une stabilité financière excellente.",
              action: "Voir graphiques",
            },
            {
              title: "🎯 Opportunités à Saisir",
              description: "Vos clients achètent principalement le vendredi. Programmez vos promotions pour maximiser les ventes.",
              action: "Planifier promo",
            },
            {
              title: "⚠️ Points d'Alerte",
              description: "Vous avez 5 clients inactifs depuis plus de 60 jours. Le taux de rétention peut s'améliorer de 15%.",
              action: "Lancer campagne",
            },
            {
              title: "🚀 Recommandations IA",
              description: "Augmentez votre inventaire d'Électronique et diversifiez les Accessoires. ROI prédit: +22%.",
              action: "Voir détails",
            },
          ].map((insight, idx) => (
            <div key={idx} className="p-4 border border-border rounded-lg space-y-2">
              <div className="font-medium text-sm">{insight.title}</div>
              <div className="text-sm text-muted-foreground">{insight.description}</div>
              <Button variant="ghost" size="sm" className="text-purple-500 p-0 h-auto">
                {insight.action} →
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Forecast */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Prévisions Mensuelles</CardTitle>
          <CardDescription>Prédictions pour les 3 prochains mois</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { month: "Mars 2024", revenue: "€14,200", growth: "+14%", status: "✅" },
              { month: "Avril 2024", revenue: "€15,800", growth: "+11%", status: "✅" },
              { month: "Mai 2024", revenue: "€17,450", growth: "+10%", status: "⏳" },
            ].map((forecast, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{forecast.month}</div>
                  <div className="text-xs text-muted-foreground">{forecast.revenue}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-600">{forecast.growth}</div>
                  <div className="text-xs">{forecast.status}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
