var socket = io();

//----------------------------------//
//		 ARCADE APP FUNCTION	    //
//----------------------------------//
function arcade(){
    
    //----------- ROOM SELECT & LOAD ASSETS -------------//
    $('.roomSelect li').on('click', function(){
       var room = "room";
       var index = $(this).index();
       var roomIndex = room.concat(index);
       socket.emit('roomSelect', roomIndex);
       $('.roomSelect').css('display','none');
       createQueue();
    });
	
	//---------- CREATE JS ----------//
    var canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    context.canvas.width = 1000;
    context.canvas.height = 500;
    stage = new createjs.Stage("myCanvas");
    
    // HIGH SCORES
    getAndDisplayScore();
}

//----------------------------------//
//		     DOCUMENT READY	        //
//----------------------------------//
$(document).ready(function(){
    arcade();
});