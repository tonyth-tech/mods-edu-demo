'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AssessPage() {
  const [checks, setChecks] = useState({
    physical1: false,
    physical2: false,
    emotional1: false,
    emotional2: false,
    social1: false,
    social2: false,
    language1: false,
    language2: false,
    thinking1: false,
    thinking2: false,
  })

  const [message, setMessage] = useState('')

  function toggleCheck(key) {
    setChecks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  async function saveAssessment() {
    setMessage('Saving...')

    const summary = JSON.stringify(checks)

    const { error } = await supabase.from('assessments').insert([
      {
        term: '1',
        academic_year: '2569',
        note: summary,
      },
    ])

    if (error) {
      setMessage('Save failed: ' + error.message)
    } else {
      setMessage('Assessment saved successfully')
    }
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
      <h1>Assess Development</h1>
      <h2>แบบประเมินพัฒนาการเด็ก</h2>

      <div style={{ marginTop: '30px', maxWidth: '700px' }}>
        <SectionTitle title="ด้านร่างกาย" />
        <CheckItem
          label="เดินและวิ่งได้คล่อง"
          checked={checks.physical1}
          onChange={() => toggleCheck('physical1')}
        />
        <CheckItem
          label="ใช้กล้ามเนื้อมัดเล็กได้ดี"
          checked={checks.physical2}
          onChange={() => toggleCheck('physical2')}
        />

        <SectionTitle title="ด้านอารมณ์จิตใจ" />
        <CheckItem
          label="แสดงอารมณ์เหมาะสม"
          checked={checks.emotional1}
          onChange={() => toggleCheck('emotional1')}
        />
        <CheckItem
          label="รอคอยตามลำดับได้"
          checked={checks.emotional2}
          onChange={() => toggleCheck('emotional2')}
        />

        <SectionTitle title="ด้านสังคม" />
        <CheckItem
          label="เล่นร่วมกับเพื่อนได้"
          checked={checks.social1}
          onChange={() => toggleCheck('social1')}
        />
        <CheckItem
          label="แบ่งปันของเล่นกับเพื่อนได้"
          checked={checks.social2}
          onChange={() => toggleCheck('social2')}
        />

        <SectionTitle title="ด้านภาษา" />
        <CheckItem
          label="พูดสื่อสารเป็นประโยค"
          checked={checks.language1}
          onChange={() => toggleCheck('language1')}
        />
        <CheckItem
          label="ตอบคำถามง่าย ๆ ได้"
          checked={checks.language2}
          onChange={() => toggleCheck('language2')}
        />

        <SectionTitle title="ด้านสติปัญญา" />
        <CheckItem
          label="จับคู่สีและรูปทรงได้"
          checked={checks.thinking1}
          onChange={() => toggleCheck('thinking1')}
        />
        <CheckItem
          label="ทำตามคำสั่ง 2 ขั้นตอนได้"
          checked={checks.thinking2}
          onChange={() => toggleCheck('thinking2')}
        />

        <div style={{ marginTop: '30px' }}>
          <button
            onClick={saveAssessment}
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
            Save Assessment
          </button>

          <a href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>
            Back to Dashboard
          </a>
        </div>

        {message && (
          <p style={{ marginTop: '20px', color: '#2563eb' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

function SectionTitle({ title }) {
  return <h3 style={{ marginTop: '25px', marginBottom: '10px' }}>{title}</h3>
}

function CheckItem({ label, checked, onChange }) {
  return (
    <label
      style={{
        display: 'block',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '10px',
        background: '#fafafa',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ marginRight: '10px' }}
      />
      {label}
    </label>
  )
}