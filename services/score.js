//services

var Score = require('../models/score'); 

exports.save = function(body, callback, errorback){
    
    //CHECK IF USER SUBMIT SCORE BEFORE
    var query = Score.where({playerHandle: body.playerHandle});
    query.findOne(function(error, score){
        if(error){
            errorback(error);
            return;
        }
        if(score){
            Score.findOneAndUpdate({playerHandle: body.playerHandle}, {score: body.score}, {upsert:true}, function(error, score){
                if (error || !score){
                    errorback(error);
                    return;
                }
                callback(score);
            });
        }else{
            Score.create({playerHandle: body.playerHandle, score: body.score},function(error, score){
                if(error){
                    errorback(error);
                    return;
                }
                callback(score);
            });
        }
    })
};

exports.list = function(callback, errorback){
  Score.find(function(error, scores){
      if(error){
          errorback(error);
          return;
      }
      callback(scores);
  });  
};

exports.deleteAll = function(callback, errorback){
  Score.find(function(error, scores){
      if(error){
          errorback(error);
          return;
      }
      for(var k=0; k<scores.length; k++){
              Score.findOneAndRemove({_id: scores[k]._id}, function(error, score){
                if(error || !score){
                    errorback(error);
                    return;
                }
              });
      }
      callback(scores);
  });  
};