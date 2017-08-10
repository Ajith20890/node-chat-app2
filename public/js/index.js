var socket = io();
socket.on('connect',function(){
  console.log('connected to server');

// socket.emit('createMessage',{
//   from:'rakesh.gmail.com',
//   text:'all data present here'
// });


// socket.emit('createEmail',{
//   to:'ajith@gmail',
//   text:'hey ajith how u'
// });
//
});

socket.on('disconnect',function(){
  console.log('disconnected from server');
});

socket.on('newMessage',function(newmessage){
  console.log('New message from server',newmessage);
  var li=jQuery('<li></li>');
  li.text(`${newmessage.from}:${newmessage.text}`);
  jQuery('#messages').append(li);
});

socket.on('newLocationMessage',function(message){
  var li=jQuery('<li></li>');
  var a =jQuery('<a target="_blank">My current Location</a>')
  li.text(`${message.from}:`);
  a.attr('href',message.url);
  li.append(a);
  jQuery('#messages').append(li);
});

var messageTextbox= jQuery('[name=message]');

jQuery('#message-form').on('submit',function(e){
  e.preventDefault();
  socket.emit('createMessage',{
    from:'User',
    text:messageTextbox.val()
  },function(){
messageTextbox.val('')
  });
});

var locationButton= jQuery('#send-location');
locationButton.on('click',function(){
  if (!navigator.geolocation) {
      return alert('Geo Location not supported by the browser');
  }
  locationButton.attr('disabled','disabled').text('Sending Location...');
  navigator.geolocation.getCurrentPosition(function(position){
    locationButton.removeAttr('disabled').text('Sending Location');
    socket.emit('createLocationMessage',{
      latitude:position.coords.latitude,
      longitude:position.coords.longitude
    });
  },function(){
    locationButton.removeAttr('disabled').text('Sending Location');
    alert('Unable to fetch location');
  });
});


// socket.emit('createMessage',{
//   from:'charitha',
//   text:'hi'
// },function(){
//   console.log('got it');
// });

// socket.on('newEmail',function(email){
//   console.log('New Email Just Arrived : ',email);
// });
