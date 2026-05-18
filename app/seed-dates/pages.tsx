'use client'

import { supabase } from '@/lib/supabase'

export default function SeedDates() {

  const addDates = async () => {

    const { data: matches } = await supabase
      .from('matches')
      .select('*')

    let baseDate = new Date("2026-06-11T13:00:00Z")

    for (let i = 0; i < (matches?.length || 0); i++) {

      baseDate.setHours(baseDate.getHours() + 4)

      await supabase
        .from('matches')
        .update({ match_date: baseDate.toISOString() })
        .eq('id', matches![i].id)
    }

    alert("Fechas asignadas 🚀")
  }

  return (
    <div>
      <button onClick={addDates}>
        Asignar fechas
      </button>
    </div>
  )
}