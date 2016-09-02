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
    
    //---------- OTHER PLAYER COMMUNICATION ----------//
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
            //console.log('Partner Fired Egg');
            createEggPartner(data.x, data.y, data.scaleX);
        }
        
       //allied player fox kill
       if(data.commType === 'foxDeath'){
            //console.log('CLIENT: Fox death confirmed');
            //killFoxPartner(data.x, data.y); //WORKS no egg dissappear
            killFoxPartner(data.x, data.y);
            
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