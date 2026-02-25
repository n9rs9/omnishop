"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { TopBar } from "@/components/dashboard/top-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Zap, Sparkles, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    id: "free",
    name: "Free",
    price: "0€",
    period: "/mois",
    description: "Pour démarrer",
    icon: Zap,
    color: "text-gray-500",
    bgColor: "bg-gray-500",
    features: [
      "1 boutique",
      "Produits illimités",
      "100 commandes/mois",
      "Calendrier RDV",
      "Omni IA limité",
    ],
    cta: "Plan actuel",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "29€",
    period: "/mois",
    description: "Pour croître",
    icon: Sparkles,
    color: "text-purple-500",
    bgColor: "bg-purple-500",
    features: [
      "3 boutiques",
      "Commandes illimitées",
      "Analytics avancés",
      "Omni IA illimité",
      "Automatisations n8n",
      "Support prioritaire",
    ],
    cta: "Passer en Pro",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Business",
    price: "99€",
    period: "/mois",
    description: "Pour les pros",
    icon: Building2,
    color: "text-blue-500",
    bgColor: "bg-blue-500",
    features: [
      "Boutiques illimitées",
      "Tout du Pro +",
      "API dédiée",
      "Webhooks personnalisés",
      "Account manager",
      "SLA garanti",
    ],
    cta: "Contacter",
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
              <h1 className="text-2xl font-bold text-foreground">Nos offres</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Commencez gratuitement, upgradez quand vous êtes prêt
              </p>
            </div>

            {/* CARTES DE PRIX */}
            <div className="flex-1 flex items-center justify-center pb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl px-4">
                {plans.map((plan) => {
                  const isCurrentPlan = currentPlan === plan.id
                  const Icon = plan.icon

                  return (
                    <Card
                      key={plan.id}
                      className={cn(
                        "relative flex flex-col",
                        plan.popular && "border-purple-500 border-2 shadow-lg"
                      )}
                    >
                      {plan.popular && (
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                          <span className="bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Populaire
                          </span>
                        </div>
                      )}

                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={cn(
                            "size-10 rounded-lg flex items-center justify-center",
                            plan.bgColor
                          )}>
                            <Icon className="size-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                            <CardDescription className="text-xs">{plan.description}</CardDescription>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-3xl font-black text-foreground">{plan.price}</span>
                          <span className="text-muted-foreground text-sm">{plan.period}</span>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1">
                        <ul className="space-y-2">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs">
                              <Check className={cn(
                                "size-3.5 shrink-0 mt-0.5",
                                plan.popular ? "text-purple-500" : "text-green-500"
                              )} />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>

                      <CardFooter className="pt-3">
                        <Button
                          onClick={() => handleUpgrade(plan.id)}
                          disabled={isCurrentPlan}
                          className={cn(
                            "w-full text-sm cursor-pointer",
                            plan.popular
                              ? "bg-purple-500 hover:bg-purple-600 text-white"
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
