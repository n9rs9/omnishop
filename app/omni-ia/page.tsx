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
  TrendingUp,
  Users,
  MessageSquare,
  Send,
  Sparkles,
  Zap,
  Target,
  Lightbulb,
  BarChart3,
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

    // Simulation de réponse IA (à remplacer par un vrai appel API)
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
      description: "Analysez vos ventes, stocks et performances",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      id: "marketing",
      title: "Marketing",
      description: "Générez du contenu et campagnes automatiques",
      icon: Target,
      color: "from-purple-500 to-pink-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      id: "relation",
      title: "Relation Client",
      description: "Automatisez vos communications clients",
      icon: Users,
      color: "from-green-500 to-emerald-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
  ]

  return (
    <div style={{ zoom: "1.15" }} className="fixed inset-0 flex overflow-hidden bg-background">
      <div className="hidden w-[260px] shrink-0 lg:block h-full">
        <SidebarNav />
      </div>

      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <TopBar userName={userName} />

        <main className="h-full overflow-hidden px-6 py-6">
          <div className="h-full overflow-auto">
            {/* EN-TÊTE */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-3">
                <Sparkles className="size-8 text-purple-500" />
                Omni IA
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Votre assistant intelligent pour booster votre business
              </p>
            </div>

            {/* CALAMAR / OCTOPUS DESIGN */}
            <div className="relative max-w-4xl mx-auto mb-12">
              {/* CENTRE - CERVEAU IA */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="size-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/30">
                  <Brain className="size-16 text-white" />
                </div>
              </div>

              {/* TENTACULES + MODULES */}
              <div className="grid grid-cols-3 gap-8 py-16">
                {modules.map((module, index) => (
                  <div key={module.id} className="relative">
                    {/* LIGNE/TENTACULE reliant au centre */}
                    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent w-full" 
                         style={{ 
                           transform: index === 0 ? 'translateX(-100%) translateY(-50%)' : 
                                      index === 2 ? 'translateY(-50%)' : 
                                      'translateY(-50%)',
                           width: index === 0 ? '100%' : index === 2 ? '100%' : '0',
                         }} 
                    />
                    
                    <Card className={cn(
                      "border-2 transition-all cursor-pointer hover:scale-105 hover:shadow-xl",
                      module.bg,
                      module.border
                    )}>
                      <CardContent className="p-6 text-center">
                        <div className={cn(
                          "size-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br",
                          module.color
                        )}>
                          <module.icon className="size-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">{module.title}</h3>
                        <p className="text-xs text-muted-foreground mt-2">{module.description}</p>
                        <Button className="mt-4 w-full cursor-pointer" variant="outline" size="sm">
                          Explorer
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              {/* TENTACULES DÉCORATIFS (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10" viewBox="0 0 800 300">
                {/* Tentacule gauche */}
                <path
                  d="M 200 150 Q 150 150 120 120 Q 90 90 80 60"
                  fill="none"
                  stroke="url(#gradient1)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="opacity-30"
                />
                {/* Tentacule droite */}
                <path
                  d="M 600 150 Q 650 150 680 120 Q 710 90 720 60"
                  fill="none"
                  stroke="url(#gradient2)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="opacity-30"
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* OMNICHAT - MODULE CENTRAL */}
            <div className="max-w-3xl mx-auto">
              <Card className="border-2 border-purple-500/20 bg-gradient-to-b from-purple-500/5 to-transparent">
                <CardHeader className="text-center pb-2">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <MessageSquare className="size-5 text-purple-500" />
                    <h2 className="text-xl font-bold text-foreground">OmniChat</h2>
                    <Zap className="size-4 text-yellow-500" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Posez-moi n'importe quelle question sur votre business
                  </p>
                </CardHeader>
                <CardContent>
                  {/* ZONE DE CHAT */}
                  <div className="h-80 overflow-y-auto rounded-lg border border-border bg-muted/30 p-4 mb-4 space-y-3">
                    {chatHistory.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                        <Lightbulb className="size-12 mb-3 opacity-50" />
                        <p className="text-sm">Posez-moi une question sur :</p>
                        <div className="flex gap-2 mt-2 flex-wrap justify-center">
                          <span className="text-xs bg-purple-500/10 text-purple-500 px-2 py-1 rounded-full">Ventes</span>
                          <span className="text-xs bg-purple-500/10 text-purple-500 px-2 py-1 rounded-full">Stocks</span>
                          <span className="text-xs bg-purple-500/10 text-purple-500 px-2 py-1 rounded-full">Clients</span>
                          <span className="text-xs bg-purple-500/10 text-purple-500 px-2 py-1 rounded-full">RDV</span>
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
                              "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
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
                        <div className="bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-2xl px-4 py-2 text-sm">
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
                  <div className="flex gap-2">
                    <Input
                      placeholder="Comment puis-je vous aider aujourd'hui ?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isTyping}
                      className="bg-purple-500 hover:bg-purple-600 text-white cursor-pointer"
                    >
                      <Send className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={className}>{children}</div>
}
