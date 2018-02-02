/* global process, describe, it */
'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoicmFodWwiLCJwYXNzd29yZCI6InBhc3N3b3JkIn0sImlhdCI6MTUxNzQxNTQ5OSwiZXhwIjoxNTE4Mjc5NDk5fQ.IHN-c4gt4REBPH74K7DTynbdQ5yCt2_bMd4nLCQfd0k';
const incorrectToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoicmFodWwiLCJwYXNzd29yZCI6InBhc3N3b3JkIn0sImlhdCI6MTUxNzQxNTQ5OSwiZXhwIjoxNTE4Mjc5NDk5fQ.IHN-c4gt4REBPH74K7DTynbdQ5yCt2_bMd4nLCQfd0K';

let { app } = require('../server');
chai.should();

chai.use(chaiHttp);

describe('Protected Endpoints: THUMBNAIL_GENERATION', () => {
  it('POST /api/create_thumbnail should return an image if imageUrl is provided along with JWT.', (done) => {
    chai.request(app)
      .post('/api/create_thumbnail')
      .send({ imageUrl: 'http://onelovemassive.com/wp-content/uploads/2016/10/test-image.png' })
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it('POST /api/create_thumbnail should not return an image if wrong imageUrl is provided along with JWT.', (done) => {
    chai.request(app)
      .post('/api/create_thumbnail')
      .send({ imageUrl: 'http://somedomain.com/someimage.png' })
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(500);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(false);
        res.body.should.have.property('message').eql('Unable to read the image from the url.');
        done();
      });
  });
  it('POST /api/create_thumbnail should not return an image if imageUrl is not provided.', (done) => {
    chai.request(app)
      .post('/api/create_thumbnail')
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(false);
        res.body.should.have.property('message').eql('Please pass the imageUrl in the form.');
        done();
      });
  });
  it('POST /api/create_thumbnail should return status of 400 if JWT is not provided.', (done) => {
    chai.request(app)
      .post('/api/create_thumbnail')
      .send({ imageUrl: 'http://somedomain.com/someimage.png' })
      .end((err, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(false);
        res.body.should.have.property('message').eql('No token provided.');
        done();
      });
  });
  it('POST /api/create_thumbnail should return status of 403 if JWT is incorrectly provided.', (done) => {
    chai.request(app)
      .post('/api/create_thumbnail')
      .send({ imageUrl: 'http://somedomain.com/someimage.png' })
      .set('token', incorrectToken)
      .end((err, res) => {
        res.should.have.status(403);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(false);
        res.body.should.have.property('message').eql('Incorrect Token. Authenticaion Failed.');
        done();
      });
  });
});
