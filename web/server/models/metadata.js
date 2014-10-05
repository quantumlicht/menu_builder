var mongoose = require('mongoose');

var MetadataSchema = require('../schemas/metadata');

var Metadata = mongoose.model('Metadata', MetadataSchema);

module.exports = Metadata;
