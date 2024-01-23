"use client"
import ReactPlayer from "react-player";
import styles from '@/styles/RoomPage/roompage.module.css'
const Player = (props)=>{
    const {playerid,url,muted,playing} = props;
    console.log(props);
    return(
        <ReactPlayer className={styles['react-video-player']} key={playerid} url={url} muted={muted} playing={playing} />
    )
}
export default Player;