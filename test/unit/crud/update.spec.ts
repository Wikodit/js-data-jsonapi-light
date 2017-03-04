import * as sinon from 'sinon';
import { expect } from 'chai';
import { store } from '../../ds';
import * as Resources from '../../resources';
import { respondJson } from '../lib';

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

  describe('when updating a simple object', () => {
    const
      MAPPER_NAME:string = 'Article',
      ID:string = '99633a09-9047-41bf-955f-4a8d72a38d58',
      FIND_RESPONSE:any = {
        data: {
          id: ID,
          type: MAPPER_NAME,
          attributes: {
            title: 'Original title',
            content: 'Original content'
          },
          relationships: {
            author: {
              type: 'User',
              id: 'e81fea3d-6379-4137-8068-7d70a90a1a7c'
            }
          }
        }
      },
      UPDATE_PARAMS = {
        title: 'New title',
        authorId: '48aef75e-779b-45b0-8c18-e3ebe887c00d'
      },
      UPDATE_RESPONSE:any = {
        data: {
          id: ID,
          type: MAPPER_NAME,
          attributes: {
            title: UPDATE_PARAMS.title,
            content: 'Original content'
          },
          relationships: {
            author: {
              type: 'User',
              id: UPDATE_PARAMS.authorId
            }
          }
        }
      };

    let reqGet:any = null;
    let reqPatch:any = null;
    let reqPut:any = null;
    
    beforeEach(() => {
      reqGet = server.answer(`GET articles/${ID}`, FIND_RESPONSE);
      reqPatch = server.answer(`PATCH articles/${ID}`, UPDATE_RESPONSE);
      reqPut = server.answer(`PUT articles/${ID}`, UPDATE_RESPONSE);

      return Promise.resolve().then(() => {
        return store.find('Article', ID)
      }).then((record) => {
        expect(store.getAll('Article')).to.have.lengthOf(1);
      })
    })

    afterEach(() => {
      reqPatch = reqPut = null;
    })

    it('the request should receive only modified fields per default', () => {
      return store.update('Article', ID, UPDATE_PARAMS).then((data) => {
        expect(reqPatch.body).to.deep.equal({
          data: {
            type: MAPPER_NAME,
            id: ID,
            attributes: { title: UPDATE_PARAMS.title },
            relationships: {
              author: {
                data: { type: "User", id: UPDATE_PARAMS.authorId }
              }
            }
          }
        })

        expect(data).to.be.an('object')
        expect(data.id).to.equal(ID)
        expect(data.title).to.equal(UPDATE_PARAMS.title)
        expect(data.content).to.equal(FIND_RESPONSE.data.attributes.content)
      })
    });

    it('the request should only received changes when a record is saved', () => {
      return store.find('Article', ID).then((record) => {
        record.title = UPDATE_PARAMS.title;
        return record.save();
      }).then((data) => {
        console.info(reqPatch.body);
        expect(reqPatch.body).to.deep.equal({
          data: {
            type: MAPPER_NAME,
            id: ID,
            attributes: { title: UPDATE_PARAMS.title }
          }
        })

        expect(data).to.be.an('object')
        expect(data.id).to.equal(ID)
        expect(data.title).to.equal(UPDATE_PARAMS.title)
        expect(data.content).to.equal(FIND_RESPONSE.data.attributes.content)
      })
    });

    it('the request should send relation when a record is saved.', () => {
      return store.update('Article', ID, UPDATE_PARAMS, {
        replace: true
      }).then((data) => {
        expect(reqPut.body.data).to.be.an('object');
        expect(reqPut.body.data.type).to.equal(MAPPER_NAME);
        expect(reqPut.body.data.id).to.equal(ID);
        expect(reqPut.body.data.attributes).to.deep.equal({
          title: UPDATE_PARAMS.title
        });
        expect(reqPut.body.data.relationships).to.be.an('object');
        expect(reqPut.body.data.relationships.author).to.deep.equal({
          data: { type: "User", id: UPDATE_PARAMS.authorId }
        });
        
        expect(data).to.be.an('object')
        expect(data.id).to.equal(ID)
        expect(data.title).to.equal(UPDATE_PARAMS.title)
        expect(data.content).to.equal(FIND_RESPONSE.data.attributes.content)
      })
    });

    it('the request should send all attributes and relationships when record is saved with option `replace`', () =>{
      return true;
    })
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