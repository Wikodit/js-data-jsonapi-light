import * as sinon from 'sinon';
import { expect } from 'chai';
import { store } from '../../ds';
import * as Resources from '../../resources';
import { respondJson } from './lib';

describe('DESTROY', () => {
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

  describe('when destroying a simple object', () => {
    const
      MAPPER_NAME:string = 'Article',
      ID:string = '99633a09-9047-41bf-955f-4a8d72a38d58',
      FIND_RESPONSE:any = {
        data: {
          id: ID,
          type: MAPPER_NAME,
          attributes: {
            title: 'Test',
            content: 'Lorem ipsum'
          }
        }
      }

    let data:any = null;
    let reqGet:any = null;
    let reqDelete:any = null;
    
    beforeEach(() => {
      reqGet = server.answer(`GET articles/${ID}`, FIND_RESPONSE);
      reqDelete = server.answer(`DELETE articles/${ID}`, {});

      return Promise.resolve().then(() => {
        return store.find('Article', ID)
      }).then((record) => {
        expect(store.getAll('Article')).to.have.lengthOf(1);
      }).then(() => {
        return store.destroy('Article', ID)
      }).then((_data) => {
        data = _data
      })
    })

    afterEach(() => {
      data = reqGet = reqDelete = null;
    })

    it('should destroy an object', () => {
      expect(reqDelete.method).to.equal('DELETE');
      expect(reqDelete.url).to.equal(`api/articles/${ID}.json`);
      expect(reqDelete.body).to.equal(null);
    });

    it('should remove it from the store', () => {
      expect(store.getAll('Article')).to.have.lengthOf(0);
    });
  })

  describe('when use of unsupported methods', () => {
    it('should throw an error when using destroyAll', () => {
      return store.destroyAll('Article', [{},{}]).then(() => {
        throw new Error('fail')
      }).catch((err) => {
        expect(err.message).to.equal('JSONApi doesn\'t support destroying in batch.');
      });
    })
  })
});