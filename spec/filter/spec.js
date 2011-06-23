var assert = require('assert');
var cradle = require('cradle');
var Cleaner = require('../../couch-cleaner');
var connection = new(cradle.Connection)('http://manobi.couchone.com',5984, {
	cache:false,
	auth:{username:'test', password:'test'}
});
var starwars = connection.database('starwars');

beforeEach(function(){
	starwars.create(function(err, result){
		if(err) {console.log("db reation error", err);}
	});
	waits(1000);

	starwars.save([
		{_id: 'luke'},
		{_id: 'leia'},
		{_id: 'vader'}
	],function(err,result){
		if(err) {console.log("savation error", err);}
	});
	waits(1000);
});



describe('.filter',function(){
	var swCleaner = new Cleaner('http://teste:teste@manobi.couchone.com:5984/starwars');

	it('should filter some docs from deletation',function(){
		swCleaner.filter(['vader','leia']).clear(function(err,result){
			if(result){
				starwars.all(function(err, result){
					expect(result.length).toEqual(2);
				});
			}
		});
		waits(2000);
	});
});