//routes

var express = require('express');

var Item = require('../services/item');
var router = express.Router();

router.get('/score', function(request, response){
   Item.list(function(items){
       response.json(items);
   }, function(error){
       response.status(400).json(error);
   });  
});

router.post('/score', function(request, response){
   Item.save(request.body, function(item){
       response.status(201).json(item);
   }, function(error){
      response.status(400).json(error); 
   });
});

//DEBUG clear all scores on list
router.get('/clearScores', function(request, response){
    Item.deleteAll(function(items){
        console.log('SCORES DELETED');
        response.json(items);
    }, function(error){
        console.log(error);
    });
});

module.exports = router;