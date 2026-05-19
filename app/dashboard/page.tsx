'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import LogoutButton from '../components/LogoutButton'

export default function DashboardPage() {

  const [matches, setMatches] = useState<any[]>([])
  const [username, setUsername] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    loadMatches()
    loadProfile()
  }, [])

  const loadMatches = async () => {

    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('match_date', {
        ascending: true
      })

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

    if (data.username === 'Bruno') {
      setIsAdmin(true)
    }
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

            {isAdmin && (

  <Link
    href="/admin/results"
    style={{
      textDecoration: 'none',
      background: '#dc2626',
      color: 'white',
      padding: '10px 16px',
      borderRadius: 10,
      fontWeight: 'bold'
    }}
  >
    🛠 Admin
  </Link>
  

)}

          </div>

        </div>

        {/* FIXTURE */}

        {matches.map((match) => (

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

            <h2
              style={{
                marginBottom: 10,
                color: '#0f172a'
              }}
            >
              {match.team_home}
              {' vs '}
              {match.team_away}
            </h2>

            <p
              style={{
                color: '#64748b',
                marginBottom: 15
              }}
            >
              {
                new Date(match.match_date)
                  .toLocaleString('es-PE')
              }
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}
            >

              <div
                style={{
    width: 60,
    height: 60,
    borderRadius: 15,
    background: 'white',
    border: '2px solid #cbd5e1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    opacity: 1
  }}
              >
                {
                  match.home_score !== null
                    ? match.home_score
                    : '-'
                }
              </div>

              <span
                style={{
                  fontSize: 24,
                  fontWeight: 'bold'
                }}
              >
                -
              </span>

              <div
                  style={{
    width: 60,
    height: 60,
    borderRadius: 15,
    background: 'white',
    border: '2px solid #cbd5e1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    opacity: 1
  }}
              >
                {
                  match.away_score !== null
                    ? match.away_score
                    : '-'
                }
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}