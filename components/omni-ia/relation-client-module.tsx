"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, MessageSquare, Send, CheckCircle2, AlertCircle } from "lucide-react"

export function RelationClientModule({ userName }: { userName: string }) {
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [sentMessages, setSentMessages] = useState<{ client: string; msg: string; time: string }[]>([])

  const clients = [
    { id: "1", name: "Jean Dupont", email: "jean@email.com", status: "active", lastPurchase: "2 jours" },
    { id: "2", name: "Marie Martin", email: "marie@email.com", status: "inactive", lastPurchase: "45 jours" },
    { id: "3", name: "Pierre Bernard", email: "pierre@email.com", status: "active", lastPurchase: "1 jour" },
    { id: "4", name: "Sophie Garcia", email: "sophie@email.com", status: "inactive", lastPurchase: "60 jours" },
  ]

  const suggestedMessages: Record<string, string> = {
    "1": "Merci pour votre achat récent! Découvrez nos nouveaux produits.",
    "2": "On vous a manqué! Bénéficiez de 20% de réduction sur votre prochaine commande.",
    "3": "Votre commande est bien reçue. Suivi rapide sur votre tableau de bord.",
    "4": "Nous avons spécialement sélectionné des produits pour vous. À découvrir!",
  }

  const handleSendMessage = () => {
    if (!selectedClient || !message.trim()) return

    const client = clients.find((c) => c.id === selectedClient)
    if (client) {
      setSentMessages([
        ...sentMessages,
        { client: client.name, msg: message, time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) },
      ])
      setMessage("")
    }
  }

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Clients Actifs</div>
            <div className="text-3xl font-bold">237</div>
            <div className="text-xs text-emerald-600 mt-2">+5 cette semaine</div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">À Relancer</div>
            <div className="text-3xl font-bold">48</div>
            <div className="text-xs text-orange-600 mt-2">Inactifs 30+ jours</div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Messages Envoyés</div>
            <div className="text-3xl font-bold">{sentMessages.length}</div>
            <div className="text-xs text-blue-600 mt-2">Aujourd'hui</div>
          </CardContent>
        </Card>
      </div>

      {/* Message Automation */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="size-5 text-purple-500" />
            Automation Clients
          </CardTitle>
          <CardDescription>Envoyez des messages automatiques ciblés</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Client Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Sélectionnez un client</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {clients.map((client) => (
                <Button
                  key={client.id}
                  variant={selectedClient === client.id ? "default" : "outline"}
                  onClick={() => setSelectedClient(client.id)}
                  className="justify-start h-auto p-3 flex-col items-start"
                >
                  <div className="font-medium text-sm">{client.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {client.status === "active" ? "🟢" : "🔴"} {client.lastPurchase}
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Suggested Message */}
          {selectedClient && (
            <div>
              <label className="text-sm font-medium mb-2 block">Message suggéré par IA</label>
              <div className="bg-muted/50 p-3 rounded-lg border border-border text-sm">
                {suggestedMessages[selectedClient]}
              </div>
            </div>
          )}

          {/* Message Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">Votre message</label>
            <div className="flex gap-2">
              <Input
                placeholder="Tapez votre message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!selectedClient || !message.trim()}
                className="bg-purple-500 hover:bg-purple-600 text-white gap-2"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </div>

          {/* Sent Messages */}
          {sentMessages.length > 0 && (
            <div className="border-t pt-4">
              <label className="text-sm font-medium mb-2 block">Messages envoyés</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {sentMessages.map((item, idx) => (
                  <div key={idx} className="bg-muted/30 p-3 rounded-lg text-sm flex items-start gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-xs">{item.client}</div>
                      <div className="text-muted-foreground">{item.msg}</div>
                      <div className="text-xs text-muted-foreground mt-1">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Automations */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Automations Actives</CardTitle>
          <CardDescription>Flux de communication automatisés</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "Email de bienvenue", trigger: "Nouveau client", frequency: "Immédiat" },
            { name: "Relance inactivité", trigger: "30 jours sans achat", frequency: "Chaque semaine" },
            { name: "Remerciement achat", trigger: "Après commande", frequency: "Chaque jour" },
          ].map((auto, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 border border-border rounded-lg">
              <AlertCircle className="size-5 text-purple-500 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-sm">{auto.name}</div>
                <div className="text-xs text-muted-foreground">{auto.trigger} • {auto.frequency}</div>
              </div>
              <Button variant="ghost" size="sm">Modifier</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
