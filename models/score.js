//models

var mongoose = require('mongoose');

var ScoreSchema = new mongoose.Schema({
    playerHandle: {type: String, required: true},
    score: {type: Number, required: true}
});

var Score = mongoose.model('Score', ScoreSchema);

module.exports = Score;