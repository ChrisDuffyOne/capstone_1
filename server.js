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
       console.log('User enters rm:', roomNum);
   });
   
   //emit to room1
   setInterval(function(){ 
      io.in('room0').emit('roomSpecific'); 
   }, 5000);
   
});

console.log('Capstone1 Server is Online');
server.listen(process.env.PORT || 8080);
exports.app = app;