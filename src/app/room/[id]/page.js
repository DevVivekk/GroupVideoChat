"use client"
import { useSocket } from '@/context/mySocketcontext'
import { usePeer } from '@/hooks/usePeer';
import { useMediaStream } from '@/hooks/useMediaStream';
import Player from '@/utils/videoplayer';
import { useEffect, useState } from 'react';
import usePlayer from '@/hooks/usePlayer';
import { useParams } from 'next/navigation';
import Bottom from '@/toggleButtons/ToogleButton';
import { cloneDeep } from 'lodash';
import styles from '@/styles/RoomPage/roompage.module.css'
const RoomPageid = () => {
    const params = useParams();
    const {peer,myid} = usePeer();
    const {stream} = useMediaStream();
    const {players,setPlayers,highLightedPlayers,nonHighlitedPlayers,toogleaudio,tooglevideo,leaveroom} = usePlayer(params.id,myid,peer);
    const socket = useSocket();
    const [users,setUsers]= useState([]);
    useEffect(()=>{
        if(!socket || !stream) return;
        const handleUserConnected = (data)=>{
            console.log("user joined, ", data)
            console.log(peer);
            console.log(socket);
            const call = peer.call(data,stream) 
            call.on("stream",(incomingStream)=>{
              console.log("got incoming stream from new user ", incomingStream);
              setPlayers((prev)=>({
                ...prev,
                [data]:{
                  url:incomingStream,
                  muted:true,
                  playing:true,
                  playerid:data
                }
              }))
              setUsers((prev)=>({
                ...prev,[data]:call
              }))
            })
        }
        if(!socket) return;
        socket?.on("user-connected",handleUserConnected);
        return()=>{
            socket?.off("user-connected",handleUserConnected);
        }
    },[peer,socket,stream,setPlayers])
    useEffect(()=>{
      if(!peer || !stream) return;
      peer.on("call",(callerStream)=>{
        callerStream.answer(stream);
        callerStream.on("stream",(incomingStream)=>{
          console.log("incoming stream from someone ", callerStream.peer,  incomingStream);
          setPlayers((prev)=>({
            ...prev,
            [callerStream.peer]:{
              url:incomingStream,
              muted:true,
              playing:true,
              playerid:callerStream.peer
            }
          }))
          setUsers((prev)=>({
            ...prev,[callerStream.peer]:callerStream
          }))
        })
      })
    },[peer,stream])
    useEffect(()=>{
      if(!socket) return;
      const handlToogleAudio = (userid)=>{
      setPlayers((prev)=>{
        const copy = cloneDeep(prev);
        copy[userid].muted = !copy[userid].muted
        return {...copy};
      })
      }
      const handlToogleVideo = (userid)=>{
        console.log("video got toggled!!")
        setPlayers((prev)=>{
          const copy = cloneDeep(prev);
          copy[userid].playing = !copy[userid].playing
          return {...copy};
        })
        }
        const handleuserleave  = (userid)=>{
          users[userid]?.close()
          const playersCopy = cloneDeep(players);
          delete playersCopy[userid];
          setPlayers(playersCopy);
        }
        socket.on("user-toogle-audio",handlToogleAudio)
        socket.on("user-toogle-video",handlToogleVideo)
        socket.on("user-leave",handleuserleave)
        return ()=>{
          socket.off("user-toogle-audio",handlToogleAudio)
          socket.off("user-toogle-video",handlToogleVideo)
          socket.off("user-leave",handleuserleave);
        }
    },[setPlayers,players,socket,users])

    useEffect(()=>{
      if(!stream || !myid || !setPlayers) return;
      setPlayers((prev)=>({
        ...prev,
        [myid]:{
          url:stream,
          muted:true,
          playing:true,
          playerid:myid
        }
      }))
    },[stream,myid,setPlayers])
    console.log(nonHighlitedPlayers);
    // const [randomIndex,setRandomIndex] = useState(0);
    // const [randomKey,setRandomKey] = useState(null);
    // const fngenerateRandomIndex = ()=>{
    //   const newIndex = Math.floor(Math.random() * Object.keys(nonHighlitedPlayers).length);
    //   const newKey = Object.keys(nonHighlitedPlayers)[newIndex];
    //   setRandomIndex(newIndex);
    //   setRandomKey(newKey)
    //   console.log(randomIndex);
    //   console.log(randomKey);
    // }
    // useEffect(()=>{
    //   fngenerateRandomIndex();
    // },[randomIndex,randomKey])
  return (
    <>
    <div className={styles['room-page-main']}>
    {highLightedPlayers && (
      <Player url={highLightedPlayers.url} muted={highLightedPlayers.muted} playing={highLightedPlayers.playing} playerid={myid} key={myid} isActive />
    )}
    <Bottom
        muted={highLightedPlayers?.muted}
        playing={highLightedPlayers?.playing}
        toggleAudio={toogleaudio}
        tooglevideo={tooglevideo}
        leaveroom = {leaveroom}
      />
      <div className={styles['other-user-video']}>
    {
    Object.keys(nonHighlitedPlayers).map((item)=>{
      const {url,muted,playing,playerid} = nonHighlitedPlayers[item]
      return(
     <Player myid={myid} key={playerid} playerid={playerid} url={url} muted={muted} playing={playing}  isActive={false} />
      )
    })
    }
    {/* {nonHighlitedPlayers[randomKey] && (
    <Player
      myid={myid}
      key={nonHighlitedPlayers[randomKey].playerid}
      playerid={nonHighlitedPlayers[randomKey].playerid}
      url={nonHighlitedPlayers[randomKey].url}
      muted={nonHighlitedPlayers[randomKey].muted}
      playing={nonHighlitedPlayers[randomKey].playing}
      isActive={false}
    />
  )
    }
    <button onClick={fngenerateRandomIndex}>Next User</button> */}
    </div>
    </div>
    </>

  )
}

export default RoomPageid