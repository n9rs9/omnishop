"use client"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Copy, Check, Eye, Share } from "lucide-react"

type OrderStatus = "Delivered" | "In Transit" | "Processing" | "Cancelled"

interface Order {
  id: string
  customer: string
  product: string
  status: OrderStatus
  trackingUrl: string
}

const orders: Order[] = [
  {
    id: "ORD-7291",
    customer: "Sarah Mitchell",
    product: "Wireless Headphones Pro",
    status: "Delivered",
    trackingUrl: "https://track.omnishop.io/ORD-7291",
  },
  {
    id: "ORD-7290",
    customer: "James Chen",
    product: "Ergonomic Keyboard MX",
    status: "In Transit",
    trackingUrl: "https://track.omnishop.io/ORD-7290",
  },
  {
    id: "ORD-7289",
    customer: "Olivia Ramirez",
    product: "USB-C Hub Adapter",
    status: "Processing",
    trackingUrl: "https://track.omnishop.io/ORD-7289",
  },
  {
    id: "ORD-7288",
    customer: "Liam O'Brien",
    product: "Smart Desk Lamp",
    status: "Delivered",
    trackingUrl: "https://track.omnishop.io/ORD-7288",
  },
  {
    id: "ORD-7287",
    customer: "Emily Nakamura",
    product: "Noise Cancelling Earbuds",
    status: "Cancelled",
    trackingUrl: "https://track.omnishop.io/ORD-7287",
  },
  
]

const statusStyles: Record<OrderStatus, string> = {
  Delivered: "bg-success/15 text-success border-success/20",
  "In Transit": "bg-primary/15 text-primary border-primary/20",
  Processing: "bg-warning/15 text-warning border-warning/20",
  Cancelled: "bg-destructive/15 text-destructive border-destructive/20",
}

export function RecentOrders() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  function handleCopy(order: Order) {
    navigator.clipboard.writeText(order.trackingUrl)
    setCopiedId(order.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm">
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-card-foreground">
            Recent Orders
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {orders.length} orders this session
          </p>
        </div>
        {/* BOUTON VIEW ALL STYLE BLANC APPLE */}
        <button className="flex items-center gap-2 bg-white text-black px-3 py-1.5 rounded-lg text-[11px] font-bold hover:bg-white/90 transition-all shadow-sm active:scale-95">
          <Eye className="size-3.5" />
          View all
        </button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-transparent">
            {/* Alignement px-5 pour coller au titre du header */}
            <TableHead className="px-5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Customer
            </TableHead>
            <TableHead className="px-5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Product
            </TableHead>
            <TableHead className="px-5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="px-5 text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Quick Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              className="border-border/50 hover:bg-secondary/5 transition-colors"
            >
              <TableCell className="px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    {order.customer}
                  </p>
                  <p className="text-[10px] font-mono text-muted-foreground">{order.id}</p>
                </div>
              </TableCell>
              <TableCell className="px-5 py-3.5 text-sm text-muted-foreground">
                {order.product}
              </TableCell>
              <TableCell className="px-5 py-3.5">
                <Badge
                  variant="outline"
                  className={cn("px-2 py-0.5 text-[10px] font-medium", statusStyles[order.status])}
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="px-5 py-3.5 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
                        onClick={() => handleCopy(order)}
                      >
                        {copiedId === order.id ? (
                          <Check className="size-3.5 text-success" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {copiedId === order.id ? "Copied!" : "Copy link"}
                    </TooltipContent>
                  </Tooltip>

                  {/* AJOUT DE L'ICÔNE SHARE */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
                      >
                        <Share className="size-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share order</TooltipContent>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}