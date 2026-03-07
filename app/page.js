'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [children, setChildren] = useState([])
  const [search, setSearch] = useState('')
  const [selectedClass, setSelectedClass] = useState('ทั้งหมด')

  useEffect(() => {
    fetchChildren()
  }, [])

  async function fetchChildren() {
    const { data } = await supabase
      .from('children')
      .select('*')
      .order('first_name', { ascending: true })

    setChildren(data || [])
  }

  const classOptions = useMemo(() => {
    const rooms = [...new Set(children.map((c) => c.class_room).filter(Boolean))]
    return ['ทั้งหมด', ...rooms]
  }, [children])

  const filteredChildren = useMemo(() => {
    const q = search.trim().toLowerCase()

    return children.filter((child) => {
      const fullName = `${child.first_name || ''} ${child.last_name || ''}`.toLowerCase()
      const code = (child.child_code || '').toLowerCase()
      const room = child.class_room || ''

      const matchSearch = !q || fullName.includes(q) || code.includes(q)
      const matchClass = selectedClass === 'ทั้งหมด' || room === selectedClass

      return matchSearch && matchClass
    })
  }, [children, search, selectedClass])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f2f9ff 0%, #ffffff 100%)',
        fontFamily: 'Arial, sans-serif',
        color: '#183153',
        padding: '16px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #4da3ff 0%, #6ec5ff 100%)',
            color: '#fff',
            borderRadius: '20px',
            padding: '18px',
            boxShadow: '0 10px 30px rgba(77,163,255,0.18)',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '12px', opacity: 0.95, marginBottom: '4px' }}>
              MODS-EDU-ศพด.02
            </div>
            <h1 style={{ margin: 0, fontSize: '24px', lineHeight: 1.2 }}>
              Teacher Dashboard
            </h1>
            <p style={{ margin: '6px 0 0 0', fontSize: '14px', opacity: 0.95 }}>
              เลือกเด็กจากรูป ค้นหาด้วยชื่อหรือรหัส
            </p>
          </div>

          <div
            style={{
              flexShrink: 0,
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
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

        {/* Summary */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '10px',
            marginBottom: '14px',
          }}
        >
          <MiniStat title="เด็กทั้งหมด" value={children.length} bg="#e0f2fe" />
          <MiniStat title="กำลังแสดง" value={filteredChildren.length} bg="#dcfce7" />
          <MiniStat title="ห้องเรียน" value={classOptions.length - 1} bg="#fef3c7" />
        </div>

        {/* Sticky tools */}
        <div
          style={{
            position: 'sticky',
            top: '8px',
            zIndex: 10,
            background: '#ffffffee',
            backdropFilter: 'blur(8px)',
            border: '1px solid #e6eef5',
            borderRadius: '18px',
            padding: '14px',
            boxShadow: '0 8px 20px rgba(19,49,83,0.05)',
            marginBottom: '16px',
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
              marginBottom: '12px',
            }}
          />

          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '4px',
            }}
          >
            {classOptions.map((room) => (
              <button
                key={room}
                onClick={() => setSelectedClass(room)}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '10px 14px',
                  borderRadius: '999px',
                  border: selectedClass === room ? '1px solid #3b82f6' : '1px solid #d9e6f2',
                  background: selectedClass === room ? '#dbeafe' : '#fff',
                  color: '#183153',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                {room}
              </button>
            ))}

            <a
              href="/export"
              style={{
                whiteSpace: 'nowrap',
                padding: '10px 14px',
                borderRadius: '999px',
                border: '1px solid #d9e6f2',
                background: '#fff',
                color: '#183153',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              Export Excel
            </a>
          </div>
        </div>

        {/* Children grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '12px',
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
                padding: '12px 8px',
                boxShadow: '0 8px 20px rgba(19,49,83,0.05)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '70px',
                  height: '70px',
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
                  fontSize: '13px',
                  fontWeight: 'bold',
                  lineHeight: 1.25,
                  minHeight: '34px',
                }}
              >
                {child.first_name} {child.last_name}
              </div>

              <div
                style={{
                  fontSize: '11px',
                  color: '#5b6b82',
                  marginTop: '5px',
                }}
              >
                {child.child_code || '-'}
              </div>

              <div
                style={{
                  fontSize: '11px',
                  color: '#5b6b82',
                  marginTop: '3px',
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

function MiniStat({ title, value, bg }) {
  return (
    <div
      style={{
        background: bg,
        borderRadius: '16px',
        padding: '14px',
        boxShadow: '0 6px 16px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ fontSize: '12px', color: '#4a6078', marginBottom: '6px' }}>{title}</div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#183153' }}>{value}</div>
    </div>
  )
}