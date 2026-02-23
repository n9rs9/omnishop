import { DollarSign, Truck, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"

const stats = [
  {
    title: "Daily Sales",
    value: "$12,426",
    change: "+14.2%",
    trend: "up" as const,
    icon: DollarSign,
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
  },
  {
    title: "Active Shipments",
    value: "284",
    change: "+6.8%",
    trend: "up" as const,
    icon: Truck,
    iconBg: "bg-chart-2/15",
    iconColor: "text-chart-2",
  },
  {
    title: "Low Stock Alert",
    value: "18",
    change: "-3.1%",
    trend: "down" as const,
    icon: AlertTriangle,
    iconBg: "bg-warning/15",
    iconColor: "text-warning",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/80 p-5 backdrop-blur-sm transition-colors hover:bg-card"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {stat.title}
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-card-foreground">
                {stat.value}
              </p>
            </div>
            <div
              className={`flex size-10 items-center justify-center rounded-lg ${stat.iconBg}`}
            >
              <stat.icon className={`size-5 ${stat.iconColor}`} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            {stat.trend === "up" ? (
              <TrendingUp className="size-3.5 text-success" />
            ) : (
              <TrendingDown className="size-3.5 text-destructive" />
            )}
            <span
              className={`text-xs font-medium ${
                stat.trend === "up" ? "text-success" : "text-destructive"
              }`}
            >
              {stat.change}
            </span>
            <span className="text-xs text-muted-foreground">vs last week</span>
          </div>
        </div>
      ))}
    </div>
  )
}
