"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  Settings,
  Hexagon,
} from "lucide-react"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Inventory", icon: Package, active: false },
  { label: "Customers", icon: Users, active: false },
  { label: "Analytics", icon: BarChart3, active: false },
  { label: "Settings", icon: Settings, active: false },
]

export function SidebarNav() {
  return (
    <aside className="flex h-full flex-col border-r border-border/50 bg-sidebar py-6">
      {/* LOGO - Padding horizontal conservé ici */}
      <div className="mb-6 flex items-center gap-2.5 px-6">
        <Hexagon className="size-7 text-primary" />
        <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
          Omnishop
        </span>
      </div>

      {/* MENU PRINCIPAL - Padding horizontal conservé ici */}
      <nav className="flex flex-col gap-1 px-3" role="navigation">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              item.active
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-sidebar-foreground"
            )}
          >
            <item.icon className="size-[18px]" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* SPACER */}
      <div className="flex-1" />

      {/* ZONE PRO PLAN + LIGNE : On monte de 30px avec mb-[30px] */}
      <div className="mb-[27px] shrink-0">
        
        {/* Infos Pro Plan (avec padding pour l'alignement texte) */}
        <div className="px-6 pb-6">
          <p className="text-xs font-bold text-foreground">Pro Plan</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            3 of 5 stores used
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: "60%" }}
            />
          </div>
        </div>

        {/* LIGNE DE SÉPARATION : Plus épaisse (h-[2px]) et pleine largeur (pas de px-6 ici) */}
        <div className="h-[1.5px] w-full bg-border" />
      </div>
    </aside>
  )
}