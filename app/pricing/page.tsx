"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { TopBar } from "@/components/dashboard/top-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Sparkles, Zap, Crown } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    id: "free",
    name: "Free",
    price: "0€",
    period: "/mois",
    description: "Parfait pour commencer",
    icon: Zap,
    gradient: "from-gray-400 to-gray-600",
    features: [
      "1 boutique",
      "Produits illimités",
      "100 commandes/mois",
      "Calendrier RDV",
      "Omni IA (limité)",
      "Support email",
    ],
    cta: "Plan actuel",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "29€",
    period: "/mois",
    description: "Pour les vendeurs sérieux",
    icon: Sparkles,
    gradient: "from-purple-500 to-pink-500",
    features: [
      "3 boutiques",
      "Tout du Free +",
      "Commandes illimitées",
      "Analytics avancés",
      "Omni IA illimité",
      "Automatisations n8n",
      "Support prioritaire",
      "Export données",
    ],
    cta: "Passer en Pro",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "99€",
    period: "/mois",
    description: "Pour les gros volumes",
    icon: Crown,
    gradient: "from-yellow-400 to-orange-500",
    features: [
      "Boutiques illimitées",
      "Tout du Pro +",
      "API dédiée",
      "Webhooks personnalisés",
      "Formation équipe",
      "Account manager",
      "SLA garanti",
      "Intégration sur-mesure",
    ],
    cta: "Contacter l'équipe",
    popular: false,
  },
]

export default function PricingPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [currentPlan, setCurrentPlan] = useState("free")

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/login")
        return
      }
      const metadata = session.user.user_metadata
      setUserName(metadata?.full_name || "Vendeur")
      setCurrentPlan(metadata?.plan || "free")
    }
    checkAuth()
  }, [router])

  const handleUpgrade = (planId: string) => {
    alert(`Upgrade vers ${planId} - À implémenter avec Stripe`)
  }

  return (
    <div style={{ zoom: "1.25" }} className="fixed inset-0 flex overflow-hidden bg-background">
      <div className="hidden w-[260px] shrink-0 lg:block h-full">
        <SidebarNav />
      </div>

      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <TopBar userName={userName} />

        <main className="h-full overflow-hidden px-6 py-6">
          <div className="h-full flex flex-col">
            {/* EN-TÊTE */}
            <div className="text-center mb-8 shrink-0">
              <h1 className="text-3xl font-bold text-foreground">Choisissez votre plan</h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl mx-auto">
                Des tarifs simples et transparents. Commencez gratuitement, upgradez quand vous êtes prêt.
              </p>
            </div>

            {/* CARTES DE PRIX - Centré et sans scroll */}
            <div className="flex-1 flex items-center justify-center pb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full px-4">
                {plans.map((plan) => {
                  const isCurrentPlan = currentPlan === plan.id
                  const Icon = plan.icon

                  return (
                    <Card
                      key={plan.id}
                      className={cn(
                        "relative flex flex-col transition-all duration-300 overflow-hidden",
                        plan.popular
                          ? "border-2 scale-105 shadow-2xl"
                          : "border hover:shadow-lg",
                        plan.popular && "border-purple-500"
                      )}
                    >
                      {plan.popular && (
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                      )}

                      <CardHeader className="text-center pb-4">
                        <div className={cn(
                          "size-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br shadow-lg",
                          plan.gradient
                        )}>
                          <Icon className="size-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                        <CardDescription className="mt-1">{plan.description}</CardDescription>
                      </CardHeader>

                      <CardContent className="flex-1">
                        <div className="text-center mb-6">
                          <span className="text-5xl font-black text-foreground">{plan.price}</span>
                          <span className="text-muted-foreground">{plan.period}</span>
                        </div>

                        <ul className="space-y-3">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <Check className={cn(
                                "size-4 shrink-0 mt-0.5",
                                plan.popular ? "text-purple-500" : "text-green-500"
                              )} />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>

                      <CardFooter>
                        <Button
                          onClick={() => handleUpgrade(plan.id)}
                          disabled={isCurrentPlan}
                          className={cn(
                            "w-full cursor-pointer font-semibold",
                            plan.popular
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
                              : "bg-primary hover:bg-primary/90"
                          )}
                        >
                          {isCurrentPlan ? "Plan actuel" : plan.cta}
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
