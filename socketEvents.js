exports.socketRoutes = function(io, players, methods){
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
};