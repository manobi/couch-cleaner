/**
** TODO: 
** -- Refactor of clear all
** -- Use Step
** -- Use couchdb filter /  export as couchchapp
** -- Remove personal data from lib / should be a config file
** -- Create  bin file for better performace
** -- Separate before in an helper
**/

var util = require('util');
var url = require("url");
var path = require("path");
var Step = require("step");
var EventEmitter = require('events').EventEmitter;
var cradle = require('cradle');
var connection = new(cradle.Connection)('http://127.0.0.1',5984, {
	cache:false,
//	auth:{username:undefined, password:undefined}
});
var msg = require('./msgs').msgs;

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
				Step(
					function createTmp(){
						_tmp = connection.database('tmp_' + options.db);
						_tmp.create(this);
					},
					function createTmpHandler(result, err){
						if(result) {
							console.log(msg.tmp.ok);	
						}
						else {
							console.log('could not create a backup database');
							return false;
						}
					},
					function backup(){
						_self.db.replicate(_tmp.name , {doc_ids:_except},this);
					},
					function backupHandler(err, result){
						if (!result) return false;
						console.log(msg.backup.ok);
					},
					function removeOld(){
						_self.db.destroy(this);
					},
					function removeOldHandler(err, ok){
						if(!ok) return false;
					},
					function createNew(){
						_self.db.create(this);
					},
					function createNewHandler(err, created){
						if (!created) return false;
					},
					function restoreData(){
						_tmp.replicate(_self.db.name,this);
					},
					function restoreDataHandler(err, replicated){
						if (!replicated) return false;
						console.log(msg.restore.ok);
					},
					function removeTmp(){
						_tmp.destroy(this);
					},
					function removeTmpHandler(err, destroyed){
						if(destroyed){
							if(callback){
								callback(undefined, destroyed)
							}
							else {
								_self.emit("end",undefined,destroyed)
							}
							console.log(msg.clear.ok);
						};
					}
				);

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