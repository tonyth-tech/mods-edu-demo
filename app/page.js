'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [children, setChildren] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchChildren()
  }, [])

  async function fetchChildren() {
    const { data } = await supabase.from('children').select('*')
    setChildren(data || [])
  }

  const filteredChildren = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return children

    return children.filter((child) => {
      const fullName = `${child.first_name || ''} ${child.last_name || ''}`.toLowerCase()
      const code = (child.child_code || '').toLowerCase()
      return fullName.includes(q) || code.includes(q)
    })
  }, [children, search])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f5fbff 0%, #ffffff 100%)',
        fontFamily: 'Arial, sans-serif',
        color: '#183153',
        padding: '20px',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #4da3ff 0%, #6ec5ff 100%)',
            color: '#fff',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 10px 30px rgba(77,163,255,0.18)',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ fontSize: '13px', opacity: 0.95, marginBottom: '6px' }}>
              MODS-EDU
            </div>
            <h1 style={{ margin: 0, fontSize: '28px', lineHeight: 1.2 }}>
              Teacher Dashboard
            </h1>
            <p style={{ marginTop: '8px', marginBottom: 0, fontSize: '15px', opacity: 0.95 }}>
              ระบบดูแลเด็กปฐมวัยสำหรับครูและกองการศึกษา
            </p>
          </div>

          <div
            style={{
              flexShrink: 0,
              width: '88px',
              height: '88px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
            }}
          >
            <img
              src="/maungjee-logo.png"
              alt="Municipality Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: '50%',
                background: '#fff',
              }}
            />
          </div>
        </div>

        {/* Top actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '18px',
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: '22px' }}>รายชื่อเด็ก</h2>
            <p style={{ margin: '6px 0 0 0', color: '#5b6b82', fontSize: '14px' }}>
              ค้นหาด้วยชื่อหรือรหัสเด็ก แล้วแตะรูปเพื่อเปิดข้อมูล
            </p>
          </div>

          <a
            href="/export"
            style={{
              display: 'inline-block',
              padding: '10px 16px',
              borderRadius: '12px',
              textDecoration: 'none',
              color: '#183153',
              background: '#ffffff',
              border: '1px solid #d9e6f2',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              fontWeight: 'bold',
            }}
          >
            Export Excel
          </a>
        </div>

        {/* Search */}
        <div
          style={{
            marginBottom: '20px',
            background: '#fff',
            border: '1px solid #e6eef5',
            borderRadius: '16px',
            padding: '14px',
            boxShadow: '0 8px 20px rgba(19,49,83,0.05)',
          }}
        >
          <input
            type="text"
            placeholder="ค้นหาชื่อเด็ก หรือ Student ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1px solid #d9e6f2',
              fontSize: '16px',
              color: '#183153',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Small photo cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '14px',
          }}
        >
          {filteredChildren.map((child) => (
            <a
              key={child.id}
              href={`/child/${child.id}`}
              style={{
                textDecoration: 'none',
                color: '#183153',
                background: '#fff',
                border: '1px solid #e6eef5',
                borderRadius: '18px',
                padding: '14px 10px',
                boxShadow: '0 8px 20px rgba(19,49,83,0.05)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  margin: '0 auto 10px auto',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #ffe7b8 0%, #ffd3e1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                }}
              >
                {child.photo_url ? (
                  <img
                    src={child.photo_url}
                    alt={`${child.first_name} ${child.last_name}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span>{(child.first_name || 'ด').slice(0, 1)}</span>
                )}
              </div>

              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  lineHeight: 1.3,
                  minHeight: '36px',
                }}
              >
                {child.first_name} {child.last_name}
              </div>

              <div
                style={{
                  fontSize: '12px',
                  color: '#5b6b82',
                  marginTop: '6px',
                }}
              >
                {child.child_code || '-'}
              </div>

              <div
                style={{
                  fontSize: '12px',
                  color: '#5b6b82',
                  marginTop: '4px',
                }}
              >
                {child.class_room || '-'}
              </div>
            </a>
          ))}
        </div>

        {filteredChildren.length === 0 && (
          <div
            style={{
              marginTop: '20px',
              background: '#fff',
              border: '1px solid #e6eef5',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              color: '#5b6b82',
            }}
          >
            ไม่พบข้อมูลเด็ก
          </div>
        )}
      </div>
    </div>
  )
}