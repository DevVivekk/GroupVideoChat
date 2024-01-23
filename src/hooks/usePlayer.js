import { useState } from "react";
import { cloneDeep } from "lodash";
import { useSocket } from "@/context/mySocketcontext";
import { useRouter } from "next/navigation";
const usePlayer = (roomid,myid,peer)=>{
    const socket = useSocket();
    const [players,setPlayers] = useState({});
    const playersCopy = cloneDeep(players);
    // The cloneDeep function is used to create a deep copy of the players state to 
    // ensure that you are not mutating the original state directly. In React, it's important to 
    // avoid mutating the state directly, as it can lead to unexpected behavior and issues with 
    // component rendering.
    const highLightedPlayers = playersCopy[myid];
    delete playersCopy[myid];
    const nonHighlitedPlayers = playersCopy;
    const toogleaudio = ()=>{
        console.log("i toggled my audio");
        setPlayers((prev)=>{
            const copy = cloneDeep(prev);
            copy[myid].muted = !copy[myid].muted
            return {...copy}
        })
        socket.emit('user-toogle-audio',myid,roomid);
    }
    const router = useRouter();
    const leaveroom = ()=>{
        socket.emit('user-leave',myid,roomid);
        peer?.disconnect();
        router.push('/');
    }
    const tooglevideo = ()=>{
        console.log("i toggled my video");
        setPlayers((prev)=>{
            const copy = cloneDeep(prev);
            copy[myid].playing = !copy[myid].playing
            return {...copy}
        })
        socket.emit('user-toogle-video',myid,roomid);
    }
    return{
        players,setPlayers,toogleaudio,nonHighlitedPlayers,tooglevideo,highLightedPlayers,leaveroom
    }
}
export default usePlayer;