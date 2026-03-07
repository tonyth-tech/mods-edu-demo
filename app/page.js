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
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f5fbff 0%, #ffffff 100%)',
        fontFamily: 'Arial, sans-serif',
        color: '#183153',
        padding: '32px',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #4da3ff 0%, #6ec5ff 100%)',
            color: '#fff',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 10px 30px rgba(77,163,255,0.18)',
            marginBottom: '24px',
          }}
        >
          <div style={{ fontSize: '14px', opacity: 0.95, marginBottom: '8px' }}>
            MODS-EDU
          </div>
          <h1 style={{ margin: 0, fontSize: '34px', lineHeight: 1.2 }}>
            Teacher Dashboard
          </h1>
          <p style={{ marginTop: '10px', marginBottom: 0, fontSize: '16px', opacity: 0.95 }}>
            ระบบดูแลเด็กปฐมวัยสำหรับครูและกองการศึกษา
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <StatCard title="เด็กในระบบ" value={children.length} color="#e0f2fe" />
          <StatCard title="พร้อมประเมิน" value={children.length} color="#dcfce7" />
          <StatCard title="สมุดพกดิจิทัล" value={children.length} color="#fef3c7" />
          <StatCard title="ส่งออกข้อมูล" value="Excel" color="#ede9fe" />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: '24px' }}>รายชื่อเด็ก</h2>
            <p style={{ margin: '6px 0 0 0', color: '#5b6b82' }}>
              เลือกเด็กเพื่อดูข้อมูล บันทึกพัฒนาการ และดูสมุดพก
            </p>
          </div>

          <a
            href="/export"
            style={{
              display: 'inline-block',
              padding: '12px 18px',
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

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '18px',
          }}
        >
          {children.map((child) => (
            <div
              key={child.id}
              style={{
                background: '#fff',
                border: '1px solid #e6eef5',
                borderRadius: '18px',
                padding: '20px',
                boxShadow: '0 8px 20px rgba(19,49,83,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ffe7b8 0%, #ffd3e1 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    fontWeight: 'bold',
                    color: '#183153',
                  }}
                >
                  {child.first_name?.slice(0, 1) || 'D'}
                </div>

                <div>
                  <h3 style={{ margin: 0, fontSize: '21px' }}>
                    {child.first_name} {child.last_name}
                  </h3>
                  <p style={{ margin: '6px 0 0 0', color: '#5b6b82', fontSize: '14px' }}>
                    รหัส: {child.child_code || '-'}
                  </p>
                </div>
              </div>

              <div
                style={{
                  background: '#f8fbff',
                  borderRadius: '14px',
                  padding: '14px',
                  marginBottom: '16px',
                }}
              >
                <p style={{ margin: '0 0 8px 0' }}><b>Age:</b> {child.age_display || '-'}</p>
                <p style={{ margin: '0 0 8px 0' }}><b>Class:</b> {child.class_room || '-'}</p>
                <p style={{ margin: 0 }}><b>Status:</b> {child.status || '-'}</p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <ActionButton href={`/child/${child.id}`} label="View Profile" bg="#ffffff" />
                <ActionButton href={`/assess/${child.id}`} label="Assess Development" bg="#e0f2fe" />
                <ActionButton href={`/report/${child.id}`} label="View Report Book" bg="#dcfce7" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, color }) {
  return (
    <div
      style={{
        background: color,
        borderRadius: '18px',
        padding: '18px',
        boxShadow: '0 6px 16px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ fontSize: '14px', color: '#4a6078', marginBottom: '8px' }}>{title}</div>
      <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#183153' }}>{value}</div>
    </div>
  )
}

function ActionButton({ href, label, bg }) {
  return (
    <a
      href={href}
      style={{
        display: 'inline-block',
        padding: '10px 14px',
        border: '1px solid #d9e6f2',
        borderRadius: '12px',
        textDecoration: 'none',
        color: '#183153',
        background: bg,
        fontSize: '14px',
        fontWeight: 'bold',
      }}
    >
      {label}
    </a>
  )
}