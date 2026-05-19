'use client'

import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {

  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const login = async () => {

    if (loading) return

    setLoading(true)

    // correo interno ficticio
    const email = `${username}@mundial2026.com`

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      })

    if (error) {
      alert('Usuario o contraseña incorrectos')
      setLoading(false)
      return
    }

    router.push('/predictions')

    setLoading(false)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background:
          'linear-gradient(135deg, #0f172a, #1e293b, #334155)',
        padding: 20
      }}
    >

      <div
        style={{
          width: 380,
          background: 'white',
          padding: 35,
          borderRadius: 20,
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}
      >

        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              marginBottom: 8,
              fontSize: 32,
              color: '#0f172a'
            }}
          >
            ⚽ Mundial 2026
          </h1>

          <p
            style={{
              color: '#64748b',
              fontSize: 15
            }}
          >
            Ingresa para registrar tus pronósticos
          </p>
        </div>

        <div>
          <label
            style={{
              display: 'block',
              marginBottom: 6,
              fontWeight: 600,
              color: '#334155'
            }}
          >
            Usuario
          </label>

          <input
  type="text"
  placeholder="nombre"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  style={{
    width: '100%',
    padding: 14,
    borderRadius: 10,
    border: '1px solid #cbd5e1',
    fontSize: 15,
    outline: 'none',
    color: '#0f172a',
    background: 'white'
  }}
/>
        </div>

        <div>
          <label
            style={{
              display: 'block',
              marginBottom: 6,
              fontWeight: 600,
              color: '#334155'
            }}
          >
            Contraseña
          </label>

          <input
  type="password"
  placeholder="********"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  style={{
    width: '100%',
    padding: 14,
    borderRadius: 10,
    border: '1px solid #cbd5e1',
    fontSize: 15,
    outline: 'none',
    color: '#0f172a',
    background: 'white'
  }}
/>
        </div>

        <button
          onClick={login}
          disabled={loading}
          style={{
            background: '#2563eb',
            color: 'white',
            border: 'none',
            padding: 15,
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: '0.2s',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Ingresando...' : 'Entrar'}
        </button>

        <button
  onClick={() => router.push('/register')}
  style={{
    background: '#16a34a',
    color: 'white',
    border: 'none',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 'bold',
    cursor: 'pointer'
  }}
>
  Crear cuenta
</button>

        <p
          style={{
            textAlign: 'center',
            color: '#64748b',
            fontSize: 14,
            marginTop: 10
          }}
        >
          Sistema de Pronósticos del Mundial 2026 🌎
        </p>

      </div>

    </div>
  )
}