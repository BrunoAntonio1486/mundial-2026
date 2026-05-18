'use client'

import Link from 'next/link'

export default function HomePage() {

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
          width: 450,
          background: 'white',
          padding: 40,
          borderRadius: 24,
          boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
          textAlign: 'center'
        }}
      >

        <h1
          style={{
            fontSize: 42,
            marginBottom: 10,
            color: '#0f172a'
          }}
        >
          ⚽ Mundial 2026
        </h1>

        <p
          style={{
            color: '#64748b',
            fontSize: 18,
            marginBottom: 35
          }}
        >
          Sistema oficial de pronósticos del Mundial 🌎
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18
          }}
        >

          <Link
            href="/login"
            style={{
              background: '#2563eb',
              color: 'white',
              padding: '16px',
              borderRadius: 14,
              textDecoration: 'none',
              fontSize: 18,
              fontWeight: 'bold'
            }}
          >
            🔐 Iniciar Sesión
          </Link>

          <Link
            href="/register"
            style={{
              background: '#16a34a',
              color: 'white',
              padding: '16px',
              borderRadius: 14,
              textDecoration: 'none',
              fontSize: 18,
              fontWeight: 'bold'
            }}
          >
            🏆 Registrarse
          </Link>

          <Link
            href="/ranking"
            style={{
              background: '#f59e0b',
              color: 'white',
              padding: '16px',
              borderRadius: 14,
              textDecoration: 'none',
              fontSize: 18,
              fontWeight: 'bold'
            }}
          >
            📊 Ver Ranking
          </Link>

        </div>

      </div>

    </div>
  )
}