'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Register() {

  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] =
  useState(false)

  const register = async () => {

    if (loading) return

    setLoading(true)

    const cleanUsername =
    username
    .trim()
    .replace(/\s+/g, '')

    const email =
    `${cleanUsername}@mundial2026.com`

    const {
      data,
      error
    } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    const user = data.user

    if (user) {

      const { error: profileError } =
        await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username,
            points: 0
          })

      if (profileError) {
        alert(profileError.message)
        setLoading(false)
        return
      }
    }

    alert('Usuario registrado ✅')

    router.push('/login')

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
            🏆 Crear Cuenta
          </h1>

          <p
            style={{
              color: '#64748b',
              fontSize: 15
            }}
          >
            Regístrate para participar en el Mundial 2026
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
            onChange={(e) =>
              setUsername(e.target.value)
            }
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

          <div
  style={{
    position: 'relative'
  }}
>

  <input
    type={
      showPassword
        ? 'text'
        : 'password'
    }
    placeholder="********"
    value={password}
    onChange={(e) =>
      setPassword(e.target.value)
    }
    style={{
      width: '100%',
      padding: 14,
      paddingRight: 50,
      borderRadius: 10,
      border: '1px solid #cbd5e1',
      fontSize: 15,
      outline: 'none',
      color: '#0f172a'
    }}
  />

  <button
    type="button"
    onClick={() =>
      setShowPassword(!showPassword)
    }
    style={{
      position: 'absolute',
      right: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontSize: 18
    }}
  >
    {
      showPassword
        ? '🙈'
        : '👁️'
    }
  </button>

</div>

        </div>

        <button
          onClick={register}
          disabled={loading}
          style={{
            background: '#16a34a',
            color: 'white',
            border: 'none',
            padding: 15,
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 'bold',
            cursor: 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading
            ? 'Creando cuenta...'
            : 'Registrarse'}
        </button>

        <button
          onClick={() => router.push('/login')}
          style={{
            background: '#2563eb',
            color: 'white',
            border: 'none',
            padding: 15,
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Volver al Login
        </button>

        <p
          style={{
            textAlign: 'center',
            color: '#64748b',
            fontSize: 14,
            marginTop: 10
          }}
        >
          Pronósticos del Mundial 2026 🌎
        </p>

      </div>

    </div>
  )
}