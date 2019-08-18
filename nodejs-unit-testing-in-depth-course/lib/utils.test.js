const chai = require('chai');
const sinon = require('sinon');
const crypto = require('crypto');
const sinonChai = require('sinon-chai');
const expect = chai.expect;

const utils = require('./utils');
const config = require('./config');

chai.use(sinonChai);

const sandbox = sinon.createSandbox();

describe('utils', () => {
  let secretStub, digestStub, updateStub, createHashStub, hash;

  beforeEach(() => {
    secretStub = sandbox.stub(config, 'secret').returns('fake_secret');
    digestStub = sandbox.stub().returns('ABC123');
    updateStub = sandbox.stub().returns({
      digest: digestStub
    });

    createHashStub = sandbox.stub(crypto, 'createHash').returns({
      update: updateStub
    });

    hash = utils.getHash('foo');
  });

  afterEach(() => {
    sandbox.restore();
  });

  context('get hash function', () => {
    it('should reject invalid args', () => {
      sandbox.reset();


      expect(utils.getHash()).to.be.null;
      expect(utils.getHash(null)).to.be.null;
      expect(utils.getHash({name: 'bar'})).to.be.null;
      expect(utils.getHash(5)).to.be.null;
      expect(createHashStub).to.not.have.been.called;
    });

    it('should get secret from config', () => {
      expect(secretStub).to.have.been.called;
    });

    it('should call crypto with correct settings and return hash', () => {
      expect(createHashStub).to.have.been.calledWith('md5');
      expect(updateStub).to.have.been.calledWith('foo_fake_secret');
      expect(digestStub).to.have.been.calledWith('hex');
      expect(hash).to.equal('ABC123');
    })
  });
});