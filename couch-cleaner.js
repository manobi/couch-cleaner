/**
** TODO: 
** -- Refactor of clear all
** -- Use couchdb filter /  export as couchchapp
** -- Remove personal data from lib / should be a config file
** -- Create  bin file for better performace
** -- Separate before in an helper
**/

var util = require('util');
var url = require("url");
var path = require("path");
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
	var gestalt = false;
	
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
	** @public {Function} gestalt
	** @return {Object} this
	** @param  {Array} ids
	**/
	this.gestalt = function(){
		gestalt = true;
		return this;
	};
	
	this.setEvents = function(){
	
		this.on("restore",function(err, result){
			if(result){
				_tmp.destroy(function(err, result){
					if(result){
						_self.emit("end",undefined,result);
					}
				});
			}
		});
		
		this.on("recreate",function(err, result){
			if(result){
				_tmp.replicate(_self.db.name,function(err, result){
					_self.emit("restore",err, result);
				});
			}
		});
		
		this.on("destroy",function(err, result){
			if(result){
				_self.db.create(function(err, result){
					_self.emit("recreate",err, result);
				});
			}
		});
		
		
		this.on("backup",function(err, result){
			if(result){
				_self.db.destroy(function(err, result){
					_self.emit("destroy",err, result);
				});
			}
		});

		
		/**
		* Create and replicate data
		*/
		this.on("start",function(err, result){
			_tmp = connection.database('tmp_' + options.db);
			_tmp.create(function(err,result){
				if(err != null) {
					console.log(err);
					return false;
				}
				else {
					_self.db.replicate(_tmp.name , {doc_ids:_except},function(err,result){
						_self.emit("backup",err, result);
					});
				}
			});
		});
	}
	
	/** 
	** @public {Function} filter 
	** @return {Object} this
	** @param {Function} callback
	**/
	this.clear = function (callback) {
		// No filters ? Burn them all
		this.setEvents();
		if(gestalt){
			return this.db.all({startkey:'"_design/"',endkey:'"_design0"'},function(err, result){
				if(result){
					console.log("--gestalt");
					for(var i = 0; i < result.length; i++){
						_except.push(result[i]['id']);
					}
					_self.emit("start");
				} else {
					console.log(err);
				}
			});
		}
		
		if ( _hasExceptions() ) {
			console.log("--filter");
			_self.emit("start");
		} else {
			console.log("--all");
			this.clearAll(callback);
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
				console.log(err);
			}
		});
		return this;
	}
}
util.inherits(Cleaner,EventEmitter);
module.exports = Cleaner;