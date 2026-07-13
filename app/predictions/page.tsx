'use client'

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import LogoutButton from '../components/LogoutButton'

const isMatchLocked = (matchDate: string) => {

  const now = new Date()

  const date = new Date(matchDate)

  const day = date.getDate()
  const month = date.getMonth()

  let lockDate

  // FASE 1
  if (month === 5 && day >= 11 && day <= 17) {

    lockDate = new Date(
      2026,
      5,
      11,
      12,
      0,
      0
    )
  }

  // FASE 2
  else if (month === 5 && day >= 18 && day <= 23) {

    lockDate = new Date(
      2026,
      5,
      18,
      10,
      0,
      0
    )
  }

  // FASE 3
  else if (month === 5 && day >= 24 && day <= 27) {

    lockDate = new Date(
      2026,
      5,
      24,
      12,
      0,
      0
    )
  }

  else {

    return false
  }

  return now >= lockDate
}

export default function PredictionsPage() {

  const [matches, setMatches] = useState<any[]>([])
  const [username, setUsername] = useState('')
  const [predictions, setPredictions] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState<any>({})
  const [savedPredictions, setSavedPredictions] = useState<any>({})
  const [showGroups, setShowGroups] = useState(false)
  const [showRound32, setShowRound32] = useState(false)
  const [showRound16, setShowRound16] = useState(false)
  const [showQuarterFinal, setShowQuarterFinal] = useState(false)

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

            <LogoutButton />

          </div>

        </div>

        {/* PARTIDOS */}

        {/* BOTÓN FASE DE GRUPOS */}

        <div
          onClick={() => setShowGroups(!showGroups)}
          style={{
            background: '#1e293b',
            color: 'white',
            padding: '15px 20px',
            borderRadius: 12,
            marginBottom: 20,
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: 18,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>
            ⚽ FASE DE GRUPOS (
            {matches.filter(m => m.stage === 'GROUP').length}
            {' '}partidos)
          </span>

          <span>{showGroups ? '▼' : '▶'}</span>
        </div>

        {/* BOTÓN DIECISEISAVOS */}

        <div
          onClick={() => setShowRound32(!showRound32)}
          style={{
            background: '#1e293b',
            color: 'white',
            padding: '15px 20px',
            borderRadius: 12,
            marginBottom: 20,
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: 18,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>
            🏆 DIECISEISAVOS DE FINAL (
            {matches.filter(m => m.stage === 'ROUND_OF_32').length}
            {' '}partidos)
          </span>

          <span>{showRound32 ? '▼' : '▶'}</span>
        </div>

        {/* BOTÓN OCTAVOS */}

        <div
          onClick={() => setShowRound16(!showRound16)}
          style={{
            background: '#1e293b',
            color: 'white',
            padding: '15px 20px',
            borderRadius: 12,
            marginBottom: 20,
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: 18,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>
            🏆 OCTAVOS DE FINAL (
            {matches.filter(m => m.stage === 'ROUND_OF_16').length}
            {' '}partidos)
          </span>

          <span>{showRound16 ? '▼' : '▶'}</span>
        </div>

        {/* BOTÓN CUARTOS */}

        <div
          onClick={() => setShowQuarterFinal(!showQuarterFinal)}
          style={{
            background: '#1e293b',
            color: 'white',
            padding: '15px 20px',
            borderRadius: 12,
            marginBottom: 20,
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: 18,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>
            🏆 CUARTOS DE FINAL (
            {matches.filter(m => m.stage === 'QUARTER_FINAL').length}
            {' '}partidos)
          </span>

          <span>{showQuarterFinal ? '▼' : '▶'}</span>
        </div>

        {matches
          .filter((match) => {
            if (match.stage === 'GROUP') {
              return showGroups
            }

            if (match.stage === 'ROUND_OF_32') {
              return showRound32
            }

            if (match.stage === 'ROUND_OF_16') {
              return showRound16
            }

            if (match.stage === 'QUARTER_FINAL') {
              return showQuarterFinal
            }

            return true
          })
          .map((match) => {

            const locked = new Date(match.match_date) <= new Date()

            console.log({
              partido: `${match.team_home} vs ${match.team_away}`,
              locked,
              isMatchLocked: isMatchLocked(match.match_date),
              ahora: new Date(),
              partidoFecha: new Date(match.match_date),
            })

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
                <p
                  style={{
                    color: '#2563eb',
                    fontWeight: 'bold',
                    marginBottom: 8,
                    fontSize: 14,
                    textTransform: 'uppercase'
                  }}
                >
                  {match.stage === 'GROUP' && '⚽ FASE DE GRUPOS'}
                  {match.stage === 'ROUND_OF_32' && '🏆 DIECISEISAVOS DE FINAL'}
                  {match.stage === 'ROUND_OF_16' && '🏆 OCTAVOS DE FINAL'}
                  {match.stage === 'QUARTER_FINAL' && '🏆 CUARTOS DE FINAL'}
                  {match.stage === 'SEMI_FINAL' && '🏆 SEMIFINALES'}
                  {match.stage === 'THIRD_PLACE' && '🥉 PARTIDO POR EL TERCER PUESTO'}
                  {match.stage === 'FINAL' && '🏆 FINAL'}
                </p>

                <h2
                  style={{
                    marginBottom: 10,
                    color: '#000',
                    fontWeight: 'bold'
                  }}
                >
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
                      disabled={
                        isMatchLocked(match.match_date)
                      }
                      style={{
                        background:
                          isMatchLocked(match.match_date)
                            ? '#64748b'
                            : '#f59e0b',
                        color: 'white',
                        border: 'none',
                        padding: '12px 18px',
                        borderRadius: 10,
                        fontWeight: 'bold',
                        cursor:
                          isMatchLocked(match.match_date)
                            ? 'not-allowed'
                            : 'pointer',
                        opacity:
                          isMatchLocked(match.match_date)
                            ? 0.7
                            : 1
                      }}
                    >
                      {
                        isMatchLocked(match.match_date)
                          ? 'Predicción cerrada'
                          : 'Modificar'
                      }
                    </button>

                  )}

                  {!locked && editable && (

                    <button
                      onClick={() =>
                        savePrediction(match.id)
                      }
                      disabled={
                        loading ||
                        isMatchLocked(match.match_date)
                      }
                      style={{
                        background:
                          isMatchLocked(match.match_date)
                            ? '#64748b'
                            : '#2563eb',
                        color: 'white',
                        border: 'none',
                        padding: '12px 18px',
                        borderRadius: 10,
                        fontWeight: 'bold',
                        cursor:
                          isMatchLocked(match.match_date)
                            ? 'not-allowed'
                            : 'pointer',
                        opacity:
                          isMatchLocked(match.match_date)
                            ? 0.7
                            : 1
                      }}
                    >
                      {
                        isMatchLocked(match.match_date)
                          ? 'Predicción cerrada'
                          : 'Guardar'
                      }
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