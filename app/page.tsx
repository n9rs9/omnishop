"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Package, Users, Truck, Rocket, Store } from "lucide-react" // On ajoute les icônes Lucide

import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { TopBar } from "@/components/dashboard/top-bar"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { InventoryOverview } from "@/components/dashboard/inventory-overview"

// --- LES LOGOS DES RÉSEAUX (SVG Purs pour une qualité parfaite) ---
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-[#25D366]">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
)

const SnapchatIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-[#FFFC00] stroke-black stroke-[0.5]">
    <path d="M12.083 0c-1.503.011-2.922.384-3.868 1.139-.817.65-1.127 1.488-1.22 2.225-.094.755.073 1.547.288 2.146.195.541.444 1.01.528 1.171.05.097.025.13-.053.111-.334-.085-.898-.184-1.549-.228-1.071-.073-2.222.062-2.99.791-.564.536-.708 1.258-.616 1.83.085.52.336.981.656 1.354.381.443.856.762 1.107.915.068.041.066.079.02.162-.257.464-.614 1.157-1.108 1.764-.32.392-.68.745-1.096 1.04-.374.266-.827.502-1.325.684-.469.171-.853.48-1.018.914-.158.415-.121.879.083 1.267.337.643 1.025 1.026 1.824 1.157 1.042.171 2.302.046 3.682-.361.684-.202 1.341-.453 1.961-.741.059-.028.106-.013.136.039.297.518.784 1.115 1.328 1.62.61.566 1.314 1.042 2.089 1.385.342.152.695.275 1.056.366.194.049.389.085.586.111.413.053.829.029 1.23-.075.367-.095.722-.245 1.056-.44.258-.15.498-.328.718-.529a7.357 7.357 0 0 0 1.353-1.638c.036-.057.086-.07.149-.039.638.307 1.316.574 2.02.784 1.418.423 2.705.556 3.766.376.812-.138 1.511-.53 1.85-1.189.206-.4.244-.875.081-1.301-.17-.442-.562-.756-1.04-.928-.506-.182-.968-.42-1.349-.688-.423-.298-.79-.656-1.115-1.054-.501-.614-.863-1.316-1.123-1.787-.046-.084-.047-.123.023-.165.253-.153.732-.473 1.117-.92.322-.375.575-.84.661-1.365.091-.577-.056-1.305-.626-1.846-.774-.736-1.934-.875-3.013-.797-.655.046-1.222.147-1.558.232-.078.02-.102-.014-.052-.11.084-.162.335-.632.531-1.176.215-.599.403-1.391.31-2.146-.093-.737-.403-1.575-1.22-2.225-.947-.754-2.365-1.127-3.868-1.139Z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-[#E1306C]">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.869a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/>
  </svg>
)

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-foreground">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.96-.5 3.96-1.82 5.36-1.36 1.43-3.4 2.1-5.36 1.83-2.14-.3-3.96-1.88-4.63-3.95-.7-2.16-.14-4.66 1.4-6.32 1.56-1.66 4.02-2.3 6.16-1.72v4.06c-1.12-.25-2.38-.05-3.3.66-.88.68-1.35 1.8-1.23 2.92.12 1.1 1.05 2.05 2.15 2.2 1.17.16 2.4-.3 3.06-1.3.62-.93.84-2.08.84-3.18V.02z"/>
  </svg>
)

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [userName, setUserName] = useState("")
  // Nos états pour l'onboarding
  const [platform, setPlatform] = useState("whatsapp")
  const [focus, setFocus] = useState("stock")
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
      {/* LA NOUVELLE MODAL D'ONBOARDING */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-xl sm:p-8 text-card-foreground my-8">
            <h2 className="mb-2 text-2xl font-bold">Bienvenue {userName} ! 🎉</h2>
            <p className="mb-8 text-sm text-muted-foreground">
              Pour configurer ton cerveau Omnishop, dis-nous en un peu plus sur ta façon de travailler.
            </p>

            <form onSubmit={handleCompleteOnboarding} className="space-y-8">
              
              {/* SECTION 1 : PLATEFORME */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-foreground">Où vends-tu le plus ?</label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { id: 'whatsapp', name: 'WhatsApp', icon: <WhatsAppIcon /> },
                    { id: 'snapchat', name: 'Snapchat', icon: <SnapchatIcon /> },
                    { id: 'instagram', name: 'Instagram', icon: <InstagramIcon /> },
                    { id: 'tiktok', name: 'TikTok', icon: <TikTokIcon /> },
                    { id: 'autre', name: 'Autre / Web', icon: <Store className="h-6 w-6 text-muted-foreground" /> },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlatform(p.id)}
                      className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-4 transition-all duration-200 hover:bg-muted/50 ${
                        platform === p.id 
                          ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary ring-offset-background' 
                          : 'border-border bg-card'
                      }`}
                    >
                      {p.icon}
                      <span className={`text-sm font-medium ${platform === p.id ? 'text-primary' : 'text-foreground'}`}>
                        {p.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 2 : OBJECTIF PRINCIPAL */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-foreground">Quel est ton besoin principal aujourd'hui ?</label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    { id: 'stock', name: 'Gérer mes stocks', desc: 'Fini les ruptures de stock', icon: <Package className="h-5 w-5" /> },
                    { id: 'clients', name: 'Gérer mes clients', desc: 'Fiches clients et relances', icon: <Users className="h-5 w-5" /> },
                    { id: 'colis', name: 'Suivi des colis', desc: 'Centraliser tous les trackings', icon: <Truck className="h-5 w-5" /> },
                    { id: 'tout', name: 'Je veux tout péter 🚀', desc: 'L\'outil tout-en-un', icon: <Rocket className="h-5 w-5" /> },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFocus(f.id)}
                      className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200 hover:bg-muted/50 ${
                        focus === f.id 
                          ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary ring-offset-background' 
                          : 'border-border bg-card'
                      }`}
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${focus === f.id ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {f.icon}
                      </div>
                      <div>
                        <p className={`font-medium ${focus === f.id ? 'text-primary' : 'text-foreground'}`}>{f.name}</p>
                        <p className="text-xs text-muted-foreground">{f.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* BOUTON DE VALIDATION */}
              <button
                type="submit"
                disabled={savingOnboarding}
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {savingOnboarding ? 'Configuration en cours...' : 'Accéder à mon Dashboard'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LE DASHBOARD CLASSIQUE */}
      <div className={`flex h-dvh overflow-hidden bg-background transition-all ${showOnboarding ? 'blur-md pointer-events-none opacity-50' : ''}`}>
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