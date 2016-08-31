var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var methods = require('./methods.js');
var players = [];

//----------------------------------//
//		      SOCKET APP            //
//----------------------------------//
io.on('connection', function(socket){
   
   //----------- ENTER GAMEROOM -------------//
   socket.on('roomSelect', function(roomNum){
       //1st player
       if(io.nsps['/'].adapter.rooms[roomNum] === undefined){
          socket.join(roomNum);
          var newPlayer = {id: socket.id, playerNum: 0, rmNumber: roomNum};
          players.push(newPlayer);
          socket.emit('playerNum', newPlayer.playerNum); //DEBUG
          methods.gameInstance(io, roomNum); //DEBUG
       //2nd player
       }else if(io.nsps['/'].adapter.rooms[roomNum].length === 1){
           socket.join(roomNum);
           var newPlayer = {id: socket.id, playerNum: 1, rmNumber: roomNum};
           players.push(newPlayer);
           socket.emit('playerNum', newPlayer.playerNum); //DEBUG
       }
   });
   
   //----------- DEBUG PLAYERS COMMUNINCATE -------------//
   socket.on('playerPos', function(coordinates){
       socket.broadcast.to(coordinates.room).emit('toOtherPlayer',coordinates);
   });
   
   //----------- PLAYER LEAVE -------------//
   socket.on(('userLeave' || 'disconnect'), function(content){
      
      for(var i=0; i<players.length; i++){
          if(players[i].id === socket.id){

              //remove left player
              var leftUser = players.splice(i,1);
              var leftRoomNumber = leftUser[0].rmNumber;
              
              //reassign remaining player
              for(var k=0; k<players.length;k++){
                  if(players[k].rmNumber === leftRoomNumber){
                      if(players[k].playerNum === 1){
                          players[k].playerNum = 0;
                      }
                  }
              }
          }
      }
   });
   
});

//----------------------------------//
//		      APP LISTEN            //
//----------------------------------//
console.log('Capstone1 Server is Online');
server.listen(process.env.PORT || 8080);
exports.app = app;