const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');
const rewire = require('rewire');
const expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);

var sandbox = sinon.sandbox.create();
var mailer = rewire('./mailer');

describe('mailer', () => {
  let emailStub;

  beforeEach(() => {
    emailStub = sandbox.stub().resolves('done');
    mailer.__set__('sendEmail', emailStub);
  });

  afterEach(() => {
    sandbox.restore();
    mailer = rewire('./mailer');
  });

  context('send welcome email test', () => {
    it('should reject invalid args', async () => {
      await expect(mailer.sendWelcomeEmail()).to.be.eventually.rejectedWith('Invalid input');
      await expect(mailer.sendWelcomeEmail('foo@foo.com')).to.be.eventually.rejectedWith('Invalid input');
      await expect(mailer.sendWelcomeEmail(null, 'FirstName')).to.be.eventually.rejectedWith('Invalid input');
    });

    it('should invoke send email with parameters', async () => {
      await mailer.sendWelcomeEmail('foo@bar.com', 'foo');
      expect(emailStub).to.have.been.calledWith('foo@bar.com', 'Dear foo, welcome to our family!');
    })
  });

  context('send password reset email', () => {
    it('should reject invalid args', async () => {
      await expect(mailer.sendWelcomeEmail()).to.be.eventually.rejectedWith('Invalid input');
    });

    it('should invoke send email with parameters', async () => {
      await mailer.sendPasswordResetEmail('foo@bar.com');
      expect(emailStub).to.have.been.calledWith('foo@bar.com', 'Please click http://some_link to reset your password.');
    })
  });

  context('sendEmail', () => {
    let sendEmail;

    beforeEach(() => {
      mailer = rewire('./mailer');
      sendEmail = mailer.__get__('sendEmail');
    });

    afterEach(() => {
      mailer = require('./mailer');
    });

    it('should reject invalid args', async () => {
      await expect(sendEmail()).to.be.eventually.rejectedWith('Invalid input');
      await expect(sendEmail('foo@bar.com')).to.be.eventually.rejectedWith('Invalid input');
      await expect(sendEmail(null, 'body')).to.be.eventually.rejectedWith('Invalid input');
    });

    it('should resolve after sending email', async () => {
      let result = await sendEmail('foo@bar.com', 'Body');
      expect(result).to.equal('Email sent');
    });
  })
});