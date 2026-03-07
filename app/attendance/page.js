'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AttendancePage() {
  const [children, setChildren] = useState([])
  const [search, setSearch] = useState('')
  const [selectedClass, setSelectedClass] = useState('ทั้งหมด')
  const [attendance, setAttendance] = useState({})

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
      const nickname = (child.nickname || '').toLowerCase()
      const firstName = (child.first_name || '').toLowerCase()
      const code = (child.child_code || '').toLowerCase()
      const room = child.class_room || ''

      const matchSearch =
        !q ||
        nickname.includes(q) ||
        firstName.includes(q) ||
        code.includes(q)

      const matchClass =
        selectedClass === 'ทั้งหมด' || room === selectedClass

      return matchSearch && matchClass
    })
  }, [children, search, selectedClass])

  function setStatus(childId, status) {
    setAttendance((prev) => ({
      ...prev,
      [childId]: status,
    }))
  }

  function getDisplayName(child) {
    return child.nickname
      ? `น้อง${child.nickname}`
      : `น้อง${child.first_name || ''}`
  }

  function statusButtonStyle(active, bg, color) {
    return {
      padding: '10px 14px',
      borderRadius: '12px',
      border: active ? `2px solid ${color}` : '1px solid #d9e6f2',
      background: active ? bg : '#fff',
      color: color,
      fontWeight: 'bold',
      cursor: 'pointer',
      minWidth: '64px',
    }
  }

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
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #4da3ff 0%, #6ec5ff 100%)',
            color: '#fff',
            borderRadius: '20px',
            padding: '18px',
            boxShadow: '0 10px 30px rgba(77,163,255,0.18)',
            marginBottom: '16px',
          }}
        >
          <div style={{ fontSize: '12px', opacity: 0.95, marginBottom: '4px' }}>
            MODS-EDU Attendance
          </div>
          <h1 style={{ margin: 0, fontSize: '24px', lineHeight: 1.2 }}>
            Quick Attendance Mode
          </h1>
          <p style={{ margin: '6px 0 0 0', fontSize: '14px', opacity: 0.95 }}>
            โหมดเช็กชื่อแบบเร็วสำหรับครูประจำชั้น
          </p>
        </div>

        <div
          style={{
            background: '#ffffffee',
            border: '1px solid #e6eef5',
            borderRadius: '18px',
            padding: '14px',
            boxShadow: '0 8px 20px rgba(19,49,83,0.05)',
            marginBottom: '16px',
          }}
        >
          <input
            type="text"
            placeholder="ค้นหาชื่อเล่น ชื่อจริง หรือรหัสเด็ก"
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
              href="/"
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
              กลับหน้าแรก
            </a>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '12px' }}>
          {filteredChildren.map((child) => {
            const status = attendance[child.id] || ''

            return (
              <div
                key={child.id}
                style={{
                  background: '#fff',
                  border: '1px solid #e6eef5',
                  borderRadius: '18px',
                  padding: '14px',
                  boxShadow: '0 8px 20px rgba(19,49,83,0.05)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #ffe7b8 0%, #ffd3e1 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      <img
                        src={`/children/${child.child_code}.jpg`}
                        alt={getDisplayName(child)}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          if (e.currentTarget.nextSibling) {
                            e.currentTarget.nextSibling.style.display = 'flex'
                          }
                        }}
                      />
                      <span
                        style={{
                          display: 'none',
                          width: '100%',
                          height: '100%',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {(child.nickname || child.first_name || 'ด').slice(0, 1)}
                      </span>
                    </div>

                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        {getDisplayName(child)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#5b6b82' }}>
                        {child.child_code || '-'} · {child.class_room || '-'}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <button
                      onClick={() => setStatus(child.id, 'present')}
                      style={statusButtonStyle(status === 'present', '#dcfce7', '#166534')}
                    >
                      มา
                    </button>

                    <button
                      onClick={() => setStatus(child.id, 'late')}
                      style={statusButtonStyle(status === 'late', '#fef3c7', '#92400e')}
                    >
                      สาย
                    </button>

                    <button
                      onClick={() => setStatus(child.id, 'absent')}
                      style={statusButtonStyle(status === 'absent', '#fee2e2', '#991b1b')}
                    >
                      ขาด
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
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