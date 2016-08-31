//----------------------------------//
//		 ARCADE APP FUNCTION	    //
//----------------------------------//
function arcade(){
    
    //----------- ROOM SELECT & LOAD ASSETS -------------//
    $('.roomSelect li').on('click', function(){
       var room = "room";
       var index = $(this).index();
       roomIndex = room.concat(index);
       socket.emit('roomSelect', roomIndex);
       $('.roomSelect').css('display','none');
       createQueue();
    });
    //player assign
    socket.on('playerNum', function(number){
       console.log('DEBUG: Player SPRITE', number);
    });
	
	//---------- CREATE JS ----------//
    var canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    context.canvas.width = WIDTH; 
    context.canvas.height = HEIGHT;
    stage = new createjs.Stage("myCanvas");
    
    //---------- HIGH SCORES ----------//
    getAndDisplayScore();
    
    //---------- OTHER PLAYER MOVEMENT ----------//
    socket.on('toOtherPlayer', function(coords){
       console.log('OTHER PLAYER:', coords);
       partnerSprite.x = coords.x;
       partnerSprite.y = coords.y;
    });
    
    //---------- PLAYER LEAVE ----------//
    window.addEventListener("beforeunload", function () {
  		socket.emit('userLeave');
	});
}

//----------------------------------//
//		     DOCUMENT READY	        //
//----------------------------------//
$(document).ready(function(){
    arcade();
});