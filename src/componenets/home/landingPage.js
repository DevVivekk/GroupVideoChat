"use client"
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import {v4 as uuid} from 'uuid'
import styles from '@/app/page.module.css'
const LandingPage = () => {
  const [roomid, setRoomid] = useState("");
  const router = useRouter();
  const createRoom = ()=>{
    router.push(`/room/${uuid()}`)
  }
  const joinroom = ()=>{
    router.push(`/room/${roomid}`)
  }
  return (
    <div className={styles['home-page-content']}>
    <h1>Say Hi! 👋</h1>
    <button onClick={createRoom}>Create Room</button>
    <input onChange={(e)=>setRoomid(e.target.value)} type='text' placeholder='Enter room id' />
    <button onClick={joinroom}>Join with room id</button>
    </div>
  )
}

export default LandingPage