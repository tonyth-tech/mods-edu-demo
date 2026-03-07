'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [children, setChildren] = useState([])
  const [centerName, setCenterName] = useState('MODS-EDU')
  const [search, setSearch] = useState('')
  const [selectedClass, setSelectedClass] = useState('ทั้งหมด')

  useEffect(() => {
    fetchChildren()
    fetchCenter()
  }, [])

  async function fetchChildren() {
    const { data } = await supabase
      .from('children')
      .select('*')
      .order('first_name', { ascending: true })

    setChildren(data || [])
  }

  async function fetchCenter() {
    const { data } = await supabase
      .from('centers')
      .select('name')
      .limit(1)

    if (data && data.length > 0 && data[0].name) {
      setCenterName(`MODS-EDU-${data[0].name}`)
    } else {
      setCenterName('MODS-EDU-ศพด. 02')
    }
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

  return (
    <div className="mods-page">
      <div className="mods-container">

        <div className="mods-header">
          <div className="mods-header-text">
            <div className="mods-header-label">
              {centerName}
            </div>
            <h1 className="mods-title">Teacher Dashboard</h1>
            <p className="mods-subtitle">
              แสดงชื่อเล่นเด็กแบบ PDPA-friendly และค้นหาได้จากชื่อเล่น ชื่อจริง หรือรหัสเด็ก
            </p>
          </div>

          <div className="mods-logo-wrap">
            <img
              src="/maungjee-logo.png"
              alt="Municipality Logo"
              className="mods-logo"
            />
          </div>
        </div>

        <div className="mods-stats">
          <MiniStat title="เด็กทั้งหมด" value={children.length} bg="#e0f2fe" />
          <MiniStat title="กำลังแสดง" value={filteredChildren.length} bg="#dcfce7" />
          <MiniStat title="ห้องเรียน" value={classOptions.length - 1} bg="#fef3c7" />
        </div>

        <div className="mods-tools">
          <input
            type="text"
            placeholder="ค้นหาด้วยชื่อเล่น ชื่อจริง หรือ Student ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mods-search"
          />

          <div className="mods-filter-row">
            {classOptions.map((room) => (
              <button
                key={room}
                onClick={() => setSelectedClass(room)}
                className={`mods-chip ${selectedClass === room ? 'mods-chip-active' : ''}`}
              >
                {room}
              </button>
            ))}

            <a href="/export" className="mods-chip mods-chip-link">
              Export Excel
            </a>

            <a href="/attendance" className="mods-chip mods-chip-link">
              เช็กชื่อ
            </a>
          </div>
        </div>

        <div className="mods-grid">
          {filteredChildren.map((child) => {
            const displayName =
              child.nickname
                ? `น้อง${child.nickname}`
                : `น้อง${child.first_name || ''}`

            return (
              <a
                key={child.id}
                href={`/child/${child.id}`}
                className="mods-card"
              >
                <div className="mods-avatar">
                  <img
                    src={`/children/${child.child_code}.jpg`}
                    alt={displayName}
                    className="mods-avatar-img"
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
                      justifyContent: 'center'
                    }}
                  >
                    {(child.nickname || child.first_name || 'ด').slice(0, 1)}
                  </span>
                </div>

                <div className="mods-card-name">
                  {displayName}
                </div>

                <div className="mods-card-code">
                  {child.child_code || '-'}
                </div>

                <div className="mods-card-room">
                  {child.class_room || '-'}
                </div>
              </a>
            )
          })}
        </div>

        {filteredChildren.length === 0 && (
          <div className="mods-empty">
            ไม่พบข้อมูลเด็ก
          </div>
        )}
      </div>
    </div>
  )
}

function MiniStat({ title, value, bg }) {
  return (
    <div className="mods-stat" style={{ background: bg }}>
      <div className="mods-stat-title">{title}</div>
      <div className="mods-stat-value">{value}</div>
    </div>
  )
}