const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const User = require('./user');
const Team = require('./team');

const expect = chai.expect;
const sandbox = sinon.createSandbox();

chai.use(sinonChai);

describe('Team', () => {

  afterEach(() => {
    sandbox.restore();
  });

  it('#getTeam', async () => {
    const users = [1, 2];
    const findStub = sandbox.stub(User, 'find').resolves(users);

    const team = await Team.getTeam();
    expect(findStub).to.be.calledOnce;
    expect(team).to.equal(users);
  })
});