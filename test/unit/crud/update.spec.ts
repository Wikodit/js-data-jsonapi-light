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
              data: {
                type: 'User',
                id: 'e81fea3d-6379-4137-8068-7d70a90a1a7c'
              }
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
              data: {
                type: 'User',
                id: UPDATE_PARAMS.authorId
              }
            }
          }
        }
      },
      TMP_AUTHOR:any = {
        ID: "01ac757a-1cac-4a10-a6f1-ca4b7a91c4a8",
        EMAIL: "else@example.com"
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

    it('the request should also received added changes when a record is saved', () => {
      const TEST_ADDED_FIELD = 'test';
      return store.find('Article', ID).then((record) => {
        record.title = UPDATE_PARAMS.title;
        record.testAddedField = TEST_ADDED_FIELD;
        return record.save();
      }).then((data) => {
        expect(reqPatch.body.data).to.be.an('object');
        expect(reqPatch.body.data.type).to.equal(MAPPER_NAME);
        expect(reqPatch.body.data.id).to.equal(ID);
        expect(reqPatch.body.data.attributes).to.deep.equal({
          title: UPDATE_PARAMS.title,
          testAddedField: TEST_ADDED_FIELD
        })
      })
    });

    it('the request should send only changed relation in `relationships` when a record is saved.', () => {
      return store.find('Article', ID).then((record) => {
        // When id, record is not considered New
        const otherAuthor = store.add('User', {
          id: TMP_AUTHOR.ID,
          email: TMP_AUTHOR.email
        });
        record.authorId = otherAuthor.id;
        return record.save();
      }).then((data) => {
        expect(reqPatch.body.data).to.be.an('object');
        expect(reqPatch.body.data.type).to.equal(MAPPER_NAME);
        expect(reqPatch.body.data.id).to.equal(ID);
        expect(reqPatch.body.data.attributes).to.be.undefined;
        expect(reqPatch.body.data.relationships).to.be.an('object');
        expect(reqPatch.body.data.relationships.author).to.be.an('object');
        expect(reqPatch.body.data.relationships.author.data).to.deep.equal({
          type: "User",
          id: TMP_AUTHOR.ID
        });
      })
    });

    it('the request should send changed relation as attributes when a record is saved with option `forceRelationshipsInAttributes`.', () => {
      return store.find('Article', ID).then((record) => {
        // When record has id, it is not considered New
        const otherAuthor = store.add('User', {
          id: TMP_AUTHOR.ID,
          email: TMP_AUTHOR.email
        });
        record.title = UPDATE_PARAMS.title;
        record.author = otherAuthor;
        return record.save({ forceRelationshipsInAttributes: true });
      }).then((data) => {
        expect(reqPatch.body.data).to.be.an('object');
        expect(reqPatch.body.data.type).to.equal(MAPPER_NAME);
        expect(reqPatch.body.data.id).to.equal(ID);
        expect(reqPatch.body.data.attributes).to.deep.equal({
          title: UPDATE_PARAMS.title,
          authorId: TMP_AUTHOR.ID
        })
      })
    });

    it('the request should send all attributes and relationships when record is saved with option `replace`', () =>{
      return store.update('Article', ID, UPDATE_PARAMS, {
        forceReplace: true
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