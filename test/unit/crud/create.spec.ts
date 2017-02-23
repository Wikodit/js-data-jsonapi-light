import * as sinon from 'sinon';
import { expect } from 'chai';
import { store } from '../../ds';
import * as Resources from '../../resources';

function respondJson(route: string, content?: any, statusCode?: number): any {
  let [method, endpoint] = route.split(' ')
  let reqPointer: any = {};

  this.respondWith(method, `api/${endpoint}.json`, function(request: any) {
    let body = null;
    try { body = JSON.parse(request.requestBody); } catch (e) {}
    reqPointer.body = body;
    reqPointer.headers = request.requestHeaders;

    request.respond(
      statusCode || 200,
      { 'Content-Type': 'application/json' },
      JSON.stringify(content || null)
    );
  });

  return reqPointer;
}

describe('CREATE', () => {
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

  describe('when creating a simple object with a belongsTo link', () => {
    const
      MAPPER_NAME:string = 'Article',
      MAPPER_NAME_LINK:string = 'User',
      RESPONSE_ID:string = '99633a09-9047-41bf-955f-4a8d72a38d58',
      RECORD:any = {
        title: 'hello',
        content: 'what\'s up ?',
        authorId: 'e81fea3d-6379-4137-8068-7d70a90a1a7c'
      },
      RESPONSE:any = {
        data: {
          id: RESPONSE_ID,
          type: MAPPER_NAME,
          attributes: {
            title: RECORD.title,
            content: RECORD.content
          }
        }
      }

    let data:any = null;
    let req:any = null;
    
    beforeEach(() => {
      req = server.answer('POST articles', RESPONSE);
      return store.create('Article', RECORD).then((_data) => {
        data = _data
      });
    })

    afterEach(() => {
      data = req = null;
    })

    it('the request should include the correct JSONApi structure', () => {
      expect(req.body).to.be.an('object');
      expect(req.body.data).to.be.an('object');
      expect(req.body.data.type).to.equal('Article');
      expect(req.body.data.attributes).to.be.an('object');
    });

    it('the request should contain correct attributes', () => {
      expect(req.body.data.attributes).to.be.deep.equal({
        title: RECORD.title,
        content: RECORD.content
      });
    });

    it('the request should also get a relationships object', () => {
      expect(req.body.data.relationships).to.be.an('object');
      expect(req.body.data.relationships.author).to.be.an('object');
      expect(req.body.data.relationships.author.data).to.be.deep.equal({
        type: 'User',
        id: RECORD.authorId
      });
    });

    it('the response')

    it('the record should be injected in the datastore', () => {
      let articles:Array<any> = store.getAll('Article');
      expect(articles).to.have.lengthOf(1);
      expect(articles[0].id).to.equal(RESPONSE_ID);
      expect(articles[0].title).to.equal(RECORD.title);
      expect(articles[0].content).to.equal(RECORD.content);
    });
  })
});