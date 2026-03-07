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
    <div style={{padding:"40px",fontFamily:"Arial", color:"#000", background:"#ffffff"}}>

      <h1>MODS-EDU</h1>
      <h2>Teacher Dashboard</h2>

      <div style={{marginTop:"30px"}}>

        {children.map((child) => (

          <div
            key={child.id}
            style={{
              border:"1px solid #ddd",
              padding:"20px",
              marginBottom:"15px",
              borderRadius:"10px",
              background:"#fafafa"
            }}
          >

            <h3>
              {child.first_name} {child.last_name}
            </h3>

            <p>Age: {child.age_display}</p>

            <p>Class: {child.class_room}</p>

            <div style={{marginTop:"10px"}}>

              <button style={{marginRight:"10px"}}>
                View Profile
              </button>

              <button>
                Assess Development
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}