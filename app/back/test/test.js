// https://webapplog.com/tdd/

// change port just for test
process.env.BACK_PORT=5002;


var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require('../app');
var should = chai.should();
var assert = require('assert');

chai.use(chaiHttp);


context('components', function() {
    describe('test suite', function() {
        before(function(done) {
            mongoose.connect(process.env.MONGO_URI, function(error) {
                if (error) console.error('Error while connecting:\n%\n', error);
                console.log('connected');
                done(error);
            });
        });
    });
      
    
    describe('String#split', function(){
        it('should return an array', function(){
            assert(Array.isArray('a,b,c'.split(',')));
        });
    })
});

