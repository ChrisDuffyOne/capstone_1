//routes

var express = require('express');

var Score = require('../services/score');
var router = express.Router();

router.get('/score', function(request, response){
   Score.list(function(items){
       response.json(items);
   }, function(error){
       response.status(400).json(error);
   });  
});

router.post('/score', function(request, response){
   Score.save(request.body, function(item){
       response.status(201).json(item);
   }, function(error){
      response.status(400).json(error); 
   });
});

//DEBUG clear all scores on list
router.delete('/clearScores', function(request, response){
    Score.deleteAll(function(items){
        console.log('SCORES DELETED');
        response.json(items);
    }, function(error){
        console.log(error);
    });
});

module.exports = router;