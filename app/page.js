'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [children, setChildren] = useState([])

  useEffect(() => {
    fetchChildren()
  }, [])

  async function fetchChildren() {
    const { data, error } = await supabase
      .from('children')
      .select('*')

    if (error) {
      console.log('Supabase error:', error)
    } else {
      setChildren(data || [])
    }
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>MODS-EDU Demo</h1>
      <h2>Child Registry</h2>

      {children.length === 0 && <p>Loading children...</p>}

      {children.map((child) => (
        <div
          key={child.id}
          style={{
            border: '1px solid #ddd',
            padding: '15px',
            marginBottom: '10px',
            borderRadius: '8px',
          }}
        >
          <b>
            {child.first_name} {child.last_name}
          </b>
          <p>Age: {child.age_display}</p>
          <p>Class: {child.class_room}</p>
        </div>
      ))}
    </div>
  )
}