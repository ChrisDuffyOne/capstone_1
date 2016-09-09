var ScoreList = function() {
    this.items = [];
    this.input =$('#playerName');
    this.input.keydown(this.onAddPlayerName.bind(this));
    this.getItems(); //DEBUG
};

ScoreList.prototype.onAddPlayerName = function(event) {
    if (event.which != 13) {
        return;
    }
    
    //Capture player name
    var input = $(event.target);
    var name = input.val().trim();
    
    if (name != '') {
        localStorage.setItem('playerNameLocal', name);
        this.addScore(name);
    }
    input.val('');
    event.preventDefault();
};


ScoreList.prototype.addScore = function(name) {
    var item = {'playerHandle' : name, 'score': score};
    
    var ajax = $.ajax('/scores', {
        type: 'POST',
        data: JSON.stringify(item),
        dataType: 'json',
        contentType: 'application/json'
    });
    ajax.done();
    //redirect to home
    window.location = '/';
};

ScoreList.prototype.getItems = function() {
    var ajax = $.ajax('/scores', {
        type: 'GET',
        dataType: 'json'
    });
    ajax.done(this.onGetItemsDone.bind(this));
};

ScoreList.prototype.onGetItemsDone = function(items) {
    this.items = items;
    items.sort(function(a,b){
        return parseFloat(b.score) - parseFloat(a.score);
    });
    
    //update view here
    var displayScores = [];
    $.each(this.items, function( i, item ) {
        displayScores.push('<li class="scoreItem"><span>'+item.playerHandle+' : '+item.score+'</span></li>');
    });
    $('#scoreList').append(displayScores.join(''));
};