const path = require('path');

const http = require('http');

const express= require('express');

const socketIO = require('socket.io');

var {generateMessage,generateLocationMessage} = require('./utils/message');

const {isRealString} = require('./utils/validation.js');
const {Users} = require('./utils/Users.js');

const publicPath  = path.join(__dirname,'../public');

const port= process.env.PORT || 3000;

var app = express();

var server= http.createServer(app);

var io = socketIO(server);
var users=new Users();

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('New user connected');

  // socket.emit('newMessage',{
  //   from:'ajith@rediff.com',
  //   text:'Created the new messaege from rediff',
  //   createdat:12356
  // });


socket.on('join',(params,callback)=>{
if (!isRealString(params.name) || !isRealString(params.room)) {
  return callback('Name and Room name are required');
}
socket.join(params.room);
users.removeUser(socket.id);
users.addUser(socket.id,params.name,params.room);
io.to(params.room).emit('updateUserList',users.getUserList(params.room));
socket.emit('newMessage',generateMessage('Admin','Welcome to chat App'));

socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',
`${params.name} user joined`));

callback();
});

socket.on('createMessage',(arrivedmess,callback) =>{
  console.log('Create message from user',arrivedmess);
  // socket.broadcast.emit('newMessage',{
  //   from:arrivedmess.from,
  //   text:arrivedmess.text,
  //   createdat:new Date().getTime()
  // });
  io.emit('newMessage',generateMessage(arrivedmess.from,arrivedmess.text));
  callback();
});

socket.on('createLocationMessage',(coords)=>{
  io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));
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
  // console.log('user was disconnected from server');
  var user=users.removeUser(socket.id);
  if (user) {
    io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));
  }
});

});

server.listen(port,  ()=>{
  console.log(`app is up on port ${port}`)
});
