"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isToday, isSameDay } from "date-fns"
import { fr } from "date-fns/locale"

import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { TopBar } from "@/components/dashboard/top-bar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, DollarSign, Trash2, User, Package } from "lucide-react"

interface Appointment {
  id: string
  appointment_date: string
  appointment_time: string
  duration_minutes: number
  status: string
  potential_revenue: number
  location: string | null
  notes: string | null
  customer: {
    id: string
    full_name: string
    whatsapp_number: string | null
  } | null
  product: {
    id: string
    name: string
    price: number
  } | null
}

export default function CalendarPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [customers, setCustomers] = useState<{ id: string; full_name: string; whatsapp_number: string | null }[]>([])
  const [products, setProducts] = useState<{ id: string; name: string; price: number }[]>([])
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)

  const [formData, setFormData] = useState({
    customer_id: "",
    product_id: "",
    appointment_time: "14:00",
    duration_minutes: 30,
    status: "Schedulé",
    potential_revenue: "",
    location: "",
    notes: "",
  })

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/login")
        return
      }
      const metadata = session.user.user_metadata
      setUserName(metadata?.full_name || "Vendeur")
      await fetchData(startOfWeek(new Date(), { weekStartsOn: 1 }))
    }
    checkAuth()
  }, [router])

  const fetchData = async (weekStart: Date) => {
    const start = startOfWeek(weekStart, { weekStartsOn: 1 })
    const end = endOfWeek(weekStart, { weekStartsOn: 1 })

    const { data: apptsData } = await supabase
      .from('appointments')
      .select(`
        id,
        appointment_date,
        appointment_time,
        duration_minutes,
        status,
        potential_revenue,
        location,
        notes,
        customer:customer_id (id, full_name, whatsapp_number),
        product:product_id (id, name, price)
      `)
      .gte('appointment_date', format(start, 'yyyy-MM-dd'))
      .lte('appointment_date', format(end, 'yyyy-MM-dd'))
      .order('appointment_date', { ascending: true })

    if (apptsData) setAppointments(apptsData as unknown as Appointment[])

    const { data: customersData } = await supabase.from('customers').select('id, full_name, whatsapp_number').order('full_name')
    if (customersData) setCustomers(customersData)

    const { data: productsData } = await supabase.from('products').select('id, name, price').gt('stock_quantity', 0).order('name')
    if (productsData) setProducts(productsData)
  }

  const handlePrevWeek = () => {
    const newWeekStart = subWeeks(currentWeekStart, 1)
    setCurrentWeekStart(newWeekStart)
    fetchData(newWeekStart)
  }

  const handleNextWeek = () => {
    const newWeekStart = addWeeks(currentWeekStart, 1)
    setCurrentWeekStart(newWeekStart)
    fetchData(newWeekStart)
  }

  const handleToday = () => {
    const today = startOfWeek(new Date(), { weekStartsOn: 1 })
    setCurrentWeekStart(today)
    fetchData(today)
  }

  const days = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart, { weekStartsOn: 1 }),
  })

  const getDayAppointments = (date: Date) => {
    return appointments.filter(apt => apt.appointment_date === format(date, 'yyyy-MM-dd'))
  }

  const getDayTotalRevenue = (date: Date) => {
    const dayAppts = getDayAppointments(date)
    return dayAppts.reduce((sum, apt) => sum + (apt.potential_revenue || 0), 0)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Schedulé': 'bg-blue-500/15 text-blue-500 border-blue-500/20',
      'Confirmé': 'bg-green-500/15 text-green-500 border-green-500/20',
      'En cours': 'bg-orange-500/15 text-orange-500 border-orange-500/20',
      'Terminé': 'bg-purple-500/15 text-purple-500 border-purple-500/20',
      'Annulé': 'bg-red-500/15 text-red-500 border-red-500/20',
      'No-show': 'bg-gray-500/15 text-gray-500 border-gray-500/20',
    }
    return colors[status] || 'bg-gray-500/15 text-gray-500'
  }

  const handleDayClick = (date: Date) => {
    setSelectedDay(date)
    setFormData({
      customer_id: "",
      product_id: "",
      appointment_time: "14:00",
      duration_minutes: 30,
      status: "Schedulé",
      potential_revenue: "",
      location: "",
      notes: "",
    })
    setEditingAppointment(null)
    setIsModalOpen(true)
  }

  const handleEditAppointment = (apt: Appointment, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingAppointment(apt)
    setFormData({
      customer_id: apt.customer?.id || "",
      product_id: apt.product?.id || "",
      appointment_time: apt.appointment_time,
      duration_minutes: apt.duration_minutes || 30,
      status: apt.status,
      potential_revenue: apt.potential_revenue?.toString() || "",
      location: apt.location || "",
      notes: apt.notes || "",
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDay) return

    const appointmentData = {
      appointment_date: format(selectedDay, 'yyyy-MM-dd'),
      appointment_time: formData.appointment_time,
      duration_minutes: parseInt(formData.duration_minutes.toString()),
      status: formData.status,
      potential_revenue: parseFloat(formData.potential_revenue) || 0,
      location: formData.location || null,
      notes: formData.notes || null,
      customer_id: formData.customer_id || null,
      product_id: formData.product_id || null,
    }

    if (editingAppointment) {
      await supabase.from('appointments').update(appointmentData).eq('id', editingAppointment.id)
    } else {
      const { data: { session } } = await supabase.auth.getSession()
      await supabase.from('appointments').insert({ ...appointmentData, seller_id: session?.user.id })
    }

    setIsModalOpen(false)
    fetchData(currentWeekStart)
  }

  const handleDeleteAppointment = async () => {
    if (!editingAppointment) return
    await supabase.from('appointments').delete().eq('id', editingAppointment.id)
    setIsModalOpen(false)
    fetchData(currentWeekStart)
  }

  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 })
  const weekRange = format(currentWeekStart, 'd MMM', { locale: fr }) + ' - ' + format(weekEnd, 'd MMM yyyy', { locale: fr })

  const statusOptions = [
    { id: 'Schedulé', color: 'bg-blue-500/15 text-blue-500 border-blue-500/20 hover:bg-blue-500/25' },
    { id: 'Confirmé', color: 'bg-green-500/15 text-green-500 border-green-500/20 hover:bg-green-500/25' },
    { id: 'En cours', color: 'bg-orange-500/15 text-orange-500 border-orange-500/20 hover:bg-orange-500/25' },
    { id: 'Terminé', color: 'bg-purple-500/15 text-purple-500 border-purple-500/20 hover:bg-purple-500/25' },
    { id: 'Annulé', color: 'bg-red-500/15 text-red-500 border-red-500/20 hover:bg-red-500/25' },
    { id: 'No-show', color: 'bg-gray-500/15 text-gray-500 border-gray-500/20 hover:bg-gray-500/25' },
  ]

  const handleCopyLocation = async () => {
    if (formData.location) {
      await navigator.clipboard.writeText(formData.location)
    }
  }

  const handlePasteLocation = async () => {
    const text = await navigator.clipboard.readText()
    setFormData(prev => ({ ...prev, location: text }))
  }

  return (
    <>
      {/* MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          {/* HEADER AVEC GROS TITRE */}
          <div className="text-center pb-4 border-b border-border">
            {selectedDay && (
              <>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">
                  {format(selectedDay, 'EEEE', { locale: fr })}
                </p>
                <p className="text-4xl font-black text-foreground mt-1">
                  {format(selectedDay, 'd')}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {format(selectedDay, 'MMMM yyyy', { locale: fr })}
                </p>
              </>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            {/* CHAMPS CLIENT ET PRODUIT - MÊME LARGEUR */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer" className="text-sm font-medium">Client</Label>
                <Select value={formData.customer_id} onValueChange={(v) => setFormData(prev => ({ ...prev, customer_id: v }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product" className="text-sm font-medium">Produit concerné</Label>
                <Select value={formData.product_id} onValueChange={(v) => setFormData(prev => ({ ...prev, product_id: v }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Optionnel" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name} ({p.price}€)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* HEURE ET DURÉE - MÊME LARGEUR */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium">Heure</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.appointment_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, appointment_time: e.target.value }))}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-medium">Durée</Label>
                <Select value={formData.duration_minutes.toString()} onValueChange={(v) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(v) }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="45">45 min</SelectItem>
                    <SelectItem value="60">1 heure</SelectItem>
                    <SelectItem value="90">1h30</SelectItem>
                    <SelectItem value="120">2 heures</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* CA POTENTIEL */}
            <div className="space-y-2">
              <Label htmlFor="revenue" className="text-sm font-medium">CA Potentiel (€)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="revenue"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.potential_revenue}
                  onChange={(e) => setFormData(prev => ({ ...prev, potential_revenue: e.target.value }))}
                  className="pl-9 w-full"
                />
              </div>
            </div>

            {/* LIEU AVEC BOUTONS COPIER/COLLER */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="location" className="text-sm font-medium">Lieu</Label>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLocation}
                    disabled={!formData.location}
                    className="h-7 px-2 text-xs cursor-pointer"
                  >
                    Copier
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handlePasteLocation}
                    className="h-7 px-2 text-xs cursor-pointer"
                  >
                    Coller
                  </Button>
                </div>
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="Boutique, domicile client, café..."
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="pl-9 w-full"
                />
              </div>
            </div>

            {/* STATUT EN BOUTONS ÉTIQUETTES */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Statut</Label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status: status.id }))}
                    className={`
                      px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer
                      ${formData.status === status.id
                        ? status.color + ' ring-2 ring-offset-1 ring-current'
                        : 'bg-secondary/50 text-muted-foreground border-border hover:bg-secondary'
                      }
                    `}
                  >
                    {status.id}
                  </button>
                ))}
              </div>
            </div>

            {/* NOTES */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Détails du rendez-vous..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>

            <DialogFooter className="gap-2">
              {editingAppointment && (
                <Button type="button" variant="destructive" onClick={handleDeleteAppointment} className="cursor-pointer">
                  <Trash2 className="size-4 mr-2" />
                  Supprimer
                </Button>
              )}
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="cursor-pointer">
                Annuler
              </Button>
              <Button type="submit" className="cursor-pointer">
                {editingAppointment ? 'Modifier' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* PAGE CALENDRIER */}
      <div style={{ zoom: "1.25" }} className="fixed inset-0 flex overflow-hidden bg-background">
        <div className="hidden w-[260px] shrink-0 lg:block h-full">
          <SidebarNav />
        </div>

        <div className="flex flex-1 flex-col h-full overflow-hidden">
          <TopBar userName={userName} />

          <main className="h-full overflow-hidden px-6 py-6">
            <div className="h-full flex flex-col">
              {/* EN-TÊTE */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Calendrier des Rendez-vous</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Gérez vos rencontres clients et suivez le CA potentiel
                  </p>
                </div>
                <Button
                  onClick={() => handleDayClick(new Date())}
                  className="h-10 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg cursor-pointer"
                >
                  <Plus className="mr-2 size-4" />
                  Nouveau RDV
                </Button>
              </div>

              {/* NAVIGATION SEMAINE */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={handlePrevWeek} className="cursor-pointer">
                    <ChevronLeft className="size-5" />
                  </Button>
                  <Button variant="outline" onClick={handleToday} className="cursor-pointer">
                    Cette semaine
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleNextWeek} className="cursor-pointer">
                    <ChevronRight className="size-5" />
                  </Button>
                </div>
                <h2 className="text-lg font-semibold text-foreground capitalize">{weekRange}</h2>
                <div className="w-32" />
              </div>

              {/* GRILLE HEBDO - 7 JOURS */}
              <div className="flex-1 overflow-auto">
                <div className="grid grid-cols-7 gap-4" style={{ minHeight: 'calc(100vh - 320px)' }}>
                  {days.map((day) => {
                    const dayAppts = getDayAppointments(day)
                    const totalRevenue = getDayTotalRevenue(day)
                    const today = isToday(day)

                    return (
                      <div
                        key={day.toISOString()}
                        onClick={() => handleDayClick(day)}
                        className={`
                          flex flex-col rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-3
                          cursor-pointer transition-colors hover:bg-card/80
                          ${today ? 'ring-2 ring-primary ring-inset' : ''}
                        `}
                      >
                        {/* EN-TÊTE DU JOUR - NOM + DATE */}
                        <div className="text-center mb-3 pb-3 border-b border-border/50">
                          <p className={`text-xs font-semibold uppercase tracking-wider ${today ? 'text-primary' : 'text-muted-foreground'}`}>
                            {format(day, 'EEEE', { locale: fr })}
                          </p>
                          <p className={`text-2xl font-bold mt-1 ${today ? 'text-primary' : 'text-foreground'}`}>
                            {format(day, 'd')}
                          </p>
                        </div>

                        {/* GROS COMPTEUR CA POTENTIEL */}
                        <div className="mb-4 p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                          <div className="text-center">
                            <p className="text-[10px] uppercase tracking-wider text-green-600 font-semibold mb-1">
                              CA Potentiel
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                              ${totalRevenue.toFixed(2)}
                            </p>
                            {dayAppts.length > 0 && (
                              <p className="text-[9px] text-green-600/70 mt-1">
                                {dayAppts.length} RDV
                              </p>
                            )}
                          </div>
                        </div>

                        {/* LISTE DES RDV */}
                        <div className="flex-1 space-y-2 overflow-y-auto">
                          {dayAppts.length === 0 ? (
                            <div className="text-center py-4 text-xs text-muted-foreground">
                              Aucun RDV
                            </div>
                          ) : (
                            dayAppts.map(apt => (
                              <div
                                key={apt.id}
                                onClick={(e) => handleEditAppointment(apt, e)}
                                className={`
                                  p-2.5 rounded-lg border text-xs cursor-pointer
                                  ${getStatusColor(apt.status)}
                                `}
                              >
                                <div className="flex items-center gap-1.5 font-semibold mb-1.5">
                                  <Clock className="size-3" />
                                  {format(new Date(`2000-01-01T${apt.appointment_time}`), 'HH:mm')}
                                </div>
                                {apt.customer && (
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <User className="size-3" />
                                    <span className="truncate">{apt.customer.full_name}</span>
                                  </div>
                                )}
                                {apt.product && (
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <Package className="size-3" />
                                    <span className="truncate">{apt.product.name}</span>
                                  </div>
                                )}
                                {apt.location && (
                                  <div className="flex items-center gap-1.5">
                                    <MapPin className="size-3" />
                                    <span className="truncate">{apt.location}</span>
                                  </div>
                                )}
                                {apt.potential_revenue > 0 && (
                                  <div className="mt-2 pt-2 border-t border-current/20 text-[10px] font-bold">
                                    ${apt.potential_revenue.toFixed(2)}
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* LÉGENDE */}
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="size-3 rounded bg-blue-500/15 border border-blue-500/20" />
                  Schedulé
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-3 rounded bg-green-500/15 border border-green-500/20" />
                  Confirmé
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-3 rounded bg-orange-500/15 border border-orange-500/20" />
                  En cours
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-3 rounded bg-purple-500/15 border border-purple-500/20" />
                  Terminé
                </span>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
