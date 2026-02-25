"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { TopBar } from "@/components/dashboard/top-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { cn } from "@/lib/utils"

import {
  Plus,
  Search,
  Package,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  Loader2,
  DollarSign,
  Image as ImageIcon,
} from "lucide-react"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stock_quantity: number
  image_url: string | null
  seller_id: string
}

export default function InventoryPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    image_url: "",
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
      await fetchProducts()
    }
    checkAuth()
  }, [router])

  const fetchProducts = async () => {
    setIsLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', session?.user.id)
      .order('name')
    
    if (data) {
      setProducts(data as Product[])
    }
    setIsLoading(false)
  }

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        stock_quantity: product.stock_quantity.toString(),
        image_url: product.image_url || "",
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: "",
        description: "",
        price: "",
        stock_quantity: "",
        image_url: "",
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { session } } = await supabase.auth.getSession()

    const productData = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      stock_quantity: parseInt(formData.stock_quantity),
      image_url: formData.image_url || null,
      seller_id: session?.user.id,
    }

    if (editingProduct) {
      await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id)
    } else {
      await supabase
        .from('products')
        .insert(productData)
    }

    setIsModalOpen(false)
    await fetchProducts()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return
    await supabase.from('products').delete().eq('id', id)
    await fetchProducts()
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Rupture", color: "bg-red-500/15 text-red-500 border-red-500/20" }
    if (stock < 10) return { label: "Critique", color: "bg-orange-500/15 text-orange-500 border-orange-500/20" }
    if (stock < 50) return { label: "Faible", color: "bg-yellow-500/15 text-yellow-500 border-yellow-500/20" }
    return { label: "En stock", color: "bg-green-500/15 text-green-500 border-green-500/20" }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalProducts = products.length
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0)
  const lowStock = products.filter(p => p.stock_quantity < 10).length
  const outOfStock = products.filter(p => p.stock_quantity === 0).length

  return (
    <>
      {/* MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du produit</Label>
              <Input
                id="name"
                placeholder="Ex: Casquette Premium"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez le produit..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix (€)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Quantité en stock</Label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="stock"
                    type="number"
                    placeholder="0"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL de l'image</Label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="image"
                  placeholder="https://..."
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
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
                {editingProduct ? 'Modifier' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* PAGE INVENTORY */}
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
                  <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Gérez vos produits et stocks
                  </p>
                </div>
                <Button
                  onClick={() => handleOpenModal()}
                  className="h-10 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg cursor-pointer"
                >
                  <Plus className="mr-2 size-4" />
                  Nouveau produit
                </Button>
              </div>

              {/* STATS RAPIDES */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-primary/15 flex items-center justify-center">
                      <Package className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Produits</p>
                      <p className="text-xl font-bold text-foreground">{totalProducts}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-green-500/15 flex items-center justify-center">
                      <DollarSign className="size-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Valeur du Stock</p>
                      <p className="text-xl font-bold text-foreground">${totalValue.toFixed(0)}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-orange-500/15 flex items-center justify-center">
                      <AlertTriangle className="size-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Stock Faible</p>
                      <p className="text-xl font-bold text-foreground">{lowStock}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-red-500/15 flex items-center justify-center">
                      <TrendingDown className="size-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Rupture</p>
                      <p className="text-xl font-bold text-foreground">{outOfStock}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* BARRE DE RECHERCHE */}
              <div className="mb-4 flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un produit..."
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
                      <TableHead className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Produit</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Prix</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Stock</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Statut</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-12 text-center">
                          <Loader2 className="size-6 animate-spin mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mt-2">Chargement des produits...</p>
                        </TableCell>
                      </TableRow>
                    ) : filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-12 text-center">
                          <Package className="size-12 mx-auto text-muted-foreground/50 mb-3" />
                          <p className="text-sm text-muted-foreground">
                            {searchTerm ? "Aucun produit trouvé" : "Aucun produit. Créez votre premier produit !"}
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => {
                        const stockStatus = getStockStatus(product.stock_quantity)
                        return (
                          <TableRow key={product.id} className="border-border/50 hover:bg-secondary/30">
                            <TableCell className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {product.image_url && (
                                  <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="size-10 rounded-lg object-cover"
                                  />
                                )}
                                <div>
                                  <p className="font-medium text-foreground">{product.name}</p>
                                  <p className="text-xs text-muted-foreground">ID: {product.id.slice(0, 8)}...</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 max-w-xs">
                              <p className="text-sm text-muted-foreground truncate">
                                {product.description || "—"}
                              </p>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-right">
                              <p className="font-semibold text-foreground">${product.price.toFixed(2)}</p>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-center">
                              <p className={cn(
                                "font-medium",
                                product.stock_quantity === 0 ? "text-red-500" :
                                product.stock_quantity < 10 ? "text-orange-500" : "text-foreground"
                              )}>
                                {product.stock_quantity}
                              </p>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-center">
                              <Badge variant="outline" className={cn("text-xs", stockStatus.color)}>
                                {stockStatus.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleOpenModal(product)}
                                  className="h-8 w-8 cursor-pointer"
                                >
                                  <Edit className="size-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(product.id)}
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
