'use client'

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function PredictionsPage() {

  const [matches, setMatches] = useState<any[]>([])
  const [username, setUsername] = useState('')
  const [predictions, setPredictions] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState<any>({})
  const [savedPredictions, setSavedPredictions] = useState<any>({})

  useEffect(() => {
    loadMatches()
    loadProfile()
    loadPredictions()
  }, [])

  const loadMatches = async () => {

    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('match_date', { ascending: true })

    if (error) {
      console.log(error.message)
      return
    }

    setMatches(data || [])
  }

  const loadProfile = async () => {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()

    if (error) {
      console.log(error.message)
      return
    }

    if (data) {
      setUsername(data.username)
    }
  }

  const loadPredictions = async () => {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      console.log(error.message)
      return
    }

    const formatted: any = {}

    data.forEach((p) => {
      formatted[p.match_id] = {
        home: p.home_score,
        away: p.away_score
      }
    })

    setPredictions(formatted)
    setSavedPredictions(formatted)
  }

  const savePrediction = async (matchId: string) => {

    setLoading(true)

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      alert('Debes iniciar sesión')
      setLoading(false)
      return
    }

    const prediction = predictions[matchId]

    const { error } = await supabase
      .from('predictions')
      .upsert(
        {
          user_id: user.id,
          match_id: matchId,
          home_score: Number(prediction.home),
          away_score: Number(prediction.away)
        },
        {
          onConflict: 'user_id,match_id'
        }
      )

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    alert('Pronóstico guardado ✅')

    setSavedPredictions({
      ...savedPredictions,
      [matchId]: prediction
    })

    setEditMode({
      ...editMode,
      [matchId]: false
    })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0f172a, #1e293b, #334155)',
        padding: 30
      }}
    >

      <div
        style={{
          maxWidth: 1000,
          margin: '0 auto'
        }}
      >

        {/* MENU */}

        <div
          style={{
            background: 'white',
            padding: 20,
            borderRadius: 20,
            marginBottom: 25,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 15
          }}
        >

          <div>

            <h1 style={{ color: '#0f172a' }}>
              ⚽ Mundial 2026
            </h1>

            <p
              style={{
                color: '#64748b',
                marginTop: 5
              }}
            >
              Bienvenido, {username} 👋
            </p>

          </div>

          <div
            style={{
              display: 'flex',
              gap: 15,
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >

            <Link
              href="/dashboard"
              style={{
                textDecoration: 'none',
                background: '#2563eb',
                color: 'white',
                padding: '10px 16px',
                borderRadius: 10,
                fontWeight: 'bold'
              }}
            >
              📅 Fixture
            </Link>

            <Link
              href="/predictions"
              style={{
                textDecoration: 'none',
                background: '#16a34a',
                color: 'white',
                padding: '10px 16px',
                borderRadius: 10,
                fontWeight: 'bold'
              }}
            >
              ⚽ Pronósticos
            </Link>

            <Link
              href="/ranking"
              style={{
                textDecoration: 'none',
                background: '#f59e0b',
                color: 'white',
                padding: '10px 16px',
                borderRadius: 10,
                fontWeight: 'bold'
              }}
            >
              🏆 Ranking
            </Link>

          </div>

        </div>

        {/* PARTIDOS */}

        {matches.map((match) => {

          const locked =
            new Date(match.match_date) < new Date()

          const hasPrediction =
            savedPredictions[match.id]?.home !== undefined

          const editable =
            editMode[match.id] || !hasPrediction

          return (

            <div
              key={match.id}
              style={{
                background: 'white',
                padding: 25,
                borderRadius: 20,
                marginBottom: 20,
                boxShadow:
                  '0 5px 15px rgba(0,0,0,0.15)'
              }}
            >

              <h2 style={{ marginBottom: 10 }}>
                {match.team_home} vs {match.team_away}
              </h2>

              <p style={{ color: '#64748b' }}>
                {
                  new Date(match.match_date)
                    .toLocaleString('es-PE')
                }
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  marginTop: 20,
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}
              >

                <input
                  type="number"
                  min={0}
                  value={
                    predictions[match.id]?.home ?? ''
                  }
                  disabled={locked || !editable}
                  placeholder="0"
                  style={{
                    width: 70,
                    padding: 10,
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    fontSize: 18,
                    textAlign: 'center'
                  }}
                  onChange={(e) =>
                    setPredictions({
                      ...predictions,
                      [match.id]: {
                        ...predictions[match.id],
                        home: e.target.value
                      }
                    })
                  }
                />

                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 'bold'
                  }}
                >
                  -
                </span>

                <input
                  type="number"
                  min={0}
                  value={
                    predictions[match.id]?.away ?? ''
                  }
                  disabled={locked || !editable}
                  placeholder="0"
                  style={{
                     width: 70,
                     padding: 10,
                     borderRadius: 10,
                     border: '1px solid #cbd5e1',
                     fontSize: 18,
                     textAlign: 'center',
                     color: '#000',
                     background: 'white',
                     fontWeight: 'bold',
                     WebkitTextFillColor: '#000',
                     opacity: 1
                  }}
                  onChange={(e) =>
                    setPredictions({
                      ...predictions,
                      [match.id]: {
                        ...predictions[match.id],
                        away: e.target.value
                      }
                    })
                  }
                />

                {!locked && !editable && (

                  <button
                    onClick={() =>
                      setEditMode({
                        ...editMode,
                        [match.id]: true
                      })
                    }
                    style={{
                      background: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      padding: '12px 18px',
                      borderRadius: 10,
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Modificar
                  </button>

                )}

                {!locked && editable && (

                  <button
                    onClick={() =>
                      savePrediction(match.id)
                    }
                    disabled={loading}
                    style={{
                      background: '#2563eb',
                      color: 'white',
                      border: 'none',
                      padding: '12px 18px',
                      borderRadius: 10,
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Guardar
                  </button>

                )}

                {locked && (

                  <button
                    disabled
                    style={{
                      background: '#94a3b8',
                      color: 'white',
                      border: 'none',
                      padding: '12px 18px',
                      borderRadius: 10,
                      fontWeight: 'bold'
                    }}
                  >
                    Cerrado
                  </button>

                )}

              </div>

            </div>
          )
        })}

      </div>

    </div>
  )
}