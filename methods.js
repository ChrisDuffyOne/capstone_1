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

exports.roomReadout = function(playersArray){
    setInterval(function(){ 
         console.log('ROOM INFO');
         console.log(playersArray);
     }, 3000);
};

exports.gameInstance = function(io, roomNum){
   
   var demoGameLoop = setInterval(function(){ 
        //----------- FOX SPAWN -------------//
            var speed;
            var direction;
            var height;
            var eventGen = Math.floor((Math.random() * 10) + 1); //rand between 1 and 10
            
            //direction assign
            if(eventGen >= 5){ direction = 'right'}
            else{ direction = 'left'}
            
            //speed assign
            if(eventGen%2 === 0){ speed = 3}
            else{ speed = 2}
            
            //height assign
            if(eventGen >= 4 && eventGen <= 7){height = 270}
            else{height = 360}

            io.in(roomNum).emit('gameInstance', {gameType: 'foxSpawn', direction: direction, speed: speed, height: height});
        
        //----------- EXIT GAME INSTANCE -------------//
        if(io.nsps['/'].adapter.rooms[roomNum] === undefined){
          console.log('END GAME LOOP WITH ROOM CHECK');
          clearInterval(demoGameLoop);
        }
    }, 1000); 
};