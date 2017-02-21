import { User, UserGroup, UserProfile } from '../../resources'
import { expect } from 'chai';
import { store } from '../../ds';

describe('relations/hasMany', () => {
  describe('when resources are fetched with including their hasMany => belongsTo relation', () => {
    const
      GROUP_LENGTH = 2,
      USER_LENGTH = 3,
      GROUP1_USER_LENGTH = 2,
      GROUP2_USER_LENGTH = 1,
      GROUP1 = {
        ID: '2ff03213-3990-41da-ba8c-1999b1e96f7a',
        NAME: 'Spies'
      },
      GROUP2 = {
        ID: '594fcc3b-c2aa-47cc-b024-fa019ec0943a',
        NAME: 'French People'
      },
      USER1 = {
        ID: 'e81fea3d-6379-4137-8068-7d70a90a1a7c',
        EMAIL: 'james@example.com'
      },
      USER2 = {
        ID: '48aef75e-779b-45b0-8c18-e3ebe887c00d',
        EMAIL: 'pierre@example.com'
      },
      USER3 = {
        ID: 'e44fa5d7-0aff-4cc6-a21b-ef29c4b2a7c3',
        EMAIL: 'alice@example.com'
      },
      USER_IDS = [USER1.ID, USER2.ID, USER3.ID].sort();
    
    let groups:Array<any>, group1:any, group2:any;

    beforeEach(() => {
      return UserGroup.findAll({
        include: 'users'
      }).then((datas:Array<any>) => { groups = datas })
    })

    afterEach(() => { groups = null })

    it('should return an array of correct length', () => {
      expect(groups).to.be.an('array').and.to.have.lengthOf(GROUP_LENGTH);
      [ group1, group2 ] = groups;
    })

    it('should return the correct attributes (including the id)', () => {
      expect(group1.id).to.equal(GROUP1.ID);
      expect(group1.name).to.equal(GROUP1.NAME);

      expect(group2.id).to.equal(GROUP2.ID);
      expect(group2.name).to.equal(GROUP2.NAME);
    })

    it('should return children within the attributes (with ids)', () => {
      expect(group1).to.have.property('users').to.have.lengthOf(GROUP1_USER_LENGTH);
      expect(group2).to.have.property('users').to.have.lengthOf(GROUP2_USER_LENGTH);

      expect(group1.users[0].id).to.equal(USER1.ID);
      expect(group1.users[0].email).to.equal(USER1.EMAIL);

      expect(group1.users[1].id).to.equal(USER3.ID);
      expect(group1.users[1].email).to.equal(USER3.EMAIL);

      expect(group2.users[0].id).to.equal(USER2.ID);
      expect(group2.users[0].email).to.equal(USER2.EMAIL);
    })

    it('should have injected children in their own datastore', () => {
      let users:Array<any> = store.getAll('User');
      expect(users).to.have.lengthOf(3);

      let userIds = [users[0].id, users[1].id, users[2].id].sort()
      expect(userIds).to.eql(USER_IDS);
    })

  })
});