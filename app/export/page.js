'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function ExportPage() {
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
    <div
      style={{
        padding: '40px',
        fontFamily: 'Arial',
        color: '#000',
        background: '#fff',
        minHeight: '100vh',
      }}
    >
      <h1>Export Data</h1>
      <h2>ข้อมูลสำหรับส่งออก Excel</h2>

      <div style={{ marginTop: '25px', marginBottom: '20px' }}>
        <button
          style={{
            padding: '12px 20px',
            borderRadius: '8px',
            border: 'none',
            background: '#2563eb',
            color: '#fff',
            cursor: 'pointer',
            marginRight: '15px',
          }}
        >
          Export Excel
        </button>

        <a href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>
          Back to Dashboard
        </a>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #ddd',
          }}
        >
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={cellStyle}>Code</th>
              <th style={cellStyle}>First Name</th>
              <th style={cellStyle}>Last Name</th>
              <th style={cellStyle}>Gender</th>
              <th style={cellStyle}>Age</th>
              <th style={cellStyle}>Class</th>
              <th style={cellStyle}>Height</th>
              <th style={cellStyle}>Weight</th>
              <th style={cellStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {children.map((child) => (
              <tr key={child.id}>
                <td style={cellStyle}>{child.child_code}</td>
                <td style={cellStyle}>{child.first_name}</td>
                <td style={cellStyle}>{child.last_name}</td>
                <td style={cellStyle}>{child.gender}</td>
                <td style={cellStyle}>{child.age_display}</td>
                <td style={cellStyle}>{child.class_room}</td>
                <td style={cellStyle}>{child.height_cm}</td>
                <td style={cellStyle}>{child.weight_kg}</td>
                <td style={cellStyle}>{child.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const cellStyle = {
  border: '1px solid #ddd',
  padding: '10px',
  textAlign: 'left',
}