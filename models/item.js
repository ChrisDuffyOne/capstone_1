//models

var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
    playerHandle: {type: String, required: true},
    score: {type: Number, required: true}
});

var Item = mongoose.model('Item',ItemSchema);

module.exports = Item;