'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [children, setChildren] = useState([])

  useEffect(() => {
    fetchChildren()
  }, [])

  async function fetchChildren() {
    const { data } = await supabase
      .from('children')
      .select('*')

    setChildren(data || [])
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', color: '#000', background: '#fff', minHeight: '100vh' }}>
      <h1>MODS-EDU</h1>
      <h2>Teacher Dashboard</h2>

      <div style={{ marginTop: '30px' }}>
        {children.map((child) => (
          <div
            key={child.id}
            style={{
              border: '1px solid #ddd',
              padding: '20px',
              marginBottom: '15px',
              borderRadius: '10px',
              background: '#fafafa'
            }}
          >
            <h3>{child.first_name} {child.last_name}</h3>
            <p>Age: {child.age_display}</p>
            <p>Class: {child.class_room}</p>

            <div style={{ marginTop: '10px' }}>
              <a
                href={`/child/${child.id}`}
                style={{
                  display: 'inline-block',
                  marginRight: '10px',
                  padding: '8px 14px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  color: '#000',
                  background: '#fff'
                }}
              >
                View Profile
              </a>

              <a
                href={`/assess/${child.id}`}
                style={{
                  display: 'inline-block',
                  marginRight: '10px',
                  padding: '8px 14px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  color: '#000',
                  background: '#fff'
                }}
              >
                Assess Development
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}