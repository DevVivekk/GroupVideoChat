const express = require('express');
const next = require('next');
const http  = require("http");
const {Server} = require('socket.io')
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const myserver  = http.createServer(server);
  const io = new Server(myserver,{
    path:'/videosocket/socket.io', 
    cors:{
    origin:"http://localhost:4000",
    methods:['GET','POST','PUT']
    }
  });
  io.on("connection",(socket)=>{
    console.log("user came");
    socket.on("join-room",(data)=>{
      socket.join(data.roomid);
      //emit a broadcast to every one except me
      socket.broadcast.to(data.roomid).emit("user-connected",data.id);
    })
    socket.on("user-toogle-audio",(userid,roomid)=>{
      socket.join(roomid);
      socket.broadcast.to(roomid).emit("user-toogle-audio",userid);
    })
    socket.on("user-toogle-video",(userid,roomid)=>{
      console.log("video toggled ", userid, roomid)
      socket.join(roomid);
      socket.broadcast.to(roomid).emit("user-toogle-video",userid);
    })
    socket.on("user-leave",(userid,roomid)=>{
      console.log("user-got left out")
      socket.join(roomid);
      socket.broadcast.to(roomid).emit("user-leave",userid)
    })
    socket.on("disconnect",()=>{
      console.log("user left!")
    })
  })
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  myserver.listen(4000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:4000');
  });
});
