var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

//socket io app
io.on('connection', function(socket){
   console.log('Person Connect');
   
   //enter room
   socket.on('roomSelect', function(roomNum){
       socket.join(roomNum);
       
       //DEBUG find all connected memebers
       console.log('User ID:',socket.id);
       console.log('Room Number:',roomNum);
       
       //TODO room delegation
       console.log('room0 Connected:');
       console.log(io.nsps['/'].adapter.rooms['room0']);
       
   });
   
   //emit to room1
   setInterval(function(){ 
      io.in('room0').emit('roomSpecific'); 
   }, 5000);
   
   //DEBUG chicken movement
   socket.on('chickenPos', function(coords){
      console.log('Coordinates are:', coords.x , coords.y);
      io.in('room0').emit('chickenMov', coords);
   });
   
});

console.log('Capstone1 Server is Online');
server.listen(process.env.PORT || 8080);
exports.app = app;