import * as sinon from 'sinon';
import { expect } from 'chai';
import { store } from '../../ds';
import * as Resources from '../../resources';
import { respondJson } from './lib';

describe('UPDATE', () => {
  let requests:Array<any> = [];
  let server:any = null

  beforeEach(() => {
    server = sinon.fakeServer.create();
    server.autoRespond = true;
    server.answer = respondJson;
  })

  afterEach(() => {
    server.restore();
  })

  describe('when use of unsupported methods', () => {
    it('should throw an error when using updateMany', () => {
      return store.updateMany('Article', [{},{}]).then(() => {
        throw new Error('fail')
      }).catch((err) => {
        expect(err.message).to.equal('JSONApi doesn\'t support updating in batch.');
      });
    })

    it('should throw an error when using updateAll', () => {
      return store.updateAll('Article', [{},{}]).then(() => {
        throw new Error('fail')
      }).catch((err) => {
        expect(err.message).to.equal('JSONApi doesn\'t support updating in batch.');
      });
    })
  })
});