var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);

describe('Capstone Tests', function() {
    it('Should Return Ok on Home', function(done){
        chai.request(app)
            .get('/')
            .end(function(error, response){
                response.should.have.status(200);
                done();
            });
    });
});