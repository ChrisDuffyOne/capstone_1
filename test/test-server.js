var chai = require('chai');
var chaiHttp = require('chai-http');

global.environment = 'test';
var server = require('../server.js');
var Item = require('../models/item');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);
chai.use(require('chai-things'));

describe('Capstone Tests', function() {
    before(function(done){
       console.log('TEST START');
       done();
    });
    
    it('Should Return Ok on Home', function(done){
        chai.request(app)
            .get('/')
            .end(function(error, response){
                response.should.have.status(200);
                done();
            });
    });
    
    it('make sure DB is clear',function(done){
		chai.request(app)
			.get('/score')
			.end(function(error, response){
				should.equal(error, null);
				response.should.have.status(200);
				response.should.be.json;
				response.body.should.be.a('array');
				response.body.should.have.length(0);
				done();
			});
	});
    
    it('Add 1st item to DB',function(done){
		chai.request(app)
			.post('/score')
			.send({'playerHandle' : 'Dummy', 'score': '123'})
			.end(function(error, response){
				should.equal(error, null);
				response.should.have.status(201);
				response.should.be.json;
				response.body.should.be.a('object');
				response.body.should.have.property('playerHandle');
				response.body.should.have.property('_id');
				response.body.playerHandle.should.be.a('string');
				response.body.playerHandle.should.equal('Dummy');
				done();
			});
	});
	
	it('Add 2nd item to DB',function(done){
		chai.request(app)
			.post('/score')
			.send({'playerHandle' : 'Test', 'score': '456'})
			.end(function(error, response){
				should.equal(error, null);
				response.should.have.status(201);
				response.should.be.json;
				response.body.should.be.a('object');
				response.body.should.have.property('playerHandle');
				response.body.should.have.property('_id');
				response.body.playerHandle.should.be.a('string');
				response.body.playerHandle.should.equal('Test');
				done();
			});
	});
	
	it('should list items on GET',function(done){
		chai.request(app)
			.get('/score')
			.end(function(error, response){
				should.equal(error, null);
				response.should.have.status(200);
				response.should.be.json;
				response.body.should.be.a('array');
				response.body.should.have.length(2);
				response.body[0].should.be.a('object');
				response.body[0].playerHandle.should.be.a('string');
				response.body.should.all.have.property('playerHandle');
				response.body.should.all.have.property('_id');
				response.body.should.contain.a.thing.with.property('playerHandle', 'Dummy');
				response.body.should.contain.a.thing.with.property('score', 123);
				response.body.should.contain.a.thing.with.property('playerHandle', 'Test');
				response.body.should.contain.a.thing.with.property('score', 456);
				done();
			});
	});
	
	after(function(done){
	   console.log('TEST DONE');
	   Item.remove(function(){
	       done();
	   });
	});
});