"use client"

import { useState } from "react" 
import { useRouter } from "next/navigation" 
import { supabase } from "@/lib/supabase" 
import { Button } from "@/components/ui/button"
import { Plus, Bell, Search, Menu, Loader2, LogOut } from "lucide-react" 
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SidebarNav } from "./sidebar-nav"

interface TopBarProps {
  userName?: string;
}

export function TopBar({ userName }: TopBarProps) {
  const router = useRouter()
  const [isInserting, setIsInserting] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error("Erreur déconnexion:", error.message)
      alert("Erreur : " + error.message)
      setIsLoggingOut(false)
    } else {
      router.push('/login')
    }
  }

  const handleCreateOrder = async () => {
    setIsInserting(true)
    
    const { data, error } = await supabase
      .from('orders')
      .insert([
        { 
          status: 'En attente', 
          total_price: 99.99,
        }
      ])

    if (error) {
      console.error("Erreur Supabase:", error.message)
      alert("Erreur : " + error.message)
    } else {
      alert("Vente enregistrée dans le Cloud ! 🚀")
      window.location.reload()
    }
    setIsInserting(false)
  }

  return (
    <header className="flex items-center justify-between border-b border-border/50 bg-card/60 px-4 py-3 backdrop-blur-xl lg:px-6">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground">
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

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="hidden text-muted-foreground sm:flex">
          <Search className="size-[18px]" />
        </Button>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
          <Bell className="size-[18px]" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
        </Button>

        {/* --- BOUTON DÉCONNEXION (Noir/Contour, Hauteur 10) --- */}
        <Button 
          variant="outline" 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="h-10 border-border bg-transparent text-foreground hover:bg-accent"
        >
          {isLoggingOut ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 size-4" />
          )}
          <span className="hidden sm:inline">Déconnexion</span>
        </Button>

        {/* --- BOUTON CRÉER UNE COMMANDE (Couleur primaire, Hauteur 10) --- */}
        <Button 
          onClick={handleCreateOrder} 
          disabled={isInserting}
          className="h-10 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isInserting ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Plus className="mr-2 size-4" />
          )}
          <span className="hidden sm:inline">Create New Order</span>
        </Button>
      </div>
    </header>
  )
}