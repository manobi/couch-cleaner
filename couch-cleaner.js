/**
** TODO: 
** -- Refactor of clear all
** -- Msg as module
** -- Use Step
** -- Use couchdb filter /  export as couchchapp
** -- Remove personal data from lib / should be a config file
** -- Create  bin file for better performace
** -- Separate before in an helper
**/

var util = require('util');
var url = require("url");
var path = require("path");
var EventEmitter = require('events').EventEmitter;
var Step = require("step");
var cradle = require('cradle');
var connection = new(cradle.Connection)('http://127.0.0.1',5984, {
	cache:false,
//	auth:{username:undefined, password:undefined}
});

var msg = {
	filter:{},
	tmp:{
		ok: "Tmp database is ready",
		fail: "Tmp database fail",
		destroy: "Tmp was destroyed",
		notDestroy: "Tmp could not be destroyed"
	},
	backup: {
		ok:"Backup success",
		fail: "Sorry baby, your backup fail"
	},
	restore: {
		ok: "Yeah, your backup has been restored",
		fail: "Back could not possible restore your docs from backup"
	},
	clear: {
		ok: "Finally your trash docs has gone",
		fail: "Hey Brow, we found some problems to clean your database"
	},
	clearAll: {
		ok: "all docs removed"
	}
	
};

var Cleaner = function (options) {
	/** @private {Object} _self **/
	var __construct = (function(_self){
			connection.host = options.host;
			connection.port = options.port;
			if(options.auth){
				connection.auth = {};
				connection.auth.username = options.login;
				connection.auth.password = options.password;
			}
	})(this);
	/** @public {Object} db **/
	this.db = connection.database(options.db);
	
	var _self = this;
	
	/** @private {Array} _except **/
	var _except = [];
	
	/** @private {Object} _tmp **/
	var _tmp = {};
	
	/** 
	** @private _hasExceptions 
	** return {Bollean}
	**/
	var _hasExceptions = function(){
		return _except.length >= 0;
	};
	
	/** 
	** @public {Function} filter 
	** @return {Object} this
	** @param  {Array} ids
	**/
	this.filter = function(ids){
		_except = ids;
		return this;
	};
	
	/** 
	** @public {Function} filter 
	** @return {Object} this
	** @param {Function} callback
	**/
	this.clear = function (callback) {
		// No filters ? Burn them all
		if ( !_hasExceptions() ) {
			this.clearAll(callback);
		}
		// Yeah! We have filters
		else {
			
			_tmp = connection.database('tmp_' + options.db);
			
			// Createa a temporary database
			_tmp.create(function(result,err){/// ========= line  128
				if(result) {
					console.log(msg.tmp.ok);	
				}
			
				// Save a backup of your filter data in tmp db
				_self.db.replicate( _tmp.name , {doc_ids:_except}, function ( err, result) {
					if (result) {
						console.log(msg.backup.ok);
						
						// Recreate your db cleaned
						_self.db.destroy(function(err, ok){ // ====== clear all
							if (ok) {
								_self.db.create(function(err, created){
									if (created) {
										// Restore data to a cleaned database
										_tmp.replicate(_self.db.name,function(err, replicated){
											if (replicated) {
												console.log(msg.restore.ok);
												// Destroy temporary database
												_tmp.destroy(function(err, destroyed){
													if(destroyed){
														if(callback){
															callback(undefined, destroyed)
														}
														else {
															_self.emit("end",undefined,destroyed)
														}
														console.log(msg.clear.ok);
													};
												});
											};
										});
									};
								})
							};
						});
					}
					else {
						console.log(msg.backup.fail);
						console.log(err);
					};
				});
				
			});
		}
		return this;
	};
	
	/**
	** @public {Function} clearAll
	** @return {Object} this
	** @param {Function} callback
	**/
	this.clearAll = function (callback) {
		
		var _self = this;
		if(callback) this.on('end',callback);
		
		this.db.destroy(function(err,result){
			if(result){
 				this.db = connection.database(options.db);
				this.db.create(function(err, result){
					if(result) _self.emit('end',null,result);
				});
			}
			else {
				_self.emit('error',err);
				console.log(err);
			}
		});
		return this;
	}
}
util.inherits(Cleaner,EventEmitter);
module.exports = Cleaner;