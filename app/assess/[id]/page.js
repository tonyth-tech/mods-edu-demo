'use client'

import { useParams } from 'next/navigation'

export default function AssessPage() {

  const params = useParams()

  return (
    <div style={{
      padding:"40px",
      fontFamily:"Arial",
      color:"#000",
      background:"#fff",
      minHeight:"100vh"
    }}>

      <h1>Assess Development</h1>

      <p>Child ID: {params.id}</p>

      <a href="/" style={{
        display:"inline-block",
        marginTop:"20px",
        padding:"10px 16px",
        border:"1px solid #ccc",
        borderRadius:"8px",
        textDecoration:"none",
        color:"#000",
        background:"#fff"
      }}>
        Back to Dashboard
      </a>

    </div>
  )
}