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
var socketEvents = require('./socketEvents.js');
var players = [];

//DEBUG Room info
/*var roomReadout = function(){
     setInterval(function(){ 
         console.log('ROOM INFO');
         console.log(players);
     }, 3000);
};
roomReadout();*/

//----------- SOCKET APP -------------//
socketEvents.socketRoutes(io, players, methods);

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