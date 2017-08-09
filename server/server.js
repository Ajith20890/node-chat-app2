const path = require('path');

const http = require('http');

const express= require('express');

const socketIO = require('socket.io');



const publicPath  = path.join(__dirname,'../public');

const port= process.env.PORT || 3000;

var app = express();

var server= http.createServer(app);

var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('New user connected');

  // socket.emit('newMessage',{
  //   from:'ajith@rediff.com',
  //   text:'Created the new messaege from rediff',
  //   createdat:12356
  // });

socket.on('createMessage',(arrivedmess)=>{
  console.log('Create message from user',arrivedmess);
  io.emit('newMessage',{
    from:arrivedmess.from,
    text:arrivedmess.text,
    createdat:new Date().getTime()
  });
});



// socket.emit('newEmail',{
//   from:'ajith.aithal2089@gmail.com',
//   text:'This is from ajith',
//   createdat:12545
// });
//
// socket.on('createEmail',(newemail)=>{
//   console.log('CreateEmail',newemail);
// });

socket.on('disconnect',()=>{
  console.log('user was disconnected from server');
});

});

server.listen(port,  ()=>{
  console.log(`app is up on port ${port}`)
});
