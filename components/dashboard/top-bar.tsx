"use client"

import { useState } from "react" // On ajoute le state pour le chargement
import { supabase } from "@/lib/supabase" // On importe ton cerveau
import { Button } from "@/components/ui/button"
import { Plus, Bell, Search, Menu, Loader2 } from "lucide-react" // On ajoute Loader2 pour le fun
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SidebarNav } from "./sidebar-nav"

export function TopBar() {
  const [isInserting, setIsInserting] = useState(false)

  // LA FONCTION MAGIQUE
  const handleCreateOrder = async () => {
    setIsInserting(true)
    
    // On insère une commande test dans ta table SQL
    const { data, error } = await supabase
      .from('orders')
      .insert([
        { 
          status: 'En attente', 
          total_price: 99.99, // On met un prix fixe pour le test
          // On ne met pas de product_id pour le test car on n'a pas encore créé de produits
        }
      ])

    if (error) {
      console.error("Erreur Supabase:", error.message)
      alert("Erreur : " + error.message)
    } else {
      alert("Vente enregistrée dans le Cloud ! 🚀")
      // On rafraîchit la page pour voir la nouvelle commande dans RecentOrders
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
          <p className="text-xs text-muted-foreground">Welcome back, Omnishop is ready.</p>
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

        {/* LE BOUTON CONNECTÉ */}
        <Button 
          onClick={handleCreateOrder} 
          disabled={isInserting}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isInserting ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Plus className="mr-2 size-4" />
          )}
          <span className="hidden sm:inline">
            {isInserting ? "Saving..." : "Create New Order"}
          </span>
        </Button>
      </div>
    </header>
  )
}