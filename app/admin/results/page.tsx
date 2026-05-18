'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Match = {
  id: string
  team_home: string
  team_away: string
  home_score: number | null
  away_score: number | null
  match_date: string
}

export default function AdminResults() {

  const router = useRouter()

  const [matches, setMatches] =
    useState<Match[]>([])

  const [loading, setLoading] =
    useState(true)

  const [authorized, setAuthorized] =
    useState(false)

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } =
      await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

    if (error || !data?.is_admin) {

      alert('No autorizado')

      router.push('/predictions')

      return
    }

    setAuthorized(true)

    fetchMatches()
  }

  const fetchMatches = async () => {

    const { data, error } =
      await supabase
        .from('matches')
        .select('*')
        .order('match_date', {
          ascending: true
        })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    setMatches(data || [])
    setLoading(false)
  }

  const handleScoreChange = (
    index: number,
    field: 'home_score' | 'away_score',
    value: string
  ) => {

    const updatedMatches = [...matches]

    updatedMatches[index][field] =
      value === ''
        ? null
        : parseInt(value)

    setMatches(updatedMatches)
  }

const saveResult = async (
  match: Match
) => {

  // guardar resultado real
  const { error } =
    await supabase
      .from('matches')
      .update({
        home_score: match.home_score,
        away_score: match.away_score
      })
      .eq('id', match.id)

  if (error) {
    alert(error.message)
    return
  }

  // recalcular predicciones
  const { error: rpcError } =
    await supabase.rpc(
      'recalculate_match_predictions',
      {
        p_match_id: match.id
      }
    )

  if (rpcError) {
    alert(rpcError.message)
    return
  }

  alert('Resultado guardado ✅')
}

  if (loading || !authorized) {

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 20
        }}
      >
        Cargando...
      </div>
    )
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
          maxWidth: 800,
          margin: '0 auto'
        }}
      >

        <h1
          style={{
            color: 'white',
            marginBottom: 30,
            fontSize: 36
          }}
        >
          ⚽ Registrar Resultados
        </h1>

        {
          matches.map((match, index) => (

            <div
              key={match.id}
              style={{
                background: 'white',
                borderRadius: 20,
                padding: 25,
                marginBottom: 20,
                boxShadow:
                  '0 10px 25px rgba(0,0,0,0.2)'
              }}
            >

              <h2
                style={{
                  marginBottom: 20,
                  color: '#0f172a'
                }}
              >
                {match.team_home}
                {' vs '}
                {match.team_away}
              </h2>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 20
                }}
              >

                <input
                  type="number"
                  min="0"
                  value={match.home_score ?? ''}
                  onChange={(e) =>
                    handleScoreChange(
                      index,
                      'home_score',
                      e.target.value
                    )
                  }
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
                />

                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 'bold'
                  }}
                >
                  -
                </span>

                <input
                  type="number"
                  min="0"
                  value={match.away_score ?? ''}
                  onChange={(e) =>
                    handleScoreChange(
                      index,
                      'away_score',
                      e.target.value
                    )
                  }
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
                />

              </div>

              <button
                onClick={() =>
                  saveResult(match)
                }
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '14px 20px',
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Guardar Resultado
              </button>

            </div>
          ))
        }

      </div>

    </div>
  )
}