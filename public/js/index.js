var socket = io();
socket.on('connect',function(){
  console.log('connected to server');

socket.emit('createMessage',{
  from:'rakesh.gmail.com',
  text:'all data present here'
});


// socket.emit('createEmail',{
//   to:'ajith@gmail',
//   text:'hey ajith how u'
// });
//
});

socket.on('newMessage',function(newmessage){
  console.log('New message from server',newmessage);
});

socket.on('disconnect',function(){
  console.log('disconnected from server');
});

socket.on('newEmail',function(email){
  console.log('New Email Just Arrived : ',email);
});
