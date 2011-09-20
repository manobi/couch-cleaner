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
		return _except.length > 0;
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
			_tmp.create(function(err,result){
					if(err != null) {
						console.log(err);
						return false;
					}
					else {
						console.log("criou tmp");
						_self.db.replicate(_tmp.name , {doc_ids:_except},function(err,result){
							if(result){
								_self.db.destroy(function(err, result){
									if(result){
										_self.db.create(function(err, result){
											if(result){
												_tmp.replicate(_self.db.name,function(err, result){
													if(result){
														_tmp.destroy(function(err, result){
															if(result){
																if(callback){
																	callback(undefined, result)
																}
																else {
																	_self.emit("end",undefined,result)
																}
																console.log(msg.clear.ok);
															}
														});
													}
												});
											}
										});
									}
								});
							}
						});
					}
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