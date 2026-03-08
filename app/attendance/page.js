'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AttendancePage() {
  const [children, setChildren] = useState([])
  const [search, setSearch] = useState('')
  const [selectedClass, setSelectedClass] = useState('ทั้งหมด')
  const [attendance, setAttendance] = useState({})
  const [centerDisplayName, setCenterDisplayName] = useState('ศูนย์พัฒนาเด็กเล็กตำบลเหมืองจี้')

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
      .select('name, municipality_name')
      .limit(1)

    if (data && data.length > 0) {
      const center = data[0]
      if (center.name && center.name.trim() !== '') {
        setCenterDisplayName(center.name.replace('เทศบาล', ''))
      } else if (center.municipality_name && center.municipality_name.trim() !== '') {
        setCenterDisplayName(`ศูนย์พัฒนาเด็กเล็ก${center.municipality_name.replace('เทศบาล', '')}`)
      }
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

  function getDisplayName(child) {
    return child.nickname
      ? `น้อง${child.nickname}`
      : `น้อง${child.first_name || ''}`
  }

  function setStatus(childId, status) {
    setAttendance((prev) => ({
      ...prev,
      [childId]: status,
    }))
  }

  const summary = useMemo(() => {
    const values = Object.values(attendance)
    return {
      present: values.filter((v) => v === 'present').length,
      late: values.filter((v) => v === 'late').length,
      absent: values.filter((v) => v === 'absent').length,
    }
  }, [attendance])

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <div style={headerLabelStyle}>MODS-EDU-DSPM</div>
            <h1 style={headerTitleStyle}>เช็กชื่อประจำวัน</h1>
            <p style={headerSubtitleStyle}>{centerDisplayName}</p>
          </div>

          <a href="/" style={backButtonStyle}>
            กลับหน้าแรก
          </a>
        </div>

        <div style={summaryGridStyle}>
          <SummaryCard title="เด็กทั้งหมด" value={filteredChildren.length} bg="#e0f2fe" />
          <SummaryCard title="มา" value={summary.present} bg="#dcfce7" />
          <SummaryCard title="สาย" value={summary.late} bg="#fef3c7" />
          <SummaryCard title="ขาด" value={summary.absent} bg="#fee2e2" />
        </div>

        <div style={toolboxStyle}>
          <input
            type="text"
            placeholder="ค้นหาชื่อเล่น ชื่อจริง หรือรหัสเด็ก"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchStyle}
          />

          <div style={chipRowStyle}>
            {classOptions.map((room) => (
              <button
                key={room}
                onClick={() => setSelectedClass(room)}
                style={{
                  ...chipStyle,
                  ...(selectedClass === room ? chipActiveStyle : {}),
                }}
              >
                {room}
              </button>
            ))}
          </div>
        </div>

        <div style={listWrapStyle}>
          {filteredChildren.map((child) => {
            const status = attendance[child.id] || ''

            return (
              <div key={child.id} style={studentRowStyle}>
                <div style={studentInfoStyle}>
                  <div style={avatarStyle}>
                    <img
                      src={child.photo_url || `/children/${child.child_code}.jpg`}
                      alt={getDisplayName(child)}
                      style={avatarImgStyle}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        if (e.currentTarget.nextSibling) {
                          e.currentTarget.nextSibling.style.display = 'flex'
                        }
                      }}
                    />
                    <span style={avatarFallbackStyle}>
                      {(child.nickname || child.first_name || 'ด').slice(0, 1)}
                    </span>
                  </div>

                  <div>
                    <div style={studentNameStyle}>{getDisplayName(child)}</div>
                    <div style={studentMetaStyle}>
                      {child.child_code || '-'} · {child.class_room || '-'}
                    </div>
                  </div>
                </div>

                <div style={actionGroupStyle}>
                  <button
                    onClick={() => setStatus(child.id, 'present')}
                    style={{
                      ...statusBtnStyle,
                      ...(status === 'present' ? presentActiveStyle : {}),
                    }}
                  >
                    มา
                  </button>

                  <button
                    onClick={() => setStatus(child.id, 'late')}
                    style={{
                      ...statusBtnStyle,
                      ...(status === 'late' ? lateActiveStyle : {}),
                    }}
                  >
                    สาย
                  </button>

                  <button
                    onClick={() => setStatus(child.id, 'absent')}
                    style={{
                      ...statusBtnStyle,
                      ...(status === 'absent' ? absentActiveStyle : {}),
                    }}
                  >
                    ขาด
                  </button>
                </div>
              </div>
            )
          })}

          {filteredChildren.length === 0 && (
            <div style={emptyStyle}>ไม่พบข้อมูลเด็ก</div>
          )}
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ title, value, bg }) {
  return (
    <div style={{ ...summaryCardStyle, background: bg }}>
      <div style={summaryTitleStyle}>{title}</div>
      <div style={summaryValueStyle}>{value}</div>
    </div>
  )
}

const pageStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #f2f9ff 0%, #ffffff 100%)',
  color: '#183153',
  padding: '16px',
}

const containerStyle = {
  maxWidth: '960px',
  margin: '0 auto',
}

const headerStyle = {
  background: 'linear-gradient(135deg, #4da3ff 0%, #6ec5ff 100%)',
  color: '#fff',
  borderRadius: '20px',
  padding: '18px',
  boxShadow: '0 10px 24px rgba(77,163,255,0.16)',
  marginBottom: '14px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
}

const headerLabelStyle = {
  fontSize: '12px',
  opacity: 0.95,
  marginBottom: '4px',
  fontWeight: '500',
}

const headerTitleStyle = {
  margin: 0,
  fontSize: '24px',
  lineHeight: 1.2,
  fontWeight: '600',
}

const headerSubtitleStyle = {
  margin: '4px 0 0 0',
  fontSize: '14px',
  opacity: 0.95,
  fontWeight: '400',
}

const backButtonStyle = {
  display: 'inline-block',
  padding: '10px 14px',
  borderRadius: '12px',
  textDecoration: 'none',
  color: '#183153',
  background: '#fff',
  fontWeight: '500',
  border: '1px solid #d9e6f2',
}

const summaryGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: '10px',
  marginBottom: '14px',
}

const summaryCardStyle = {
  borderRadius: '16px',
  padding: '14px',
  boxShadow: '0 6px 16px rgba(0,0,0,0.04)',
}

const summaryTitleStyle = {
  fontSize: '12px',
  color: '#4a6078',
  marginBottom: '6px',
  fontWeight: '400',
}

const summaryValueStyle = {
  fontSize: '24px',
  fontWeight: '600',
  color: '#183153',
}

const toolboxStyle = {
  background: 'rgba(255,255,255,0.93)',
  border: '1px solid #e6eef5',
  borderRadius: '18px',
  padding: '14px',
  boxShadow: '0 8px 20px rgba(19,49,83,0.05)',
  marginBottom: '14px',
}

const searchStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '12px',
  border: '1px solid #d9e6f2',
  fontSize: '16px',
  color: '#183153',
  outline: 'none',
  boxSizing: 'border-box',
  marginBottom: '12px',
  fontWeight: '400',
}

const chipRowStyle = {
  display: 'flex',
  gap: '8px',
  overflowX: 'auto',
  paddingBottom: '4px',
}

const chipStyle = {
  whiteSpace: 'nowrap',
  padding: '10px 14px',
  borderRadius: '999px',
  border: '1px solid #d9e6f2',
  background: '#fff',
  color: '#183153',
  fontWeight: '500',
  cursor: 'pointer',
}

const chipActiveStyle = {
  border: '1px solid #3b82f6',
  background: '#dbeafe',
}

const listWrapStyle = {
  display: 'grid',
  gap: '12px',
}

const studentRowStyle = {
  background: '#fff',
  border: '1px solid #e6eef5',
  borderRadius: '18px',
  padding: '14px',
  boxShadow: '0 8px 20px rgba(19,49,83,0.05)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
}

const studentInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}

const avatarStyle = {
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #ffe7b8 0%, #ffd3e1 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}

const avatarImgStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}

const avatarFallbackStyle = {
  display: 'none',
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '22px',
  fontWeight: '600',
  color: '#183153',
}

const studentNameStyle = {
  fontSize: '16px',
  fontWeight: '500',
  color: '#183153',
}

const studentMetaStyle = {
  fontSize: '12px',
  color: '#5b6b82',
  marginTop: '2px',
  fontWeight: '400',
}

const actionGroupStyle = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
}

const statusBtnStyle = {
  padding: '10px 14px',
  borderRadius: '12px',
  border: '1px solid #d9e6f2',
  background: '#fff',
  color: '#183153',
  fontWeight: '500',
  cursor: 'pointer',
  minWidth: '64px',
}

const presentActiveStyle = {
  background: '#dcfce7',
  border: '2px solid #166534',
  color: '#166534',
}

const lateActiveStyle = {
  background: '#fef3c7',
  border: '2px solid #92400e',
  color: '#92400e',
}

const absentActiveStyle = {
  background: '#fee2e2',
  border: '2px solid #991b1b',
  color: '#991b1b',
}

const emptyStyle = {
  marginTop: '10px',
  background: '#fff',
  border: '1px solid #e6eef5',
  borderRadius: '16px',
  padding: '20px',
  textAlign: 'center',
  color: '#5b6b82',
  fontWeight: '400',
}