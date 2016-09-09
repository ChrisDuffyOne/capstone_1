var http = require('http');
require('./db/connect');
var express = require('express');
var bodyParser = require('body-parser');
var itemRoutes = require('./routes/item');
var socket_io = require('socket.io');

var app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var methods = require('./methods.js');
var players = [];

//DEBUG Room info
/*var roomReadout = function(){
     setInterval(function(){ 
         console.log('ROOM INFO');
         console.log(players);
     }, 3000);
};
roomReadout();*/

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
          socket.emit('playerNum', newPlayer.playerNum);
          methods.gameInstance(io, roomNum);
       //2nd player
       }else if(io.nsps['/'].adapter.rooms[roomNum].length === 1){
           socket.join(roomNum);
           var newPlayer = {id: socket.id, playerNum: 1, rmNumber: roomNum};
           players.push(newPlayer);
           socket.emit('playerNum', newPlayer.playerNum);
       }
   });
   
   //----------- PLAYERS COMMUNINCATE -------------//
   socket.on('playerComm', function(data){
       if(data.commType === 'playerPos'){
           socket.broadcast.to(data.room).emit('playerComm', data);
       }
       
       if(data.commType === 'eggFire'){
           socket.broadcast.to(data.room).emit('playerComm', data);
       }
       
       if(data.commType ==='foxDeath'){
           socket.broadcast.to(data.room).emit('playerComm', data);
       }
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
//	         SCORE ROUTES           //
//----------------------------------//
app.use('/', itemRoutes);
app.use('*', function(request, response){
    response.status(404).json({message:'No page exists'});
});

//----------------------------------//
//		      APP LISTEN            //
//----------------------------------//
console.log('Capstone1 Server is Online');
server.listen(process.env.PORT || 8080);
exports.app = app;