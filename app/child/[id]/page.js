'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function ChildProfilePage() {
  const params = useParams()
  const [child, setChild] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (params?.id) {
      fetchChild()
    }
  }, [params?.id])

  async function fetchChild() {
    setLoading(true)
    setErrorMsg('')

    const { data, error } = await supabase
      .from('children')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      setErrorMsg(error.message)
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

  if (errorMsg) {
    return (
      <div style={{ padding: '40px', fontFamily: 'Arial', color: '#000', background: '#fff', minHeight: '100vh' }}>
        <h1>Child Profile Error</h1>
        <p style={{ color: 'red' }}>{errorMsg}</p>
        <a href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>Back to Dashboard</a>
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
        <p><b>ชื่อเล่น:</b> {child.nickname || '-'}</p>
        <p><b>เพศ:</b> {child.gender}</p>
        <p><b>อายุ:</b> {child.age_display}</p>
        <p><b>ห้องเรียน:</b> {child.class_room}</p>
        <p><b>ส่วนสูง:</b> {child.height_cm || '-'}</p>
        <p><b>น้ำหนัก:</b> {child.weight_kg || '-'}</p>
        <p><b>ผู้ปกครอง:</b> {child.guardian_name || '-'}</p>
        <p>
          <b>เบอร์โทร:</b>{' '}
          {child.guardian_phone ? (
            <a
              href={`tel:${child.guardian_phone}`}
              style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 'bold' }}
            >
              {child.guardian_phone}
            </a>
          ) : '-'}
        </p>
        <p><b>สถานะ:</b> {child.status}</p>

        <div style={{ marginTop: '25px' }}>
          <a
            href={`/assess/${child.id}`}
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
            href={`/report/${child.id}`}
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