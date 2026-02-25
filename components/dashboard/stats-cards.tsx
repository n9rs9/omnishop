"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { DollarSign, Truck, Sparkles, TrendingUp, Zap, Calendar } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface StatsCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "ia" | "calendar"
  icon: React.ElementType
  iconBg: string
  iconColor: string
  onClick?: () => void
}

function StatsCard({ title, value, change, trend, icon: Icon, iconBg, iconColor, onClick }: StatsCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/80 p-5 backdrop-blur-sm transition-colors hover:bg-card cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-card-foreground">{value}</p>
        </div>
        <div className={`flex size-10 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className={`size-5 ${iconColor}`} />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        {trend === "ia" ? (
          <>
            <Zap className="size-3.5 text-purple-500" />
            <span className="text-xs font-medium text-purple-500">{change}</span>
          </>
        ) : trend === "calendar" ? (
          <>
            <Calendar className="size-3.5 text-pink-500" />
            <span className="text-xs font-medium text-pink-500">{change}</span>
          </>
        ) : (
          <>
            <TrendingUp className="size-3.5 text-success" />
            <span className="text-xs font-medium text-success">{change}</span>
            <span className="text-xs text-muted-foreground">vs last week</span>
          </>
        )}
      </div>
    </div>
  )
}

export function StatsCards() {
  const [appointmentCount, setAppointmentCount] = useState(0)
  const [potentialRevenue, setPotentialRevenue] = useState(0)

  useEffect(() => {
    const fetchAppointments = async () => {
      const today = new Date().toISOString().split('T')[0]
      const { data } = await supabase
        .from('appointments')
        .select('potential_revenue, appointment_date')
        .gte('appointment_date', today)

      if (data) {
        setAppointmentCount(data.length)
        setPotentialRevenue(data.reduce((sum, apt) => sum + (apt.potential_revenue || 0), 0))
      }
    }
    fetchAppointments()
  }, [])

  const todayDate = format(new Date(), 'd MMMM', { locale: fr })
  const capitalizedDate = todayDate.charAt(0).toUpperCase() + todayDate.slice(1)

  const handleOmniIAClick = () => {
    window.location.href = '/omni-ia'
  }

  const stats: StatsCardProps[] = [
    {
      title: "Daily Sales",
      value: "$12,426",
      change: "+14.2%",
      trend: "up",
      icon: DollarSign,
      iconBg: "bg-primary/15",
      iconColor: "text-primary"
    },
    {
      title: "Active Shipments",
      value: "284",
      change: "+6.8%",
      trend: "up",
      icon: Truck,
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-500"
    },
    {
      title: "Rendez-vous",
      value: appointmentCount > 0 ? `${appointmentCount}` : "Aucun",
      change: `${capitalizedDate} ${potentialRevenue > 0 ? `(${potentialRevenue.toFixed(0)}€ potentiel)` : ''}`,
      trend: "calendar",
      icon: Calendar,
      iconBg: "bg-pink-500/15",
      iconColor: "text-pink-500"
    },
    {
      title: "Omni IA",
      value: "Assistant IA",
      change: "Gratuit & Illimité",
      trend: "ia",
      icon: Sparkles,
      iconBg: "bg-purple-500/15",
      iconColor: "text-purple-500",
      onClick: handleOmniIAClick
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}
