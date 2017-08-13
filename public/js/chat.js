var socket = io();

function scrollToBottom(){
  var messages=jQuery('#messages');
  var newMessage=messages.children('li:last-child');
  var clientHeight=messages.prop('clientHeight');
    var scrollTop=messages.prop('scrollTop');
  var scrollHeight=messages.prop('scrollHeight');
  var newMessageHeight=newMessage.innerHeight();
  var lastMessageHeight=newMessage.prev().innerHeight();
  if (clientHeight+scrollTop+newMessageHeight+lastMessageHeight>=scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}
socket.on('connect',function(){
      var params=jQuery.deparam(window.location.search);
socket.emit('join',params,function(err){
  if (err) {
    alert(err);
    window.location.href='/';
  }else {
    console.log('No Error');
  }
});

  // console.log('connected to server');
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

socket.on('updateUserList',function (users){
  // console.log('Users list',users);
  var ol=jQuery('<ol></ol>');
  users.forEach(function(user){
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ol);
});

socket.on('newMessage',function(newmessage){
var formattedTime = moment(newmessage.createdat).format('h:m a');
var template=jQuery('#message-template').html();
var html = Mustache.render(template,{text:newmessage.text,from:newmessage.from,createdat:formattedTime});
  // var li=jQuery('<li></li>');
  // li.text(`${newmessage.from} ${formattedTime}:${newmessage.text}`);
  // jQuery('#messages').append(li);
  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage',function(message){
  var formattedTime = moment(message.createdat).format('h:m a');
  var template=jQuery('#location-message-template').html();
  var html = Mustache.render(template,{from:message.from,createdat:formattedTime,url:message.url});
  // var li=jQuery('<li></li>');
  // var a =jQuery('<a target="_blank">My current Location</a>')
  // li.text(`${message.from} ${formattedTime}:`);
  // a.attr('href',message.url);
  // li.append(a);
  // jQuery('#messages').append(li);
    jQuery('#messages').append(html);
    scrollToBottom();
});



jQuery('#message-form').on('submit',function(e){
  e.preventDefault();
  var messageTextbox= jQuery('[name=message]');
  socket.emit('createMessage',{
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
