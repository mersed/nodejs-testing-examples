const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const request = require('supertest');
const rewire = require('rewire');

var app = rewire('./app');
const auth = require('./auth');
const users = require('./users');
var sandbox = sinon.createSandbox();
const expect = chai.expect;

chai.use(sinonChai);

describe('app', () => {
  let errorStub;

  beforeEach(() => {
    errorStub = sandbox.stub().callsFake((res, error) => {
      return res.status(400).json({error: 'fake'});
    });
  });

  afterEach(() => {
    app = rewire('./app');
    sandbox.restore();
  });

  context('GET /', () => {
    it('should get /', (done) => {
      request(app).get('/')
        .expect(200)
        .end((err, response) => {
          expect(response.body).to.have.property('name').to.equal('Foo Fooing Bar');
          done(err);
        })
    });
  });

  context('POST /user', () => {
    let createStub;
    it('should call user.create', (done) => {
      createStub = sandbox.stub(users, 'create').resolves({name: 'foo'});
      request(app).post('/user')
        .send({name: 'fake'})
        .expect(200)
        .end((err, response) => {
          expect(createStub).to.have.been.calledOnce;
          expect(response.body).to.have.property('name').to.equal('foo');
          done(err);
        });
    });

    it('should call handleError on error', (done) => {
      createStub = sandbox.stub(users, 'create').rejects(new Error('fake_error'));
      app.__set__('handleError', errorStub);

      request(app).post('/user')
        .send({name: 'fake'})
        .expect(400)
        .end((err, response) => {
          expect(createStub).to.have.been.calledOnce;
          expect(errorStub).to.have.been.calledOnce;
          expect(response.body).to.have.property('error').to.equal('fake');
          done(err);
        });
    });
  });

  context('DELETE /user/:id', () => {
    let authStub, deleteStub;

    beforeEach(() => {
      fakeAuth = (req, res, next) => {
        return next();
      };

      authStub = sandbox.stub(auth, 'isAuthorized').callsFake(fakeAuth);
      app = rewire('./app');
    });

    it('should call auth check function and users.delete on success', (done) => {
      deleteStub = sandbox.stub(users, 'delete').resolves('fake_delete');
      request(app).delete('/user/123')
        .expect(200)
        .end((err, response) => {
          expect(authStub).to.have.been.calledOnce;
          expect(deleteStub).to.have.been.calledWithMatch({id:'123'});
          expect(response.body).to.equal('fake_delete');
          done(err);
        })
    });

    it('should call handleError on error', (done) => {
      deleteStub = sandbox.stub(users, 'delete').rejects(new Error('fake_error'));
      app.__set__('handleError', errorStub);

      request(app).delete('/user/123')
        .send({name: 'fake'})
        .expect(400)
        .end((err, response) => {
          expect(deleteStub).to.have.been.calledOnce;
          expect(errorStub).to.have.been.calledOnce;
          expect(response.body).to.have.property('error').to.equal('fake');
          done(err);
        });
    });
  });

  context('handleError', () => {
    let handleError, res, statusStub, jsonStub;

    beforeEach(() => {
      jsonStub = sandbox.stub().returns('done');
      statusStub = sandbox.stub().returns({
        json: jsonStub
      });
      res = {
        status: statusStub
      };
      handleError = app.__get__('handleError');
    });

    it('should check error instance and format message', (done) => {
      let result = handleError(res, new Error('fake'));
      expect(statusStub).to.have.been.calledWith(400);
      expect(jsonStub).to.have.been.calledWithMatch({error: 'fake'});
      done();
    });

    it('should return object without changing it if not instance of error', (done) => {
      let result = handleError(res, {id: 1, message: 'fake error'});
      expect(statusStub).to.have.been.calledWith(400);
      expect(jsonStub).to.have.been.calledWith({id: 1, message: 'fake error'});

      done();
    });

  })
});