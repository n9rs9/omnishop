"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { TopBar } from "@/components/dashboard/top-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import {
  Brain,
  MessageSquare,
  Send,
  Sparkles,
  Zap,
  BarChart3,
  Target,
  Users,
  TrendingUp,
  Mail,
  Phone,
} from "lucide-react"

export default function OmniIAPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "ai"; content: string }[]>([])
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/login")
        return
      }
      const metadata = session.user.user_metadata
      setUserName(metadata?.full_name || "Vendeur")
    }
    checkAuth()
  }, [router])

  const handleSendMessage = async () => {
    if (!message.trim()) return
    
    setChatHistory(prev => [...prev, { role: "user", content: message }])
    setMessage("")
    setIsTyping(true)

    setTimeout(() => {
      const responses = [
        "Je peux vous aider à analyser vos ventes de la semaine. Voulez-vous voir les tendances ?",
        "Je remarque que vos rendez-vous du jeudi ont un potentiel de 450€. Souhaitez-vous des conseils pour optimiser ?",
        "Vos stocks de 'Wireless Headphones Pro' sont critiques (12 unités). Je peux générer un email de relance pour vos clients.",
        "Basé sur vos données, je vous recommande de contacter 3 clients cette semaine. Voulez-vous que je prépare les messages ?",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setChatHistory(prev => [...prev, { role: "ai", content: randomResponse }])
      setIsTyping(false)
    }, 1500)
  }

  const modules = [
    {
      id: "analyse",
      title: "Analyse",
      description: "Ventes, stocks, performances",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-500",
      stats: "+12.5%",
      statLabel: "ce mois",
    },
    {
      id: "marketing",
      title: "Marketing",
      description: "Contenu & campagnes auto",
      icon: Target,
      color: "from-purple-500 to-pink-500",
      stats: "3 actives",
      statLabel: "campagnes",
    },
    {
      id: "relation",
      title: "Relation Client",
      description: "Communications auto",
      icon: Users,
      color: "from-green-500 to-emerald-500",
      stats: "85%",
      statLabel: "satisfaction",
    },
  ]

  return (
    <div style={{ zoom: "1.25" }} className="fixed inset-0 flex overflow-hidden bg-background">
      <div className="hidden w-[260px] shrink-0 lg:block h-full">
        <SidebarNav />
      </div>

      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <TopBar userName={userName} />

        <main className="h-full overflow-hidden px-6 py-6">
          <div className="h-full flex flex-col gap-4">
            {/* HEADER */}
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Brain className="size-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Omni IA</h1>
                  <p className="text-xs text-muted-foreground">Votre assistant intelligent</p>
                </div>
              </div>
              <Badge gradient="from-purple-500 to-pink-500">Gratuit & Illimité</Badge>
            </div>

            {/* MODULES */}
            <div className="grid grid-cols-3 gap-3 shrink-0">
              {modules.map((module) => (
                <Card key={module.id} className="border-border/50 bg-card/60 backdrop-blur-sm hover:bg-card transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className={cn(
                      "size-10 rounded-lg mb-3 flex items-center justify-center bg-gradient-to-br",
                      module.color
                    )}>
                      <module.icon className="size-5 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">{module.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{module.description}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <TrendingUp className="size-3 text-green-500" />
                      <span className="text-xs font-bold text-foreground">{module.stats}</span>
                      <span className="text-[10px] text-muted-foreground">{module.statLabel}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* OMNICHAT */}
            <Card className="flex-1 flex flex-col border-border/50 bg-card/60 backdrop-blur-sm min-h-0">
              <div className="p-4 border-b border-border/50 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <MessageSquare className="size-4 text-purple-500" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-foreground">OmniChat</h2>
                      <p className="text-xs text-muted-foreground">Discutez avec votre IA</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <Zap className="size-3 mr-1 text-yellow-500" />
                    En ligne
                  </Badge>
                </div>
              </div>

              {/* ZONE DE CHAT */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {chatHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <div className="size-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4">
                      <Brain className="size-8 text-purple-500" />
                    </div>
                    <p className="text-sm font-medium">Comment puis-je vous aider ?</p>
                    <div className="flex gap-2 mt-4 flex-wrap justify-center">
                      <SuggestionChip icon={BarChart3} label="Analyser les ventes" />
                      <SuggestionChip icon={Users} label="Relancer les clients" />
                      <SuggestionChip icon={Target} label="Créer une campagne" />
                    </div>
                  </div>
                ) : (
                  chatHistory.map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex",
                        msg.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                        )}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-2xl px-4 py-2.5">
                      <div className="flex gap-1">
                        <span className="size-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="size-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="size-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* INPUT */}
              <div className="p-4 border-t border-border/50 shrink-0">
                <div className="flex gap-2">
                  <Input
                    placeholder="Posez-moi une question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isTyping}
                    className="bg-purple-500 hover:bg-purple-600 text-white cursor-pointer shrink-0"
                  >
                    <Send className="size-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

function Badge({ children, gradient, variant = "default", className }: { 
  children: React.ReactNode
  gradient?: string
  variant?: "default" | "outline"
  className?: string
}) {
  if (variant === "outline") {
    return (
      <span className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        className
      )}>
        {children}
      </span>
    )
  }
  
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r",
      gradient || "from-purple-500 to-pink-500",
      className
    )}>
      {children}
    </span>
  )
}

function SuggestionChip({ icon: Icon, label }: { icon: React.ElementType, label: string }) {
  return (
    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-500 text-xs font-medium hover:bg-purple-500/20 transition-colors cursor-pointer border border-purple-500/20">
      <Icon className="size-3.5" />
      {label}
    </button>
  )
}
