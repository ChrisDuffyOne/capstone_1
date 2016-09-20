//----------------------------------//
//		     SOCKET EVENTS          //
//----------------------------------//

function socketPlayerComm(data){
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
}

function socketGameComm(gameInfo){
    if(gameLoaded){
            if(gameInfo.gameType === 'foxSpawn'){
                createFox(gameInfo.direction, gameInfo.speed, gameInfo.height);
            }
    }
}