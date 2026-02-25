"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Plus, Bell, Search, Menu, Loader2, LogOut, Store } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SidebarNav } from "./sidebar-nav"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TopBarProps {
  userName?: string;
}

export function TopBar({ userName }: TopBarProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false)
  const [isAddingStore, setIsAddingStore] = useState(false)
  const [storeName, setStoreName] = useState("")

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      alert("Erreur : " + error.message)
      setIsLoggingOut(false)
    } else {
      router.push('/login')
    }
  }

  const handleAddStore = async () => {
    if (!storeName.trim()) return
    setIsAddingStore(true)
    // TODO: Implémenter l'ajout de store dans Supabase
    // Pour l'instant, on simule
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsAddingStore(false)
    setIsStoreModalOpen(false)
    setStoreName("")
    alert("Store ajouté ! (Feature Pro - à implémenter)")
  }

  return (
    <header className="flex items-center justify-between border-b border-border/50 bg-card/60 px-4 py-3 backdrop-blur-xl lg:px-6">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground cursor-pointer">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] border-border/50 bg-sidebar p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <SidebarNav />
          </SheetContent>
        </Sheet>

        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-xs text-muted-foreground">
            {userName ? `Welcome back, ${userName}` : "Welcome back, Omnishop is ready."}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* RECHERCHE ANIMÉE */}
        <div className="relative flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="z-10 text-muted-foreground hover:bg-transparent cursor-pointer"
          >
            <Search className="size-[18px]" />
          </Button>
          <input
            type="text"
            placeholder="Search anything..."
            className={cn(
              "h-9 rounded-md bg-secondary/50 px-3 text-sm transition-all duration-300 ease-in-out focus:outline-none focus:ring-1 focus:ring-primary",
              isSearchOpen 
                ? "ml-2 w-48 opacity-100" 
                : "w-0 opacity-0 overflow-hidden px-0"
            )}
          />
        </div>

        {/* CLOCHE */}
        <Button variant="ghost" size="icon" className="group relative text-muted-foreground cursor-pointer">
          <Bell className="size-[18px]" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary transition-colors group-hover:bg-black" />
        </Button>

        {/* DÉCONNEXION */}
        <Button
          variant="outline"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="h-10 border-border bg-transparent text-foreground hover:bg-accent cursor-pointer"
        >
          {isLoggingOut ? <Loader2 className="mr-2 size-4 animate-spin" /> : <LogOut className="mr-2 size-4" />}
          <span className="hidden sm:inline">Déconnexion</span>
        </Button>

        {/* ADD A NEW STORE */}
        <Button
          onClick={() => setIsStoreModalOpen(true)}
          className="h-10 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg cursor-pointer"
        >
          <Store className="mr-2 size-4" />
          <span className="hidden sm:inline">Add a new store</span>
        </Button>
      </div>

      {/* MODAL ADD STORE */}
      <Dialog open={isStoreModalOpen} onOpenChange={setIsStoreModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle boutique</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="store-name">Nom de la boutique</Label>
              <Input
                id="store-name"
                placeholder="Ex: Ma Boutique Paris"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStoreModalOpen(false)} className="cursor-pointer">
              Annuler
            </Button>
            <Button onClick={handleAddStore} disabled={isAddingStore || !storeName.trim()} className="cursor-pointer">
              {isAddingStore ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Plus className="mr-2 size-4" />}
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  )
}