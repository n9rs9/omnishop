"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { TopBar } from "@/components/dashboard/top-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import {
  Plus,
  Search,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  Edit,
  Trash2,
  Loader2,
  Eye,
} from "lucide-react"

interface Customer {
  id: string
  full_name: string
  whatsapp_number: string | null
  instagram_handle: string | null
  address: string | null
  total_orders: number
  seller_id: string
}

export default function CustomersPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const [formData, setFormData] = useState({
    full_name: "",
    whatsapp_number: "",
    instagram_handle: "",
    address: "",
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
      await fetchCustomers()
    }
    checkAuth()
  }, [router])

  const fetchCustomers = async () => {
    setIsLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    const { data } = await supabase
      .from('customers')
      .select('*')
      .eq('seller_id', session?.user.id)
      .order('full_name')
    
    if (data) {
      setCustomers(data as Customer[])
    }
    setIsLoading(false)
  }

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer)
      setFormData({
        full_name: customer.full_name,
        whatsapp_number: customer.whatsapp_number || "",
        instagram_handle: customer.instagram_handle || "",
        address: customer.address || "",
      })
    } else {
      setEditingCustomer(null)
      setFormData({
        full_name: "",
        whatsapp_number: "",
        instagram_handle: "",
        address: "",
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { session } } = await supabase.auth.getSession()

    const customerData = {
      full_name: formData.full_name,
      whatsapp_number: formData.whatsapp_number || null,
      instagram_handle: formData.instagram_handle || null,
      address: formData.address || null,
      seller_id: session?.user.id,
    }

    if (editingCustomer) {
      await supabase
        .from('customers')
        .update(customerData)
        .eq('id', editingCustomer.id)
    } else {
      await supabase
        .from('customers')
        .insert({ ...customerData, total_orders: 0 })
    }

    setIsModalOpen(false)
    await fetchCustomers()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) return
    await supabase.from('customers').delete().eq('id', id)
    await fetchCustomers()
  }

  const filteredCustomers = customers.filter(c =>
    c.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalCustomers = customers.length
  const totalOrders = customers.reduce((sum, c) => sum + (c.total_orders || 0), 0)
  const vipCustomers = customers.filter(c => (c.total_orders || 0) >= 5).length

  return (
    <>
      {/* MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingCustomer ? 'Modifier le client' : 'Nouveau client'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  placeholder="Ex: Jean Dupont"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="whatsapp"
                    placeholder="+33 6 12 34 56 78"
                    value={formData.whatsapp_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="instagram"
                    placeholder="@username"
                    value={formData.instagram_handle}
                    onChange={(e) => setFormData(prev => ({ ...prev, instagram_handle: e.target.value }))}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="address"
                  placeholder="123 Rue de la Paix, Paris"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="pl-9"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer"
              >
                Annuler
              </Button>
              <Button type="submit" className="cursor-pointer">
                {editingCustomer ? 'Modifier' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* PAGE CUSTOMERS */}
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
                  <h1 className="text-2xl font-bold text-foreground">Customers</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Gérez votre base de données clients
                  </p>
                </div>
                <Button
                  onClick={() => handleOpenModal()}
                  className="h-10 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg cursor-pointer"
                >
                  <Plus className="mr-2 size-4" />
                  Nouveau client
                </Button>
              </div>

              {/* STATS RAPIDES */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="border-border/50 bg-card/60 p-4 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-primary/15 flex items-center justify-center">
                        <User className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Clients</p>
                        <p className="text-xl font-bold text-foreground">{totalCustomers}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/60 p-4 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-green-500/15 flex items-center justify-center">
                        <ShoppingCart className="size-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Commandes totales</p>
                        <p className="text-xl font-bold text-foreground">{totalOrders}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/60 p-4 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-purple-500/15 flex items-center justify-center">
                        <Eye className="size-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Clients VIP</p>
                        <p className="text-xl font-bold text-foreground">{vipCustomers}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* BARRE DE RECHERCHE */}
              <div className="mb-4 flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* TABLEAU */}
              <div className="flex-1 overflow-auto rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Client</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Adresse</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Commandes</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Statut</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-12 text-center">
                          <Loader2 className="size-6 animate-spin mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mt-2">Chargement des clients...</p>
                        </TableCell>
                      </TableRow>
                    ) : filteredCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-12 text-center">
                          <User className="size-12 mx-auto text-muted-foreground/50 mb-3" />
                          <p className="text-sm text-muted-foreground">
                            {searchTerm ? "Aucun client trouvé" : "Aucun client. Ajoutez votre premier client !"}
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCustomers.map((customer) => {
                        const isVIP = (customer.total_orders || 0) >= 5
                        return (
                          <TableRow key={customer.id} className="border-border/50 hover:bg-secondary/30">
                            <TableCell className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-primary/15 flex items-center justify-center">
                                  <User className="size-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">{customer.full_name}</p>
                                  <p className="text-xs text-muted-foreground">ID: {customer.id.slice(0, 8)}...</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="space-y-1">
                                {customer.whatsapp_number && (
                                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                    <Phone className="size-3.5" />
                                    {customer.whatsapp_number}
                                  </p>
                                )}
                                {customer.instagram_handle && (
                                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                    <User className="size-3.5" />
                                    {customer.instagram_handle}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 max-w-xs">
                              <p className="text-sm text-muted-foreground truncate">
                                {customer.address || "—"}
                              </p>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-center">
                              <Badge variant="outline" className={cn(
                                "text-xs",
                                isVIP ? "bg-purple-500/15 text-purple-500 border-purple-500/20" : "bg-muted"
                              )}>
                                {customer.total_orders || 0}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-center">
                              <Badge variant="outline" className={cn(
                                "text-xs",
                                isVIP ? "bg-purple-500/15 text-purple-500 border-purple-500/20" : "bg-green-500/15 text-green-500 border-green-500/20"
                              )}>
                                {isVIP ? "VIP" : "Actif"}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleOpenModal(customer)}
                                  className="h-8 w-8 cursor-pointer"
                                >
                                  <Edit className="size-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(customer.id)}
                                  className="h-8 w-8 text-red-500 hover:text-red-600 cursor-pointer"
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
