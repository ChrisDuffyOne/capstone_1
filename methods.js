//methods.js

exports.roomList = function(io){
    var room0list = io.nsps['/'].adapter.rooms['room0'],
       room1list = io.nsps['/'].adapter.rooms['room1'],
       room2list = io.nsps['/'].adapter.rooms['room2'],
       room3list = io.nsps['/'].adapter.rooms['room3'];
   console.log('Connected Rooms in methods.js:');
   console.log('0:',room0list);
   console.log('1:',room1list);
   console.log('2:',room2list);
   console.log('3:',room3list);
};

exports.gameInstance = function(io, roomNum){
    //DEBUG
    /*var demoCounter = 0;
    var demoGameLoop = setInterval(function(){ 
      io.in(roomNum).emit('instanceTest' , demoCounter);
      demoCounter++;
      //Exit game loop
      if(demoCounter > 50){
          clearInterval(demoGameLoop);
      }
    }, 1000);*/
    
    
   var gameCounter = 0;
   
   var demoGameLoop = setInterval(function(){ 
        
        gameCounter++;
        
        if(gameCounter%5 === 0){
            io.in(roomNum).emit('gameInstance', {gameType: 'foxSpawn'});
        }
        
        //Exit game loop TODO terminate when everyone leaves
        if(gameCounter > 50){
          clearInterval(demoGameLoop);
        }
    }, 1000); 
};