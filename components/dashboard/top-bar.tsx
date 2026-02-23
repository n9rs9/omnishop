"use client"

import { Button } from "@/components/ui/button"
import { Plus, Bell, Search } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SidebarNav } from "./sidebar-nav"
import { Menu } from "lucide-react"

export function TopBar() {
  return (
    <header className="flex items-center justify-between border-b border-border/50 bg-card/60 px-4 py-3 backdrop-blur-xl lg:px-6">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground"
              aria-label="Open navigation menu"
            >
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
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-xs text-muted-foreground">
            Welcome back, here is your store overview.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="hidden text-muted-foreground hover:text-foreground sm:flex"
          aria-label="Search"
        >
          <Search className="size-[18px]" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-[18px]" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
        </Button>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="size-4" />
          <span className="hidden sm:inline">Create New Order</span>
        </Button>
      </div>
    </header>
  )
}
