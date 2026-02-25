"use client"

import { cn } from "@/lib/utils"
import { Boxes } from "lucide-react"

interface InventoryItem {
  name: string
  stock: number
  maxStock: number
  category: string
}

const inventoryItems: InventoryItem[] = [
  { name: "Wireless Headphones Pro", stock: 342, maxStock: 500, category: "Audio" },
  { name: "Ergonomic Keyboard MX", stock: 89, maxStock: 300, category: "Peripherals" },
  { name: "USB-C Hub Adapter", stock: 24, maxStock: 200, category: "Accessories" },
  { name: "Smart Desk Lamp", stock: 156, maxStock: 250, category: "Lighting" },
  { name: "Noise Cancelling Earbuds", stock: 12, maxStock: 400, category: "Audio" },
  { name: "Portable Charger 20K", stock: 201, maxStock: 350, category: "Power" },
]

function getStockColor(percent: number) {
  if (percent < 15) return "bg-destructive"
  if (percent < 40) return "bg-warning"
  return "bg-primary"
}

function getStockLabel(percent: number) {
  if (percent < 15) return "Critical"
  if (percent < 40) return "Low"
  return "In Stock"
}

function getStockLabelColor(percent: number) {
  if (percent < 15) return "text-destructive"
  if (percent < 40) return "text-warning"
  return "text-muted-foreground"
}

export function InventoryOverview() {
  // On définit 4 slots fixes
  const slots = [0, 1, 2, 3]

  return (
    <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm">
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-card-foreground">Inventory Overview</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Stock levels across all categories</p>
        </div>
      </div>
      <div className="divide-y divide-border/50">
        {slots.map((index) => {
          const item = inventoryItems[index]
          const isLastSlot = index === 3

          // Si pas d'item dans la data, on rend une case vide pour garder la hauteur
          if (!item) {
            return (
              <div key={`empty-${index}`} className="px-5 py-[26.5px] opacity-10">
                <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
              </div>
            )
          }

          const percent = Math.round((item.stock / item.maxStock) * 100)

          return (
            <div 
              key={item.name} 
              className={cn(
                "px-5 py-3.5 transition-all",
                isLastSlot && "blur-[2px] opacity-40 pointer-events-none select-none"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-card-foreground">{item.name}</p>
                    <span className="shrink-0 rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{item.category}</span>
                  </div>
                </div>
                <div className="ml-4 flex items-center gap-3">
                  <span className={cn("text-xs font-medium", getStockLabelColor(percent))}>{getStockLabel(percent)}</span>
                  <span className="text-xs tabular-nums text-muted-foreground">{item.stock}/{item.maxStock}</span>
                </div>
              </div>
              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className={cn("h-full rounded-full transition-all", getStockColor(percent))} style={{ width: `${percent}%` }} />
              </div>
            </div>
          )
        })}
        
        <div className="flex justify-center py-[32px]">
          <button
            onClick={() => window.location.href = '/inventory'}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-xs font-bold hover:bg-white/90 transition-all shadow-lg active:scale-95 cursor-pointer border-none"
          >
            <Boxes className="size-3.5" />
            View All Stock
          </button>
        </div>
      </div>
    </div>
  )
}