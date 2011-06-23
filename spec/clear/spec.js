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
		if(err) {console.log(err);}
		else{
			console.log(result);
		}
	});
	waits(1000);

	starwars.save([
		{_id: 'luke'},
		{_id: 'leia'},
		{_id: 'vader'}
	],function(err,result){
		console.log(err || result);
	});
	waits(1000);
});

afterEach(function(){
	starwars.destroy(function(err, result){
		console.log("success destroy");
	});
	waits(1000);
});


describe('.clean',function(){

	var swCleaner = new Cleaner('http://teste:teste@manobi.couchone.com:5984/starwars');
	
	it('should remove all docs with callback', function(){
	
		starwars.all(function(err,result){
			expect(result.length).toEqual(3);
		});
		waits(1000);
		
		swCleaner.clear(function(){
			starwars.all(function(err,result){
				expect(result.length).toEqual(0);
			});
		});
		waits(1000);
	});

	it('should remove all docs with eventListener', function(){
		
		starwars.all(function(err,result){
			if(err) console.log(err);
			expect(result.length).toEqual(3);
		});
		waits(1000);
		
		swCleaner.clear().on('end',function(){
			starwars.all(function(err,result){
				expect(result.length).toEqual(0);
			});
		});
		waits(1000);
	});
});
