//services

var Item = require('../models/item');

exports.save = function(body, callback, errorback){
    
    //CHECK IF USER SUBMIT SCORE BEFORE
    var query = Item.where({playerHandle: body.playerHandle});
    query.findOne(function(error, item){
        if(error){
            errorback(error);
            return;
        }
        if(item){
            //console.log('UPDATE PLAYER:'+body.playerHandle);
            Item.findOneAndUpdate({playerHandle: body.playerHandle}, {score: body.score}, {upsert:true}, function(error, item){
                if (error || !item){
                    errorback(error);
                    return;
                }
                callback(item);
            });
        }else{
            //console.log('CREATE PLAYER:'+body.playerHandle);
            Item.create({playerHandle: body.playerHandle, score: body.score},function(error, item){
                if(error){
                    errorback(error);
                    return;
                }
                callback(item);
            });
        }
    })
};

exports.list = function(callback, errorback){
  Item.find(function(error, items){
      if(error){
          errorback(error);
          return;
      }
      callback(items);
  });  
};

exports.deleteAll = function(callback, errorback){
  Item.find(function(error, items){
      if(error){
          errorback(error);
          return;
      }
      for(var k=0; k<items.length; k++){
              Item.findOneAndRemove({_id: items[k]._id}, function(error, item){
                if(error || !item){
                    errorback(error);
                    return;
                }
              });
      }
      callback(items);
  });  
};