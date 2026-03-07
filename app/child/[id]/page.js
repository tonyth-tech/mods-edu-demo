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
      <div style={pageStyle}>
        <div style={containerStyle}>
          <h1 style={{ margin: 0 }}>Loading child profile...</h1>
        </div>
      </div>
    )
  }

  if (errorMsg) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <h1 style={{ marginTop: 0 }}>Child Profile Error</h1>
          <p style={{ color: 'red' }}>{errorMsg}</p>
          <a href="/" style={backLinkStyle}>Back to Dashboard</a>
        </div>
      </div>
    )
  }

  if (!child) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <h1 style={{ marginTop: 0 }}>Child not found</h1>
          <a href="/" style={backLinkStyle}>Back to Dashboard</a>
        </div>
      </div>
    )
  }

  const displayNickname = child.nickname
    ? `น้อง${child.nickname}`
    : `น้อง${child.first_name || ''}`

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <div style={headerLabelStyle}>Child Profile</div>
            <h1 style={headerTitleStyle}>ข้อมูลเด็กแต่ละคน</h1>
            <p style={headerSubtitleStyle}>
              ข้อมูลพื้นฐานสำหรับครูประจำชั้นและการติดตามพัฒนาการ
            </p>
          </div>

          <a href="/" style={headerBackButtonStyle}>
            กลับหน้าแรก
          </a>
        </div>

        {/* Main profile card */}
        <div style={mainCardStyle}>
          <div style={profileTopStyle}>
            <div style={photoWrapStyle}>
              <img
                src={`/children/${child.child_code}.jpg`}
                alt={displayNickname}
                style={photoStyle}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  if (e.currentTarget.nextSibling) {
                    e.currentTarget.nextSibling.style.display = 'flex'
                  }
                }}
              />
              <div style={photoFallbackStyle}>
                {(child.nickname || child.first_name || 'ด').slice(0, 1)}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={nicknameStyle}>{displayNickname}</div>
              <div style={fullnameStyle}>
                {child.first_name} {child.last_name}
              </div>
              <div style={codeStyle}>{child.child_code || '-'}</div>

              <div style={badgeRowStyle}>
                <span style={softBadgeStyle}>{child.class_room || '-'}</span>
                <span style={softBadgeStyle}>{child.status || '-'}</span>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div style={infoGridStyle}>
            <InfoCard label="ชื่อเล่น" value={child.nickname || '-'} />
            <InfoCard label="เพศ" value={child.gender || '-'} />
            <InfoCard label="อายุ" value={child.age_display || '-'} />
            <InfoCard label="ห้องเรียน" value={child.class_room || '-'} />
            <InfoCard label="ส่วนสูง" value={child.height_cm ? `${child.height_cm} ซม.` : '-'} />
            <InfoCard label="น้ำหนัก" value={child.weight_kg ? `${child.weight_kg} กก.` : '-'} />
            <InfoCard label="ผู้ปกครอง" value={child.guardian_name || '-'} />
            <InfoCard
              label="เบอร์โทรผู้ปกครอง"
              value={
                child.guardian_phone ? (
                  <a
                    href={`tel:${child.guardian_phone}`}
                    style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 'bold' }}
                  >
                    {child.guardian_phone}
                  </a>
                ) : '-'
              }
            />
          </div>

          {/* Quick actions */}
          <div style={actionWrapStyle}>
            <a href={`/assess/${child.id}`} style={primaryButtonStyle}>
              บันทึกพัฒนาการ
            </a>

            <a href={`/report/${child.id}`} style={secondaryButtonStyle}>
              ดูสมุดพกดิจิทัล
            </a>

            <a href="/attendance" style={secondaryButtonStyle}>
              ไปหน้าเช็กชื่อ
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ label, value }) {
  return (
    <div style={infoCardStyle}>
      <div style={infoLabelStyle}>{label}</div>
      <div style={infoValueStyle}>{value}</div>
    </div>
  )
}

const pageStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #f2f9ff 0%, #ffffff 100%)',
  fontFamily: 'Arial, sans-serif',
  color: '#183153',
  padding: '16px',
}

const containerStyle = {
  maxWidth: '980px',
  margin: '0 auto',
}

const headerStyle = {
  background: 'linear-gradient(135deg, #4da3ff 0%, #6ec5ff 100%)',
  color: '#fff',
  borderRadius: '22px',
  padding: '20px',
  boxShadow: '0 10px 30px rgba(77,163,255,0.18)',
  marginBottom: '18px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '16px',
  flexWrap: 'wrap',
}

const headerLabelStyle = {
  fontSize: '12px',
  opacity: 0.95,
  marginBottom: '6px',
}

const headerTitleStyle = {
  margin: 0,
  fontSize: '28px',
  lineHeight: 1.2,
}

const headerSubtitleStyle = {
  margin: '8px 0 0 0',
  fontSize: '14px',
  opacity: 0.95,
}

const headerBackButtonStyle = {
  display: 'inline-block',
  padding: '10px 16px',
  borderRadius: '12px',
  textDecoration: 'none',
  color: '#183153',
  background: '#ffffff',
  fontWeight: 'bold',
  border: '1px solid #d9e6f2',
}

const mainCardStyle = {
  background: '#fff',
  border: '1px solid #e6eef5',
  borderRadius: '22px',
  padding: '20px',
  boxShadow: '0 10px 24px rgba(19,49,83,0.06)',
}

const profileTopStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '18px',
  flexWrap: 'wrap',
  marginBottom: '20px',
}

const photoWrapStyle = {
  width: '120px',
  height: '120px',
  borderRadius: '50%',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #ffe7b8 0%, #ffd3e1 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
}

const photoStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}

const photoFallbackStyle = {
  display: 'none',
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '34px',
  fontWeight: 'bold',
  color: '#183153',
}

const nicknameStyle = {
  fontSize: '28px',
  fontWeight: 'bold',
  lineHeight: 1.2,
  color: '#183153',
}

const fullnameStyle = {
  marginTop: '6px',
  fontSize: '18px',
  color: '#35506b',
}

const codeStyle = {
  marginTop: '8px',
  fontSize: '14px',
  color: '#5b6b82',
}

const badgeRowStyle = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
  marginTop: '12px',
}

const softBadgeStyle = {
  display: 'inline-block',
  padding: '8px 12px',
  borderRadius: '999px',
  background: '#eef6ff',
  color: '#183153',
  fontSize: '13px',
  fontWeight: 'bold',
  border: '1px solid #d9e6f2',
}

const infoGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '12px',
  marginBottom: '20px',
}

const infoCardStyle = {
  background: '#f8fbff',
  border: '1px solid #e6eef5',
  borderRadius: '16px',
  padding: '14px',
}

const infoLabelStyle = {
  fontSize: '12px',
  color: '#5b6b82',
  marginBottom: '6px',
}

const infoValueStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#183153',
  lineHeight: 1.4,
}

const actionWrapStyle = {
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap',
}

const primaryButtonStyle = {
  display: 'inline-block',
  padding: '12px 18px',
  borderRadius: '14px',
  textDecoration: 'none',
  color: '#fff',
  background: '#2563eb',
  fontWeight: 'bold',
}

const secondaryButtonStyle = {
  display: 'inline-block',
  padding: '12px 18px',
  borderRadius: '14px',
  textDecoration: 'none',
  color: '#183153',
  background: '#ffffff',
  fontWeight: 'bold',
  border: '1px solid #d9e6f2',
}

const backLinkStyle = {
  color: '#2563eb',
  textDecoration: 'none',
}