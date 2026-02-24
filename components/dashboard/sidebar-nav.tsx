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
    <aside className="flex h-full flex-col border-r border-border/50 bg-sidebar px-3 py-6 pb-6">
      <div className="mb-6 flex items-center gap-2.5 px-3">
        <Hexagon className="size-7 text-primary" />
        <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
          Omnishop
        </span>
      </div>

      <nav className="flex flex-col gap-1" role="navigation" aria-label="Main navigation">
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
      {/* CARTE PRO PLAN : p-4 et shrink-0 pour rester fixe */}
      <div style={{ marginTop: '315px' }} className="rounded-lg border border-border/50 bg-secondary/50 p-4 shrink-0">
        <p className="text-xs font-medium text-foreground">Pro Plan</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          3 of 5 stores used
        </p>
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: "60%" }}
          />
        </div>
      </div>
    </aside>
  )
}