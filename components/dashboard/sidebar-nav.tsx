"use client"

import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  Settings,
  Hexagon,
  Sparkles,
  Calendar,
  CreditCard,
} from "lucide-react"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Inventory", icon: Package, href: "/inventory" },
  { label: "Customers", icon: Users, href: "/customers" },
  { label: "Calendar", icon: Calendar, href: "/calendar" },
  { label: "OmniAds", icon: Sparkles, href: "/omni-ads" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
  { label: "Settings", icon: Settings, href: "/settings" },
]

const bottomNavItems = [
  { label: "Pricing", icon: CreditCard, href: "/pricing" },
]

export function SidebarNav() {
  const pathname = usePathname()
  const handleLogoClick = () => {
    window.location.reload()
  }

  return (
    <aside className="flex h-full flex-col border-r border-border/50 bg-sidebar py-6">
      {/* LOGO */}
      <button
        onClick={handleLogoClick}
        className="mb-6 flex items-center gap-2.5 px-6 transition-opacity hover:opacity-80 active:scale-95 cursor-pointer border-none bg-transparent"
      >
        <Hexagon className="size-7 text-primary" />
        <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
          Omnishop
        </span>
      </button>

      {/* MENU PRINCIPAL */}
      <nav className="flex flex-col gap-1 px-3" role="navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <button
              key={item.label}
              onClick={() => window.location.href = item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer border-none",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="size-[18px]" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* PRICING LINK */}
      <div className="mt-auto px-3 pb-4">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <button
              key={item.label}
              onClick={() => window.location.href = item.href}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="size-[18px]" />
              {item.label}
            </button>
          )
        })}
      </div>

      {/* SPACER */}
      <div className="flex-1" />

      {/* ZONE FREE PLAN + LIGNE */}
      <div className="mb-[27px] shrink-0">
        <div className="px-6 pb-6">
          <p className="text-xs font-bold text-foreground">Free Plan</p>
          <p className="mt-1 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            1 of 1 store used
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: "100%" }}
            />
          </div>
        </div>
        <div className="h-[1.5px] w-full bg-border" />
      </div>
    </aside>
  )
}