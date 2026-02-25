"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { TopBar } from "@/components/dashboard/top-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

import {
  User,
  Mail,
  Bell,
  Palette,
  Shield,
  Trash2,
  Loader2,
  Check,
  Store,
  ChevronRight,
} from "lucide-react"
import { useTheme } from "next-themes"

type SettingsTab = "compte" | "notifications" | "boutique" | "apparence" | "danger"

export default function SettingsPage() {
  const router = useRouter()
  const { setTheme } = useTheme()
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [activeTab, setActiveTab] = useState<SettingsTab>("compte")
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Profile settings
  const [fullName, setFullName] = useState("")
  
  // Notifications
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [orderNotifs, setOrderNotifs] = useState(true)
  const [stockNotifs, setStockNotifs] = useState(true)

  // Store settings
  const [storeName, setStoreName] = useState("")
  const [storeUrl, setStoreUrl] = useState("")

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/login")
        return
      }
      const metadata = session.user.user_metadata
      setUserName(metadata?.full_name || "")
      setEmail(session.user.email || "")
      setFullName(metadata?.full_name || "")
      setStoreName(metadata?.store_name || "Ma Boutique")
      setStoreUrl(metadata?.store_url || "")
    }
    checkAuth()
  }, [router])

  const handleSaveProfile = async () => {
    setIsSaving(true)
    await supabase.auth.updateUser({ data: { full_name: fullName } })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setIsSaving(false)
  }

  const handleSaveStore = async () => {
    setIsSaving(true)
    await supabase.auth.updateUser({ data: { store_name: storeName, store_url: storeUrl } })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setIsSaving(false)
  }

  const handleSaveNotifications = async () => {
    setIsSaving(true)
    // TODO: Sauvegarder les préférences de notification
    await new Promise(resolve => setTimeout(resolve, 500))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setIsSaving(false)
  }

  const sidebarItems = [
    { id: "compte" as SettingsTab, label: "Compte", icon: User },
    { id: "notifications" as SettingsTab, label: "Notifications", icon: Bell },
    { id: "boutique" as SettingsTab, label: "Boutique", icon: Store },
    { id: "apparence" as SettingsTab, label: "Apparence", icon: Palette },
    { id: "danger" as SettingsTab, label: "Zone de danger", icon: Shield },
  ] as const

  return (
    <div style={{ zoom: "1.25" }} className="fixed inset-0 flex overflow-hidden bg-background">
      {/* SIDEBAR PRINCIPALE */}
      <div className="hidden w-[260px] shrink-0 lg:block h-full">
        <SidebarNav />
      </div>

      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <TopBar userName={userName} />

        <main className="h-full overflow-hidden px-6 py-6">
          <div className="h-full flex gap-6">
            {/* SIDEBAR SECONDAIRE - SETTINGS */}
            <div className="w-64 shrink-0">
              <div className="sticky top-0 space-y-1">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">
                  Paramètres
                </h2>
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                      activeTab === item.id
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                    {activeTab === item.id && (
                      <ChevronRight className="size-4 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* CONTENU DES PARAMÈTRES */}
            <div className="flex-1 max-w-2xl">
              {/* COMPTE */}
              {activeTab === "compte" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Compte</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Gérez vos informations personnelles
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nom complet</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-9"
                          placeholder="Votre nom"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          id="email"
                          value={email}
                          disabled
                          className="pl-9 bg-muted/50"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Dernière modification il y a 30 jours
                      </p>
                      <Button onClick={handleSaveProfile} disabled={isSaving} className="cursor-pointer">
                        {isSaving ? <Loader2 className="mr-2 size-4 animate-spin" /> : saved ? <Check className="mr-2 size-4" /> : null}
                        {saved ? "Enregistré" : "Enregistrer"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Gérez vos préférences de notification
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="size-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Notifications par email</p>
                          <p className="text-xs text-muted-foreground">Recevoir des emails pour les événements importants</p>
                        </div>
                      </div>
                      <Switch
                        checked={emailNotifs}
                        onCheckedChange={setEmailNotifs}
                        className="cursor-pointer"
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="size-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Nouvelles commandes</p>
                          <p className="text-xs text-muted-foreground">Être notifié quand une commande est créée</p>
                        </div>
                      </div>
                      <Switch
                        checked={orderNotifs}
                        onCheckedChange={setOrderNotifs}
                        className="cursor-pointer"
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="size-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Alertes de stock</p>
                          <p className="text-xs text-muted-foreground">Être alerté quand un produit est en rupture</p>
                        </div>
                      </div>
                      <Switch
                        checked={stockNotifs}
                        onCheckedChange={setStockNotifs}
                        className="cursor-pointer"
                      />
                    </div>

                    <Separator />

                    <div className="flex justify-end">
                      <Button onClick={handleSaveNotifications} disabled={isSaving} className="cursor-pointer">
                        {isSaving ? <Loader2 className="mr-2 size-4 animate-spin" /> : saved ? <Check className="mr-2 size-4" /> : null}
                        {saved ? "Enregistré" : "Enregistrer"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* BOUTIQUE */}
              {activeTab === "boutique" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Boutique</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Informations de votre boutique
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="storeName">Nom de la boutique</Label>
                      <div className="relative">
                        <Store className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          id="storeName"
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          className="pl-9"
                          placeholder="Ma Boutique"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="storeUrl">URL de la boutique (optionnel)</Label>
                      <div className="relative">
                        <Store className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          id="storeUrl"
                          value={storeUrl}
                          onChange={(e) => setStoreUrl(e.target.value)}
                          className="pl-9"
                          placeholder="maboutique.com"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-end">
                      <Button onClick={handleSaveStore} disabled={isSaving} className="cursor-pointer">
                        {isSaving ? <Loader2 className="mr-2 size-4 animate-spin" /> : saved ? <Check className="mr-2 size-4" /> : null}
                        {saved ? "Enregistré" : "Enregistrer"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* APPARENCE */}
              {activeTab === "apparence" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Apparence</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Personnalisez l'apparence de l'application
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm">
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setTheme('light')}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors cursor-pointer",
                          "hover:border-primary hover:bg-secondary/50"
                        )}
                      >
                        <div className="size-8 rounded-full bg-white border border-gray-300 shadow-sm" />
                        <span className="text-xs font-medium">Clair</span>
                      </button>

                      <button
                        onClick={() => setTheme('dark')}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors cursor-pointer",
                          "hover:border-primary hover:bg-secondary/50"
                        )}
                      >
                        <div className="size-8 rounded-full bg-gray-900 border border-gray-700" />
                        <span className="text-xs font-medium">Sombre</span>
                      </button>

                      <button
                        onClick={() => setTheme('system')}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors cursor-pointer",
                          "hover:border-primary hover:bg-secondary/50"
                        )}
                      >
                        <div className="size-8 rounded-full bg-gradient-to-br from-white to-gray-900 border border-gray-400" />
                        <span className="text-xs font-medium">Système</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ZONE DE DANGER */}
              {activeTab === "danger" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Zone de danger</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Actions irréversibles sur votre compte
                    </p>
                  </div>

                  <div className="rounded-xl border border-red-500/50 bg-red-500/5 p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <Trash2 className="size-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">Supprimer le compte</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Cette action supprimera toutes vos données définitivement : produits, commandes, clients, rendez-vous...
                        </p>
                      </div>
                    </div>

                    <Separator className="bg-red-500/20" />

                    <div className="flex justify-end">
                      <Button variant="destructive" className="cursor-pointer">
                        <Trash2 className="mr-2 size-4" />
                        Supprimer définitivement
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
