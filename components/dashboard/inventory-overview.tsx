import { cn } from "@/lib/utils"

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
  // On conserve l'affichage des 4 premiers éléments
  const displayItems = inventoryItems.slice(0, 4)
  const hasMore = inventoryItems.length > 4

  return (
    <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-card-foreground">
            Inventory Overview
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Stock levels across all categories
          </p>
        </div>
      </div>
      <div className="divide-y divide-border/50">
        {displayItems.map((item) => {
          const percent = Math.round((item.stock / item.maxStock) * 100)
          return (
            <div key={item.name} className="px-5 py-3.5">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-card-foreground">
                      {item.name}
                    </p>
                    <span className="shrink-0 rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex items-center gap-3">
                  <span className={cn("text-xs font-medium", getStockLabelColor(percent))}>
                    {getStockLabel(percent)}
                  </span>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {item.stock}/{item.maxStock}
                  </span>
                </div>
              </div>
              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    getStockColor(percent)
                  )}
                  style={{ width: `${percent}%` }}
                  role="progressbar"
                  aria-valuenow={item.stock}
                  aria-valuemin={0}
                  aria-valuemax={item.maxStock}
                />
              </div>
            </div>
          )
        })}
        
        {/* Utilisation du paramètre exact validé par ton test : py-[39px] */}
        {hasMore && (
          <div className="flex justify-center py-[39px]">
            <span className="text-muted-foreground/50 font-bold tracking-[0.5em] text-sm">
              ...
            </span>
          </div>
        )}
      </div>
    </div>
  )
}