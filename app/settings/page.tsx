"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { TopBar } from "@/components/dashboard/top-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
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
  CreditCard,
  Store,
  Globe,
  Moon,
  Smartphone,
} from "lucide-react"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const router = useRouter()
  const { setTheme } = useTheme()
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

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
      setIsLoading(false)
    }
    checkAuth()
  }, [router])

  const handleSaveProfile = async () => {
    setIsSaving(true)
    await supabase.auth.updateUser({
      data: {
        full_name: fullName,
      }
    })
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsSaving(false)
  }

  const handleSaveStore = async () => {
    setIsSaving(true)
    await supabase.auth.updateUser({
      data: {
        store_name: storeName,
        store_url: storeUrl,
      }
    })
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsSaving(false)
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    // TODO: Implémenter la suppression réelle du compte
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsDeleting(false)
    setIsDeleteModalOpen(false)
    alert("Compte supprimé (simulation)")
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-3">
          <Loader2 className="size-6 animate-spin" />
          <span>Chargement des paramètres...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* MODAL SUPPRESSION */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-500">Supprimer le compte</DialogTitle>
            <DialogDescription className="pt-2">
              Cette action est irréversible. Toutes vos données (produits, commandes, clients) seront définitivement supprimées.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="cursor-pointer">
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting} className="cursor-pointer">
              {isDeleting ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Trash2 className="mr-2 size-4" />}
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PAGE SETTINGS */}
      <div style={{ zoom: "1.25" }} className="fixed inset-0 flex overflow-hidden bg-background">
        <div className="hidden w-[260px] shrink-0 lg:block h-full">
          <SidebarNav />
        </div>

        <div className="flex flex-1 flex-col h-full overflow-hidden">
          <TopBar userName={userName} />

          <main className="h-full overflow-hidden px-6 py-6">
            <div className="h-full overflow-auto">
              <div className="max-w-4xl">
                {/* EN-TÊTE */}
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Gérez votre profil, vos notifications et vos préférences
                  </p>
                </div>

                <div className="space-y-6">
                  {/* PROFIL */}
                  <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <User className="size-5 text-primary" />
                        <CardTitle>Profil</CardTitle>
                      </div>
                      <CardDescription>Vos informations personnelles</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
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
                      </div>

                      <div className="flex justify-end">
                        <Button onClick={handleSaveProfile} disabled={isSaving} className="cursor-pointer">
                          {isSaving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Check className="mr-2 size-4" />}
                          Enregistrer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* BOUTIQUE */}
                  <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Store className="size-5 text-primary" />
                        <CardTitle>Boutique</CardTitle>
                      </div>
                      <CardDescription>Informations de votre boutique</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
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
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              id="storeUrl"
                              value={storeUrl}
                              onChange={(e) => setStoreUrl(e.target.value)}
                              className="pl-9"
                              placeholder="maboutique.com"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button onClick={handleSaveStore} disabled={isSaving} className="cursor-pointer">
                          {isSaving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Check className="mr-2 size-4" />}
                          Enregistrer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* NOTIFICATIONS */}
                  <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Bell className="size-5 text-primary" />
                        <CardTitle>Notifications</CardTitle>
                      </div>
                      <CardDescription>Gérez vos préférences de notification</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                          <CreditCard className="size-4 text-muted-foreground" />
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
                    </CardContent>
                  </Card>

                  {/* APPARENCE */}
                  <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Palette className="size-5 text-primary" />
                        <CardTitle>Apparence</CardTitle>
                      </div>
                      <CardDescription>Personnalisez l'apparence de l'application</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setTheme('light')}
                          className={cn(
                            "flex flex-col items-center gap-2 rounded-lg border p-4 transition-all cursor-pointer",
                            "hover:border-primary hover:bg-secondary/50"
                          )}
                        >
                          <div className="size-8 rounded-full bg-white border border-gray-300 shadow-sm" />
                          <span className="text-xs font-medium">Clair</span>
                        </button>

                        <button
                          onClick={() => setTheme('dark')}
                          className={cn(
                            "flex flex-col items-center gap-2 rounded-lg border p-4 transition-all cursor-pointer",
                            "hover:border-primary hover:bg-secondary/50"
                          )}
                        >
                          <div className="size-8 rounded-full bg-gray-900 border border-gray-700" />
                          <span className="text-xs font-medium">Sombre</span>
                        </button>

                        <button
                          onClick={() => setTheme('system')}
                          className={cn(
                            "flex flex-col items-center gap-2 rounded-lg border p-4 transition-all cursor-pointer",
                            "hover:border-primary hover:bg-secondary/50"
                          )}
                        >
                          <div className="size-8 rounded-full bg-gradient-to-br from-white to-gray-900 border border-gray-400" />
                          <span className="text-xs font-medium">Système</span>
                        </button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* ZONE DE DANGER */}
                  <Card className="border-red-500/50 bg-red-500/5">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Trash2 className="size-5 text-red-500" />
                        <CardTitle className="text-red-500">Zone de danger</CardTitle>
                      </div>
                      <CardDescription>Actions irréversibles sur votre compte</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">Supprimer le compte</p>
                          <p className="text-xs text-muted-foreground">
                            Cette action supprimera toutes vos données définitivement
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => setIsDeleteModalOpen(true)}
                          className="cursor-pointer"
                        >
                          <Trash2 className="mr-2 size-4" />
                          Supprimer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
