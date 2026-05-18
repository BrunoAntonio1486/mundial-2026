'use client'

import { supabase } from '@/lib/supabase'
import { matches } from '@/lib/fixture'

export default function Seed() {

  const create = async () => {

    // eliminar partidos anteriores
    await supabase
      .from('matches')
      .delete()
      .neq('id', '')

    // insertar fixture nuevo
    const { error } = await supabase
      .from('matches')
      .insert(matches)

    if (error) {
      alert(error.message)
    } else {
      alert('Fixture cargado correctamente 🚀')
    }
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
          width: 420,
          background: 'white',
          padding: 35,
          borderRadius: 20,
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          textAlign: 'center'
        }}
      >

        <div>

          <h1
            style={{
              fontSize: 34,
              color: '#0f172a',
              marginBottom: 10
            }}
          >
            ⚽ Seed Mundial 2026
          </h1>

          <p
            style={{
              color: '#64748b',
              fontSize: 15
            }}
          >
            Generar automáticamente el fixture oficial
          </p>

        </div>

        <button
          onClick={create}
          style={{
            background: '#2563eb',
            color: 'white',
            border: 'none',
            padding: 16,
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: '0.2s'
          }}
        >
          🚀 Generar partidos
        </button>

        <p
          style={{
            color: '#94a3b8',
            fontSize: 13
          }}
        >
          Sistema de Pronósticos Mundial 2026 🌎
        </p>

      </div>

    </div>
  )
}