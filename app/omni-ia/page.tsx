"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { TopBar } from "@/components/dashboard/top-bar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalyseModule } from "@/components/omni-ia/analyse-module"
import { MarketingModule } from "@/components/omni-ia/marketing-module"
import { RelationClientModule } from "@/components/omni-ia/relation-client-module"
import { PredictionModule } from "@/components/omni-ia/prediction-module"
import {
  BarChart3,
  Target,
  Users,
  Zap,
  Sparkles,
} from "lucide-react"

export default function OmniIAPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [activeTab, setActiveTab] = useState("analyse")

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

  const modules = [
    {
      id: "analyse",
      label: "Analyse",
      title: "Analyse",
      description: "Analysez vos ventes, stocks et performances",
      icon: BarChart3,
    },
    {
      id: "marketing",
      label: "Marketing",
      title: "Marketing",
      description: "Générez du contenu et campagnes automatiques",
      icon: Target,
    },
    {
      id: "relation",
      label: "Relation Client",
      title: "Relation Client",
      description: "Automatisez vos communications clients",
      icon: Users,
    },
    {
      id: "prediction",
      label: "Prédictions",
      title: "Prédictions",
      description: "Prédictions IA sur vos tendances business",
      icon: Zap,
    },
  ]

  return (
    <div style={{ zoom: "1.25" }} className="fixed inset-0 flex overflow-hidden bg-background">
      <div className="hidden w-[260px] shrink-0 lg:block h-full">
        <SidebarNav />
      </div>

      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <TopBar userName={userName} />

        <main className="h-full overflow-hidden px-6 py-6">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="mb-6 shrink-0">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="size-8 text-purple-500" />
                <h1 className="text-3xl font-bold text-foreground">Omni IA</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Votre assistant intelligent pour booster votre business
              </p>
            </div>

            {/* Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="grid w-full max-w-xl grid-cols-4 mb-6">
                {modules.map((module) => (
                  <TabsTrigger key={module.id} value={module.id} className="flex items-center gap-2">
                    <module.icon className="size-4" />
                    <span className="hidden sm:inline">{module.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Tab Content */}
              <div className="flex-1 overflow-hidden">
                <TabsContent value="analyse" className="h-full overflow-auto">
                  <AnalyseModule userName={userName} />
                </TabsContent>

                <TabsContent value="marketing" className="h-full overflow-auto">
                  <MarketingModule userName={userName} />
                </TabsContent>

                <TabsContent value="relation" className="h-full overflow-auto">
                  <RelationClientModule userName={userName} />
                </TabsContent>

                <TabsContent value="prediction" className="h-full overflow-auto">
                  <PredictionModule userName={userName} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
