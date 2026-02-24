"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true) // True = Mode Connexion, False = Mode Inscription
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })

    if (isLogin) {
      // --- MODE CONNEXION ---
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setMessage({ text: "Erreur de connexion : " + error.message, type: 'error' })
        setLoading(false)
      } else {
        router.push('/') // Redirection propre vers le dashboard
      }
    } else {
      // --- MODE INSCRIPTION ---
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setMessage({ text: "Erreur d'inscription : " + error.message, type: 'error' })
        setLoading(false)
      } else {
        setMessage({ text: 'Compte créé avec succès ! Redirection...', type: 'success' })
        router.push('/') // L'utilisateur est connecté auto vu qu'on a désactivé l'email
      }
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4 lg:p-8">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        
        {/* En-tête dynamique */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isLogin ? 'Bon retour !' : 'Créer ton espace vendeur'}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isLogin 
              ? 'Connecte-toi pour gérer tes commandes Omnishop' 
              : 'Rejoins Omnishop et gère tes stocks comme un pro'}
          </p>
        </div>

        {/* Le formulaire unique qui gère les deux actions */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="vendeur@whatsapp.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="password">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'Créer mon compte')}
          </button>
        </form>

        {message.text && (
          <div className={`mt-6 rounded-md p-3 text-sm ${message.type === 'error' ? 'bg-red-50 text-red-500 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
            {message.text}
          </div>
        )}

        {/* Le bouton pour basculer entre Inscription et Connexion */}
        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">
            {isLogin ? "Vous n'avez pas de compte ? " : "Vous êtes déjà inscrit ? "}
          </span>
          <button
            onClick={() => {
              setIsLogin(!isLogin) // On inverse le mode
              setMessage({ text: '', type: '' }) // On efface les erreurs précédentes
            }}
            className="font-medium text-primary hover:underline focus:outline-none"
          >
            {isLogin ? 'Créer un compte' : 'Se connecter'}
          </button>
        </div>

      </div>
    </div>
  )
}