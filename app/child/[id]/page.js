'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function ChildProfilePage() {
  const params = useParams()
  const [child, setChild] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [savingEdit, setSavingEdit] = useState(false)
  const [editMsg, setEditMsg] = useState('')
  const [editHeight, setEditHeight] = useState('')
  const [editWeight, setEditWeight] = useState('')
  const [photoVersion, setPhotoVersion] = useState(Date.now())
  const [centerDisplayName, setCenterDisplayName] = useState('ศูนย์พัฒนาเด็กเล็กตำบลเหมืองจี้')

  useEffect(() => {
    if (params?.id) {
      fetchChild()
      fetchCenter()
    }
  }, [params?.id])

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
      setEditHeight(data?.height_cm ?? '')
      setEditWeight(data?.weight_kg ?? '')
      setPhotoVersion(Date.now())
    }

    setLoading(false)
  }

  async function handlePhotoUpload(event) {
    const file = event.target.files?.[0]
    if (!file || !child) return

    setUploading(true)
    setUploadMsg('กำลังอัปโหลดรูป...')

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filePath = `${child.child_code}.${extension}`

    const { error: uploadError } = await supabase.storage
      .from('children-photos')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      setUploadMsg('อัปโหลดไม่สำเร็จ: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data: publicUrlData } = supabase.storage
      .from('children-photos')
      .getPublicUrl(filePath)

    const publicUrl = publicUrlData?.publicUrl || ''

    const { error: updateError } = await supabase
      .from('children')
      .update({ photo_url: publicUrl })
      .eq('id', child.id)

    if (updateError) {
      setUploadMsg('บันทึก URL รูปไม่สำเร็จ: ' + updateError.message)
      setUploading(false)
      return
    }

    const newVersion = Date.now()

    setChild((prev) => ({
      ...prev,
      photo_url: publicUrl,
    }))
    setPhotoVersion(newVersion)
    setUploadMsg('อัปโหลดรูปสำเร็จแล้ว')
    setUploading(false)

    event.target.value = ''
  }

  async function saveEdit() {
    if (!child) return

    setSavingEdit(true)
    setEditMsg('กำลังบันทึก...')

    const { error } = await supabase
      .from('children')
      .update({
        height_cm: editHeight === '' ? null : Number(editHeight),
        weight_kg: editWeight === '' ? null : Number(editWeight),
      })
      .eq('id', child.id)

    if (error) {
      setEditMsg('บันทึกไม่สำเร็จ: ' + error.message)
      setSavingEdit(false)
      return
    }

    setChild((prev) => ({
      ...prev,
      height_cm: editHeight === '' ? null : Number(editHeight),
      weight_kg: editWeight === '' ? null : Number(editWeight),
    }))

    setEditMsg('บันทึกข้อมูลแล้ว')
    setSavingEdit(false)
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

  const photoSrc = `${child.photo_url || `/children/${child.child_code}.jpg`}?t=${photoVersion}`

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <div style={headerLabelStyle}>MODS-EDU-DSPM</div>
            <h1 style={headerTitleStyle}>ข้อมูลเด็กเล็ก</h1>
            <p style={headerSubtitleStyle}>{centerDisplayName}</p>
          </div>
        </div>

        <div className="child-profile-actions" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a href="/" className="child-profile-btn child-profile-btn-secondary">
              กลับหน้าแรก
            </a>

            <a
              href={`/assess/${child.id}`}
              className="child-profile-btn child-profile-btn-primary"
            >
              บันทึกพัฒนาการ
            </a>

            <a
              href={`/report/${child.id}`}
              className="child-profile-btn child-profile-btn-secondary child-profile-tablet-up"
            >
              ดูสมุดพก
            </a>

            <button
              type="button"
              onClick={() => window.print()}
              className="child-profile-btn child-profile-btn-secondary child-profile-desktop-only"
            >
              พิมพ์ข้อมูลเด็ก
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsEditing((prev) => !prev)
              setEditMsg('')
              setUploadMsg('')
            }}
            className="child-profile-btn child-profile-btn-secondary"
            style={{ minWidth: '48px', padding: '11px 14px' }}
            title="แก้ไข"
          >
            ⚙️
          </button>
        </div>

        <div style={mainCardStyle}>
          <div style={profileTopStyle}>
            <div style={photoWrapStyle}>
              <img
                key={photoVersion}
                src={photoSrc}
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

            <div style={{ flex: 1, minWidth: 0 }}>
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

          {isEditing && (
            <div style={editPanelStyle}>
              <div style={editPanelTitleStyle}>แก้ไขข้อมูลที่ครูปรับได้</div>

              <div style={{ marginBottom: '12px' }}>
                <label
                  style={{
                    display: 'inline-block',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid #d9e6f2',
                    background: '#fff',
                    cursor: 'pointer',
                    fontWeight: '500',
                    color: '#183153',
                  }}
                >
                  {uploading ? 'กำลังอัปโหลด...' : 'อัปโหลดรูปเด็ก'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                    disabled={uploading}
                  />
                </label>

                {uploadMsg && (
                  <div style={{ marginTop: '8px', fontSize: '13px', color: '#2563eb' }}>
                    {uploadMsg}
                  </div>
                )}
              </div>

              <div style={infoGridStyle}>
                <EditableCard
                  label="ส่วนสูง"
                  value={editHeight}
                  setValue={setEditHeight}
                  unit="ซม."
                />

                <EditableCard
                  label="น้ำหนัก"
                  value={editWeight}
                  setValue={setEditWeight}
                  unit="กก."
                />
              </div>

              <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={saveEdit}
                  disabled={savingEdit}
                  className="child-profile-btn child-profile-btn-primary"
                >
                  {savingEdit ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setEditHeight(child.height_cm ?? '')
                    setEditWeight(child.weight_kg ?? '')
                    setEditMsg('')
                    setUploadMsg('')
                  }}
                  className="child-profile-btn child-profile-btn-secondary"
                >
                  ยกเลิก
                </button>
              </div>

              {editMsg && (
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#2563eb', fontWeight: '500' }}>
                  {editMsg}
                </div>
              )}
            </div>
          )}

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
                    style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '400' }}
                  >
                    {child.guardian_phone}
                  </a>
                ) : '-'
              }
            />
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

function EditableCard({ label, value, setValue, unit }) {
  return (
    <div style={infoCardStyle}>
      <div style={infoLabelStyle}>{label}</div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="number"
          step="0.1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '10px',
            border: '1px solid #d9e6f2',
            fontSize: '15px',
            color: '#183153',
            outline: 'none',
            boxSizing: 'border-box',
            background: '#fff',
            fontWeight: '400',
          }}
        />
        <span style={{ fontSize: '13px', color: '#5b6b82', whiteSpace: 'nowrap' }}>{unit}</span>
      </div>
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
  maxWidth: '920px',
  margin: '0 auto',
}

const headerStyle = {
  background: 'linear-gradient(135deg, #4da3ff 0%, #6ec5ff 100%)',
  color: '#fff',
  borderRadius: '20px',
  padding: '16px 18px',
  boxShadow: '0 10px 24px rgba(77,163,255,0.16)',
  marginBottom: '12px',
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

const mainCardStyle = {
  background: '#fff',
  border: '1px solid #e6eef5',
  borderRadius: '20px',
  padding: '18px',
  boxShadow: '0 8px 20px rgba(19,49,83,0.05)',
}

const profileTopStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  flexWrap: 'wrap',
  marginBottom: '16px',
}

const photoWrapStyle = {
  width: '88px',
  height: '88px',
  borderRadius: '50%',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #ffe7b8 0%, #ffd3e1 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
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
  fontSize: '28px',
  fontWeight: '600',
  color: '#183153',
}

const nicknameStyle = {
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: 1.2,
  color: '#183153',
}

const fullnameStyle = {
  marginTop: '4px',
  fontSize: '16px',
  color: '#35506b',
  fontWeight: '400',
}

const codeStyle = {
  marginTop: '6px',
  fontSize: '13px',
  color: '#5b6b82',
  fontWeight: '400',
}

const badgeRowStyle = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
  marginTop: '10px',
}

const softBadgeStyle = {
  display: 'inline-block',
  padding: '7px 11px',
  borderRadius: '999px',
  background: '#eef6ff',
  color: '#183153',
  fontSize: '12px',
  fontWeight: '500',
  border: '1px solid #d9e6f2',
}

const editPanelStyle = {
  marginBottom: '16px',
  background: '#f8fbff',
  border: '1px solid #e6eef5',
  borderRadius: '16px',
  padding: '14px',
}

const editPanelTitleStyle = {
  fontSize: '14px',
  fontWeight: '500',
  marginBottom: '10px',
  color: '#183153',
}

const infoGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '10px',
}

const infoCardStyle = {
  background: '#f8fbff',
  border: '1px solid #e6eef5',
  borderRadius: '14px',
  padding: '12px',
}

const infoLabelStyle = {
  fontSize: '11px',
  color: '#5b6b82',
  marginBottom: '5px',
  fontWeight: '400',
}

const infoValueStyle = {
  fontSize: '15px',
  fontWeight: '400',
  color: '#183153',
  lineHeight: 1.4,
}

const backLinkStyle = {
  color: '#2563eb',
  textDecoration: 'none',
}