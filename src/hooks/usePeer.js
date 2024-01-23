import { useSocket } from '@/context/mySocketcontext';
import { useParams } from 'next/navigation';
import {useState,useEffect, useRef} from 'react'
export const usePeer = ()=>{
    const params = useParams();
    const [peer,setPeer] = useState(null);
    const [myid,setMyId] = useState("");
    const socket = useSocket();
    const ispeerset = useRef(null);
    useEffect(()=>{
        if(ispeerset.current || !params.id || !socket) return;
        ispeerset.current = true;
        (async function initPeer(){
        const PeerJS = (await import("peerjs")).default;

      // Use your own STUN server(s) here
      const stunServers = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        // Add more STUN servers if needed
      ];

      // You can also add TURN servers if necessary
      // const turnServers = [
      //   { urls: 'turn:turn.example.com', username: 'yourUsername', credential: 'yourPassword' },
      // ];

      const myPeer = new PeerJS({
        // Key: 'your-peerjs-key',  // Add your PeerJS key if you have one
        config: {
          iceServers: [...stunServers],
        },
      });

            setPeer(myPeer);
            console.log(myPeer);
            myPeer.on("open",(id)=>{
                setMyId(id);
                socket?.emit("join-room",{roomid:params.id, id})
            })
        })();
        return () => {
          if (peer) {
            peer.destroy();
          }
        };
    },[params,socket])
    return {peer,myid}
}