import { expect } from 'chai';
import { store } from '../ds';
import * as sinon from 'sinon';
import * as Resources from '../resources'
import { respondJson } from './lib';

describe('Lifecycle', () => {
  describe('on find with before/after Deserialize', () => {
    const
      USER_LENGTH = 1,
      USER = {
        ID: "e81fea3d-6379-4137-8068-7d70a90a1a7c",
        EMAIL: "james@example.com",
        ALIAS: "james"
      };
      
    it('beforeDeserialize should obtain all data before JSONApi adapter deserialize', () => {
      let beforeDeserialize = sinon.spy((mapper:any, res:any, opts:any) => {
        expect(res.data).to.be.an('object').and.to.have.property('data');
        expect(res.data.data).to.be.an('array').and.to.have.lengthOf(USER_LENGTH);
        expect(res.data.data[0].type).to.equal('User');
        expect(res.data.data[0].id).to.equal(USER.ID);
        expect(res.data.data[0].attributes).to.deep.equal({ email: USER.EMAIL });

        res.data.data[0].attributes.alias = USER.ALIAS;

        return res;
      });

      return store.findAll('User', {
        include: 'user'
      }, { beforeDeserialize }).then((datas:Array<any>) => {
        let [ user ] = datas;
        expect(beforeDeserialize.calledOnce).to.be.true;
        expect(user.alias).to.equal(USER.ALIAS);
      })
    })

    it('afterDeserialize should obtain all data after JSONApi adapter deserialize', () => {
      let afterDeserialize = sinon.spy((mapper:any, data:any, opts:any) => {
        expect(data).to.be.an('array').and.to.have.lengthOf(USER_LENGTH);
        expect(data[0]).to.not.have.property('type');
        expect(data[0].id).to.equal(USER.ID);
        expect(data[0].email).to.equal(USER.EMAIL);

        data[0].alias = USER.ALIAS;

        return data;
      });

      return store.findAll('User', {
        include: 'user'
      }, { afterDeserialize }).then((datas:Array<any>) => {
        let [ user ] = datas;
        expect(afterDeserialize.calledOnce).to.be.true;
        expect(user.alias).to.equal(USER.ALIAS);
      })
    })
  });

  describe('on update with before/after serialize', () => {
    const
      USER_LENGTH = 1,
      USER = {
        ID: "e81fea3d-6379-4137-8068-7d70a90a1a7c",
        EMAIL: "james@example.com",
        ALIAS: "james"
      };

    let server:any = null;

    beforeEach(() => {
      server = sinon.fakeServer.create();
      server.autoRespond = true;
      server.answer = respondJson;
    })

    afterEach(() => {
      server.restore();
    })

      
    it('beforeSerialize should obtain all data before JSONApi adapter serialize', () => {
      let req = server.answer(`PUT users/${USER.ID}`);

      let beforeSerialize = sinon.spy((mapper:any, data:any, opts:any) => {
        expect(data).to.be.an('object');
        expect(data.id).to.equal(USER.ID);
        expect(data.email).to.equal(USER.EMAIL);

        data.alias = USER.ALIAS;
        
        return data;
      });

      return store.update('User', USER.ID, { 
        email: USER.EMAIL 
      }, { beforeSerialize }).then(() => {
        expect(beforeSerialize.calledOnce).to.be.true;
        expect(req.body.data.attributes).to.deep.equal({
          email: USER.EMAIL,
          alias: USER.ALIAS
        });
      });
    });

    it('afterSerialize should obtain all data before JSONApi adapter serialize', () => {
      let req = server.answer(`PUT users/${USER.ID}`);

      let afterSerialize = sinon.spy((mapper:any, data:any, opts:any) => {
        expect(data).to.be.an('object');
        expect(data.data).to.be.an('object');
        expect(data.data.id).to.equal(USER.ID);
        expect(data.data.attributes).to.deep.equal({
          email: USER.EMAIL
        });

        data.data.attributes.alias = USER.ALIAS;
        
        return data;
      });

      return store.update('User', USER.ID, { 
        email: USER.EMAIL 
      }, { afterSerialize }).then(() => {
        expect(afterSerialize.calledOnce).to.be.true;
        expect(req.body.data.attributes).to.deep.equal({
          email: USER.EMAIL,
          alias: USER.ALIAS
        });
      });
    });
  });

  describe('on wrong configuration', () => {
    const 
      INCORRECT_MESSAGE = 'You can not use deserialize and serialize options with this adapter, you should instead provide an afterSerialize, a beforeSerialize, an afterDeserialize or a beforeDeserialize.';

    it('deserialize should be impossible to pass when using this adapter', () => {
      let deserialize = sinon.spy();

      return store.findAll('User', {
        include: 'user'
      }, { deserialize }).then((datas:Array<any>) => {
        throw new Error('fail');
      }).catch((err) => {
        expect(err.message).to.equal(INCORRECT_MESSAGE);
      }).then(() => {
        expect(deserialize.called).to.be.false
      })
    })

    it('serialize should be impossible to pass when using this adapter', () => {
      let serialize = sinon.spy();

      return store.findAll('User', {
        include: 'user'
      }, { serialize }).then((datas:Array<any>) => {
        throw new Error('fail');
      }).catch((err) => {
        expect(err.message).to.equal(INCORRECT_MESSAGE);
      }).then(() => {
        expect(serialize.called).to.be.false
      })
    })
  })
});