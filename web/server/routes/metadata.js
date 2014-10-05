// API
// ===
var MetadataModel = require('../models/metadata');
var Config  = require('../config/config');
var UserModel = require('../models/user');
var logger = require('../config/config').logger;
var async = require('async');
var _ = require('underscore');
module.exports = function(server) {

	// Sample Rest Call

	server.get('/metadata', function(req, res){
		logger.info('GET /metadata');
		return MetadataModel.find( function(err, metadatas) {
			if (!err) {
				return res.json(metadatas);
			}
			else {
				return logger.error(err);
			}
		});	
	});

	server.get('/metadata/:type', function(req, res){
		logger.info('GET /metadata/' + req.params.type);
		return MetadataModel.find({type: req.params.type}, function(err, metadatas){
			if (!err) {
				return res.json(metadatas, 200);
			}
			else {
				logger.error(err);
			}
		});

	});

	server.post('/metadata', function(req, res) {
		logger.info('POST /metadata');
		console.log('req.body', req.body);
		var metadata = {
			type: req.body.type,
			description: req.body.description || req.body.shortDescription || req.body.longDescription,
			searchValue: req.body.searchValue
		};

		MetadataModel.create(metadata, function(err){
			if (err) {
				if (err.code === 11000) {
					console.log(err);
					res.send('Conflict', 409);
				}
				else {
					if (err.name === 'ValidationError') {
						return res.send(Object.keys(err.errors).map(function(errField) {
							return err.errors[errField].message;
						}).join('. '), 406);
					}
				}
				return;
			}
			else {
				console.log('POST /metadata');
				res.json({ metadata: metadata}, 200);   
			}
		});
	});
	
	server.put('/metadata/:id', function(req, res) {
		logger.info('PUT /metadatas/:id');
		var metadata = _.omit(req.body,['_id','title']);
		return MetadataModel.findOneAndUpdate({_id:req.params.id}, metadata, function(err, metadata) {
			if (!err) {
				logger.info( 'PUT /metadata/' + req.params.id, 'metadata updated');
				return res.send(metadata);
			}
			else {
				logger.error('PUT /metadata/:id','error', err);
			}
		});
	});	
	
	server.delete('/metadata/:id', function(req, res) {
		logger.info('Deleting metadata with id', req.params.id);
		return MetadataModel.findById(req.params.id, function(err, metadata) {
			if (!err) {
				return metadata.remove(function(err) {
					if (!err) {
						logger.info( 'metadata deleted');
						return res.send(new MetadataModel({id:req.params.id}));
					}
					else {
						logger.info(err);
					}
				});
			}
			else {
				logger.info(err);
			}
		});
	});
}

