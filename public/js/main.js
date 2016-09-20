//----------------------------------//
//		 ARCADE APP FUNCTION	    //
//----------------------------------//
function arcade(){
    //----------- SCORE SLIDE -------------//
    $('#hiScoreButton').click(function(){
       $('#scoreDiv').slideToggle(500);
       $('.gameRow').slideToggle(500);
    });
    
    //----------- TUTORIAL SCREEN -------------//
    drawTutorial();
    
    //----------- SCORES -------------//
    var scoreBoard = new ScoreList();
    
    //----------- ROOM SELECT & LOAD ASSETS -------------//
    $('.roomSelect li').on('click', function(){
        var room = "room";
        var index = $(this).index();
        roomIndex = room.concat(index);
        socket.emit('roomSelect', roomIndex);
        createQueue();
        $('.roomSelectRow').slideToggle(500);
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
    
    //---------- SOCKET EVENTS ----------//
    socket.on('playerComm', function(data){
        socketPlayerComm(data);
    });
    socket.on('gameInstance',function(gameInfo){
        socketGameComm(gameInfo);
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