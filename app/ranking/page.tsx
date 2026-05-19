'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import LogoutButton from '../components/LogoutButton'

type RankingUser = {
  id: string
  username: string
  points: number
}

type Prediction = {
  username: string | null
  points: number | null
}

export default function RankingPage() {

  const [ranking, setRanking] =
    useState<RankingUser[]>([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    fetchRanking()
  }, [])

  const fetchRanking = async () => {

    const { data, error } = await supabase
      .from('predictions')
      .select('username, points')

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    const totals: Record<string, number> = {}

    data?.forEach((prediction: Prediction) => {

      const username = prediction.username

      if (!username) return

      if (!totals[username]) {
        totals[username] = 0
      }

      totals[username] +=
        Number(prediction.points || 0)
    })

    const rankingArray: RankingUser[] =
      Object.entries(totals)
        .map(([username, points]) => ({
          id: username,
          username,
          points
        }))
        .sort((a, b) => b.points - a.points)

    setRanking(rankingArray)
    setLoading(false)
  }

  if (loading) {

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background:
            'linear-gradient(135deg, #0f172a, #1e293b, #334155)',
          color: 'white',
          fontSize: 22,
          fontWeight: 'bold'
        }}
      >
        Cargando ranking...
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

        {/* MENU */}

        <div
          style={{
            background: 'white',
            padding: 20,
            borderRadius: 20,
            marginBottom: 30,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 15
          }}
        >

          <div>

            <h1
              style={{
                color: '#0f172a',
                fontSize: 36,
                marginBottom: 8
              }}
            >
              🏆 Tabla de Posiciones
            </h1>

            <p
              style={{
                color: '#64748b',
                fontSize: 16
              }}
            >
              Ranking oficial del Mundial 2026
            </p>

          </div>

          <div
            style={{
              display: 'flex',
              gap: 15,
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

        {/* TABLA */}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18
          }}
        >

          {
            ranking.map((user, index) => {

              const isTop1 = index === 0
              const isTop2 = index === 1
              const isTop3 = index === 2

              return (

                <div
                  key={user.id}
                  style={{
                    background: 'white',
                    borderRadius: 20,
                    padding: 24,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow:
                      '0 10px 25px rgba(0,0,0,0.2)',
                    border:
                      isTop1
                        ? '3px solid gold'
                        : isTop2
                        ? '3px solid silver'
                        : isTop3
                        ? '3px solid #cd7f32'
                        : 'none'
                  }}
                >

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 18
                    }}
                  >

                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: '#2563eb',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        fontSize: 22
                      }}
                    >
                      {index + 1}
                    </div>

                    <div>

                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 'bold',
                          color: '#0f172a'
                        }}
                      >
                        {user.username}
                      </div>

                      <div
                        style={{
                          color: '#64748b',
                          marginTop: 4
                        }}
                      >
                        Participante
                      </div>

                    </div>

                  </div>

                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 'bold',
                      color: '#16a34a'
                    }}
                  >
                    {user.points}

                    <span
                      style={{
                        fontSize: 18,
                        marginLeft: 6
                      }}
                    >
                      pts
                    </span>

                  </div>

                </div>
              )
            })
          }

        </div>

      </div>

    </div>
  )
}