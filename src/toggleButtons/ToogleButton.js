import {Mic,MicOff,PhoneOff,Video,VideoOff} from 'lucide-react'
import styles from '@/styles/RoomPage/roompage.module.css'
const Bottom = (props)=>{
    const {muted,playing,toggleAudio,tooglevideo,leaveroom} = props;
    return(
        <div className={styles['video-player-icons']}>
            {muted?<MicOff onClick={toggleAudio} size={55} />:<Mic size={55} onClick={toggleAudio}   />}
            {playing?<Video onClick={tooglevideo} size={55}  />:<VideoOff size={55}  onClick={tooglevideo}  />}
            <PhoneOff size={55} onClick={leaveroom} />
        </div>
    )
}
export default Bottom;