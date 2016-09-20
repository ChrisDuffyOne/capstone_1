//----------------------------------//
//		 ARCADE APP FUNCTION	    //
//----------------------------------//
function arcade(){
    //----------- debug SCORE SLIDE -------------//
    $('#hiScoreButton').click(function(){
       $('#scoreDiv').slideToggle(500);
       $('.gameRow').slideToggle(500);
    });
    
    //----------- debug TUTORIAL SCREEN -------------//
    function drawTutorial(){
        var ctx = $("canvas")[0].getContext("2d");
        var img = new Image();
        
        img.onload = function(){
            ctx.drawImage(img, 0, 0, 1000, 500);
        };
        
        img.src = "assets/titleScreenBarn.png";
    }
    drawTutorial();
    
    //----------- CREATE SCORE INPUT -------------//
    var scoreBoard = new ScoreList();
    
    //----------- ROOM SELECT & LOAD ASSETS -------------//
    $('.roomSelect li').on('click', function(){
        var room = "room";
        var index = $(this).index();
        roomIndex = room.concat(index);
        socket.emit('roomSelect', roomIndex);
        $('.roomSelect').css('display','none');
        createQueue();
        $('.roomSelectRow').slideToggle(500); //DEBUG
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
    
    //---------- SOCKET PARTNER ----------//
    socket.on('playerComm', function(data){ 
        //allied player position
        if(data.commType === 'playerPos'){
            //sprite flip
            if(data.x > partnerSprite.x){
                partnerSprite.scaleX = 1;
            }else{
                partnerSprite.scaleX = -1;
            } 
            //sprite move
            partnerSprite.x = data.x;
            partnerSprite.y = data.y;
        }
        
        //allied eggs
        if(data.commType === 'eggFire'){
            createEggPartner(data.x, data.y, data.scaleX);
        }
        
       //allied player fox kill
       if(data.commType === 'foxDeath'){
            killFoxPartner(data.foxX, data.foxY, data.eggX, data.eggY);
       }
    });
    //---------- SOCKET FOXSPAWN ----------//
    socket.on('gameInstance',function(gameInfo){
        if(gameLoaded){
            if(gameInfo.gameType === 'foxSpawn'){
                createFox(gameInfo.direction, gameInfo.speed, gameInfo.height);
            }
        }
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