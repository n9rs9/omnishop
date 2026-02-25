"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { TopBar } from "@/components/dashboard/top-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import {
  Image,
  Sparkles,
  Wand2,
} from "lucide-react"

export default function OmniIAPage() {
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

  return (
    <div style={{ zoom: "1.25" }} className="fixed inset-0 flex overflow-hidden bg-background">
      <div className="hidden w-[260px] shrink-0 lg:block h-full">
        <SidebarNav />
      </div>

      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <TopBar userName={userName} />

        <main className="h-full overflow-hidden px-6 py-6">
          <div className="h-full flex flex-col">
            {/* HEADER */}
            <div className="flex items-center gap-3 mb-6 shrink-0">
              <div className="size-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Omni IA</h1>
                <p className="text-xs text-muted-foreground">Votre assistant intelligent</p>
              </div>
            </div>

            {/* MODULE CRÉATION FLYER */}
            <div className="flex-1 flex items-center justify-center">
              <Card className="w-full max-w-md border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
                <CardContent className="p-8 text-center">
                  {/* ICÔNE */}
                  <div className="size-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mx-auto mb-6 flex items-center justify-center shadow-xl shadow-purple-500/20">
                    <Image className="size-10 text-white" />
                  </div>

                  {/* TITRE */}
                  <h2 className="text-xl font-black text-foreground mb-2">
                    Création de Flyer
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Générez des flyers professionnels pour vos produits en quelques secondes
                  </p>

                  {/* FEATURES */}
                  <div className="space-y-3 mb-8 text-left">
                    <FeatureItem icon={Wand2} text="Génération automatique par IA" />
                    <FeatureItem icon={Sparkles} text="Modèles professionnels inclus" />
                    <FeatureItem icon={Image} text="Export haute qualité" />
                  </div>

                  {/* BOUTON */}
                  <Button className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold cursor-pointer shadow-lg">
                    <Wand2 className="mr-2 size-5" />
                    Créer un flyer
                  </Button>

                  {/* BADGE */}
                  <div className="mt-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-purple-500 bg-purple-500/10 border border-purple-500/20">
                      <Sparkles className="size-3 mr-1.5" />
                      Gratuit & Illimité
                    </span>
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

function FeatureItem({ icon: Icon, text }: { icon: React.ElementType, text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="size-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
        <Icon className="size-4 text-purple-500" />
      </div>
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  )
}
