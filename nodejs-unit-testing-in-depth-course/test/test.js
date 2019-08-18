const assert = require('assert');

describe('file to be tested', () => {
  context('function to be tested', () => {

    // before(() => {
    //   console.log('============before')
    // });
    //
    // after(() => {
    //   console.log('============after')
    // });
    //
    // beforeEach(() => {
    //   console.log('-------------beforeEach');
    // });
    //
    // afterEach(() => {
    //   console.log('-------------afterEach')
    // })

    it('should do something', () => {
      assert.equal(1,1)
    });

    it('should do something else', () => {
      assert.deepEqual({name: 'joe'}, {name: 'joe'});
    });

    //it('this is a pending test');
  });

  context('another function', () => {
    it('it should dos something', () => {
      assert(1,1);
    });
  })
});