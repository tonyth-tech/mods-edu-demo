'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function ChildProfilePage({ params }) {
  const [child, setChild] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChild()
  }, [])

  async function fetchChild() {
    const { data, error } = await supabase
      .from('children')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.log(error)
    } else {
      setChild(data)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', fontFamily: 'Arial', color: '#000', background: '#fff', minHeight: '100vh' }}>
        <h1>Loading child profile...</h1>
      </div>
    )
  }

  if (!child) {
    return (
      <div style={{ padding: '40px', fontFamily: 'Arial', color: '#000', background: '#fff', minHeight: '100vh' }}>
        <h1>Child not found</h1>
        <a href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>Back to Dashboard</a>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', color: '#000', background: '#fff', minHeight: '100vh' }}>
      <h1>Child Profile</h1>
      <h2>ข้อมูลเด็กแต่ละคน</h2>

      <div
        style={{
          marginTop: '30px',
          maxWidth: '800px',
          border: '1px solid #ddd',
          borderRadius: '12px',
          padding: '25px',
          background: '#fafafa'
        }}
      >
        <h3>{child.first_name} {child.last_name}</h3>

        <p><b>รหัสเด็ก:</b> {child.child_code}</p>
        <p><b>เพศ:</b> {child.gender}</p>
        <p><b>อายุ:</b> {child.age_display}</p>
        <p><b>ห้องเรียน:</b> {child.class_room}</p>
        <p><b>ส่วนสูง:</b> {child.height_cm || '-'} ซม.</p>
        <p><b>น้ำหนัก:</b> {child.weight_kg || '-'} กก.</p>
        <p><b>ผู้ปกครอง:</b> {child.guardian_name || '-'}</p>
        <p><b>เบอร์โทร:</b> {child.guardian_phone || '-'}</p>
        <p><b>สถานะ:</b> {child.status}</p>

        <div style={{ marginTop: '25px' }}>
          <a
            href="/assess"
            style={{
              display: 'inline-block',
              marginRight: '10px',
              padding: '10px 16px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#000',
              background: '#fff'
            }}
          >
            Assess Development
          </a>

          <a
            href="/report"
            style={{
              display: 'inline-block',
              marginRight: '10px',
              padding: '10px 16px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#000',
              background: '#fff'
            }}
          >
            View Report Book
          </a>

          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '10px 16px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#000',
              background: '#fff'
            }}
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}