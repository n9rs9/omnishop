"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { TopBar } from "@/components/dashboard/top-bar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import {
  MessageSquare,
  FileText,
  Image,
  Instagram,
  Mail,
  Sparkles,
  Send,
  Plus,
  History,
  Copy,
  Check,
  X,
} from "lucide-react"

export default function OmniIAPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [activeTab, setActiveTab] = useState<"chat" | "content" | "image">("chat")
  const [contentType, setContentType] = useState<"description" | "social" | "email">("description")
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [contentInput, setContentInput] = useState("")
  const [imagePrompt, setImagePrompt] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [copied, setCopied] = useState(false)

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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ zoom: "1.25" }} className="fixed inset-0 flex overflow-hidden bg-background">
      {/* SIDEBAR - SANS POINTILLÉS */}
      <div className="hidden w-[260px] shrink-0 lg:block h-full">
        <SidebarNav />
      </div>

      {/* ZONE PRINCIPALE - AVEC FOND POINTILLÉ */}
      <div className="flex flex-1 flex-col h-full overflow-hidden relative">
        {/* FOND POINTILLÉ (uniquement sur la zone principale, pas la sidebar) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0'
          }}
        />

        <TopBar userName={userName} />

        <main className="h-full overflow-hidden px-6 py-6 relative z-10">
          <div className="h-full flex flex-col">
            {/* HEADER */}
            <div className="flex items-center gap-3 mb-6 shrink-0">
              <div>
                <h1 className="text-lg font-bold text-foreground">Omni IA</h1>
                <p className="text-[10px] text-muted-foreground">Votre assistant intelligent</p>
              </div>
            </div>

            {/* ONGLETS DE NAVIGATION */}
            <div className="flex gap-2 mb-6 shrink-0">
              <button
                onClick={() => setActiveTab("chat")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeTab === "chat"
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                )}
              >
                <MessageSquare className="size-4" />
                Chat
              </button>
              <button
                onClick={() => setActiveTab("content")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeTab === "content"
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                )}
              >
                <FileText className="size-4" />
                Contenu
              </button>
              <button
                onClick={() => setActiveTab("image")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeTab === "image"
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                )}
              >
                <Image className="size-4" />
                Image
              </button>
            </div>

            {/* CONTENU DES ONGLETS */}
            <div className="flex-1 overflow-hidden">
              
              {/* ONGLET CHAT */}
              {activeTab === "chat" && (
                <div className="h-full flex flex-col">
                  {/* ZONE DE MESSAGES */}
                  <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <MessageSquare className="size-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-sm text-gray-500">Commence une conversation avec l'IA</p>
                        </div>
                      </div>
                    ) : (
                      messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "flex",
                            msg.role === "user" ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[70%] px-4 py-2.5 rounded-2xl text-sm",
                              msg.role === "user"
                                ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                                : "bg-white text-gray-700"
                            )}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* ZONE DE SAISIE */}
                  <div className="shrink-0">
                    <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-pink-200 via-rose-200 to-pink-300">
                      <div className="bg-white rounded-[14px] p-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter" && inputMessage.trim()) {
                                setMessages([...messages, { role: "user", content: inputMessage }])
                                setInputMessage("")
                              }
                            }}
                            placeholder="Pose ta question..."
                            className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                          />
                          <button
                            onClick={() => {
                              if (inputMessage.trim()) {
                                setMessages([...messages, { role: "user", content: inputMessage }])
                                setInputMessage("")
                              }
                            }}
                            className="p-2 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 cursor-pointer transition-opacity hover:opacity-90"
                          >
                            <Send className="size-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ONGLET CONTENU */}
              {activeTab === "content" && (
                <div className="h-full overflow-y-auto">
                  {/* SÉLECTEUR DE TYPE DE CONTENU */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setContentType("description")}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                        contentType === "description"
                          ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <Sparkles className="size-3.5" />
                      Description produit
                    </button>
                    <button
                      onClick={() => setContentType("social")}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                        contentType === "social"
                          ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <Instagram className="size-3.5" />
                      Post réseaux sociaux
                    </button>
                    <button
                      onClick={() => setContentType("email")}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                        contentType === "email"
                          ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <Mail className="size-3.5" />
                      Email marketing
                    </button>
                  </div>

                  {/* CARTE DE GÉNÉRATION */}
                  <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-pink-100 via-rose-100 to-pink-200 mb-4">
                    <div className="bg-white rounded-[18px] p-5">
                      {/* HEADER */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                          {contentType === "description" && <Sparkles className="size-5 text-white" />}
                          {contentType === "social" && <Instagram className="size-5 text-white" />}
                          {contentType === "email" && <Mail className="size-5 text-white" />}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-800">
                            {contentType === "description" && "Description produit"}
                            {contentType === "social" && "Post réseaux sociaux"}
                            {contentType === "email" && "Email marketing"}
                          </h3>
                          <p className="text-[10px] text-gray-500">
                            {contentType === "description" && "Génère des descriptions produits engageantes"}
                            {contentType === "social" && "Crée des posts pour Instagram, Facebook, etc."}
                            {contentType === "email" && "Rédige des emails marketing percutants"}
                          </p>
                        </div>
                      </div>

                      {/* ZONE DE SAISIE */}
                      <textarea
                        value={contentInput}
                        onChange={(e) => setContentInput(e.target.value)}
                        placeholder={
                          contentType === "description"
                            ? "Décris ton produit (nom, caractéristiques, avantages...)"
                            : contentType === "social"
                            ? "Décris le contenu de ton post (sujet, ton, plateforme...)"
                            : "Décris ton email (objectif, audience, message clé...)"
                        }
                        className="w-full h-28 resize-none rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-pink-300 mb-3"
                      />

                      {/* BOUTON GÉNÉRER */}
                      <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold cursor-pointer transition-opacity hover:opacity-90">
                        Générer
                      </button>
                    </div>
                  </div>

                  {/* RÉSULTAT GÉNÉRÉ */}
                  {generatedContent && (
                    <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-pink-100 via-rose-100 to-pink-200">
                      <div className="bg-white rounded-[18px] p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-bold text-gray-700">Résultat</h4>
                          <button
                            onClick={() => handleCopy(generatedContent)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs cursor-pointer hover:bg-gray-200 transition-colors"
                          >
                            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                            {copied ? "Copié" : "Copier"}
                          </button>
                        </div>
                        <div className="p-3 rounded-xl bg-gray-50 text-sm text-gray-700 leading-relaxed">
                          {generatedContent}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ONGLET IMAGE */}
              {activeTab === "image" && (
                <div className="h-full overflow-y-auto">
                  {/* CARTE DE GÉNÉRATION D'IMAGE */}
                  <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-pink-100 via-rose-100 to-pink-200 mb-4">
                    <div className="bg-white rounded-[18px] p-5">
                      {/* HEADER */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                          <Image className="size-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-800">Génération d'image</h3>
                          <p className="text-[10px] text-gray-500">Crée des visuels produits avec l'IA</p>
                        </div>
                      </div>

                      {/* ZONE DE SAISIE */}
                      <textarea
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        placeholder="Décris l'image que tu veux générer (style, couleurs, éléments...)"
                        className="w-full h-28 resize-none rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-pink-300 mb-3"
                      />

                      {/* BOUTON GÉNÉRER */}
                      <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold cursor-pointer transition-opacity hover:opacity-90">
                        Générer l'image
                      </button>
                    </div>
                  </div>

                  {/* APERÇU IMAGE */}
                  <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-pink-100 via-rose-100 to-pink-200">
                    <div className="bg-white rounded-[18px] p-5">
                      <div className="aspect-video rounded-xl bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <Image className="size-10 text-gray-300 mx-auto mb-2" />
                          <p className="text-xs text-gray-400">L'image générée apparaîtra ici</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
