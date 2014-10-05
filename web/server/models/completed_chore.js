var mongoose = require('mongoose');

var CompletedChoreSchema = require('../schemas/completed_chore');

var CompletedChore = mongoose.model('CompletedChore', CompletedChoreSchema);

module.exports = CompletedChore;
