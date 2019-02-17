//During the test the env variable is set to test
process.env.NODE_ENV = 'test';


//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Hello API', () => {
/*
  * Test the /GET route
  */
  describe('/Hello API', () => {
      it('it should GET /', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('core');
                res.body.should.have.property('version');
                res.body.should.have.property('date');
                done();
            });
      });
    
      it('it should GET 404 trying to access an invalid endpoint', (done) => {
        chai.request(server)
            .get('/blah')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have.property('error');
                res.body.should.have.property('error').to.be.equal('URL not found')
                res.body.should.have.property('message');
                done();
            });
      });

      it('it should GET Hello API with an invalid request param', (done) => {
        chai.request(server)
            .get('/api/v1/hello/cpf')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('error');
                res.body.should.have.property('message');
                done();
            });
      });

      it('it should GET Hello API using valid request params', (done) => {
        chai.request(server)
            .get('/api/v1/hello/39421298764')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('code');
                res.body.should.have.property('message');
                done();
            });
      });

      it('it should GET Hello API using valid request params, but forcing a business error', (done) => {
        chai.request(server)
            .get('/api/v1/hello/11111111111')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have.property('error');
                res.body.should.have.property('message');
                done();
            });
      });
  });

});