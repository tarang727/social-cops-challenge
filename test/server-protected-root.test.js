'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoicmFodWwiLCJwYXNzd29yZCI6InBhc3N3b3JkIn0sImlhdCI6MTUxNzQxNTQ5OSwiZXhwIjoxNTE4Mjc5NDk5fQ.IHN-c4gt4REBPH74K7DTynbdQ5yCt2_bMd4nLCQfd0k';
const incorrectToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoicmFodWwiLCJwYXNzd29yZCI6InBhc3N3b3JkIn0sImlhdCI6MTUxNzQxNTQ5OSwiZXhwIjoxNTE4Mjc5NDk5fQ.IHN-c4gt4REBPH74K7DTynbdQ5yCt2_bMd4nLCQfd0K';

let { app } = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Protected Endpoints: ROOT', () => {
  it('GET /api should return an user object if JWT is provided.', (done) => {
    chai.request(app)
      .get('/api')
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('user');
        res.body.should.have.property('iat');
        res.body.should.have.property('exp');
        done();
      });
  });
});