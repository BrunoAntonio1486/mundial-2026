'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LogoutButton() {

  const router = useRouter()

  const logout = async () => {

    await supabase.auth.signOut()

    router.push('/')
  }

  return (
    <button
      onClick={logout}
      style={{
        background: '#dc2626',
        color: 'white',
        border: 'none',
        padding: '10px 16px',
        borderRadius: 10,
        fontWeight: 'bold',
        cursor: 'pointer'
      }}
    >
      🚪 Cerrar sesión
    </button>
  )
}