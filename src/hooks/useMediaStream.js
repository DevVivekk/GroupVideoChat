import { useEffect, useRef, useState } from "react";

export const useMediaStream = ()=>{
    const isStream = useRef(false);
    const [state,setState] = useState();
    useEffect(()=>{
        if(isStream.current) return;
        isStream.current = true;
        (async function(){
            try{
            const stream = await navigator.mediaDevices.getUserMedia({audio:true,video:true});
            setState(stream);
            }catch(e){
                console.log("got error in media stream ", e)
            }
        })()
    },[])
    return{
        stream:state
    }
}