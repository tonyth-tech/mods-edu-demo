'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function ReportPage() {
  const params = useParams()
  const [child, setChild] = useState(null)

  useEffect(() => {
    if (params?.id) {
      fetchChild()
    }
  }, [params?.id])

  async function fetchChild() {
    const { data } = await supabase
      .from('children')
      .select('*')
      .eq('id', params.id)
      .single()

    setChild(data || null)
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
      <h1>Digital Report Book</h1>
      <h2>สมุดพกพัฒนาการเด็ก</h2>

      <div
        style={{
          marginTop: '30px',
          maxWidth: '800px',
          border: '1px solid #ddd',
          borderRadius: '12px',
          padding: '25px',
          background: '#fafafa',
        }}
      >
        <h3>ข้อมูลเด็ก</h3>
        <p>ชื่อ: {child ? `${child.first_name} ${child.last_name}` : '-'}</p>
        <p>อายุ: {child?.age_display || '-'}</p>
        <p>ชั้นเรียน: {child?.class_room || '-'}</p>

        <hr style={{ margin: '20px 0' }} />

        <h3>สรุปพัฒนาการ</h3>
        <p>ด้านร่างกาย: เดินและวิ่งได้คล่อง ใช้กล้ามเนื้อมัดเล็กได้ดี</p>
        <p>ด้านอารมณ์จิตใจ: แสดงอารมณ์เหมาะสม รอคอยตามลำดับได้</p>
        <p>ด้านสังคม: เล่นร่วมกับเพื่อนได้ และแบ่งปันของเล่นกับเพื่อนได้</p>
        <p>ด้านภาษา: พูดสื่อสารเป็นประโยค และตอบคำถามง่าย ๆ ได้</p>
        <p>ด้านสติปัญญา: จับคู่สีและรูปทรงได้ ทำตามคำสั่ง 2 ขั้นตอนได้</p>

        <hr style={{ margin: '20px 0' }} />

        <h3>หมายเหตุครู</h3>
        <p>
          เด็กมีพัฒนาการตามวัย สามารถร่วมกิจกรรมกับเพื่อน และช่วยเหลือตนเองในกิจวัตรประจำวันได้ดีขึ้นอย่างต่อเนื่อง
        </p>

        <div style={{ marginTop: '25px' }}>
          <button
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              border: 'none',
              background: '#16a34a',
              color: '#fff',
              cursor: 'pointer',
              marginRight: '15px',
            }}
          >
            Send to Parent
          </button>

          <a
            href={`/child/${params.id}`}
            style={{
              display: 'inline-block',
              padding: '12px 20px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              background: '#fff',
              color: '#000',
              textDecoration: 'none',
            }}
          >
            Back to Child Profile
          </a>
        </div>
      </div>
    </div>
  )
}