const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const Team = require('./team');

const sandbox = sinon.createSandbox();

describe('Team', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('#getTeam', async () => {
    const users = [1, 2, 3];

    const fakeUser = {
      find: function() {
        return Promise.resolve(users);
      }
    };
    const UserFindSpy = sandbox.spy(fakeUser, 'find');

    const team = new Team({
      User: fakeUser
    });

    const result = await team.getTeam();
    expect(result).to.equal(users);
    expect(UserFindSpy).to.be.calledOnce;
  })
});