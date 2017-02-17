import { User, UserProfile } from '../../resources'
import { expect } from 'chai';

describe('belongsTo', () => {
  describe('when resources are fetched with including their belongsTo => hasOne relation', () => {
    const
      PROFILE_LENGTH = 1,
      PROFILE = {
        ID: 'fa4ea433-5786-46c3-ab63-079fec1c488a',
        FIRSTNAME: 'James',
        LASTNAME: 'Bond'
      },
      USER = {
        ID: 'e81fea3d-6379-4137-8068-7d70a90a1a7c',
        EMAIL: 'james@example.com'
      }

    let userProfiles:Array<any>;
    
    beforeEach(() => {
      return UserProfile.findAll({
        include: 'user'
      }).then((datas:Array<any>) => { userProfiles = datas })
    })

    afterEach(() => { userProfiles = null })

    it('should return an array of correct length', () => {
      expect(userProfiles).to.be.an('array').and.to.have.lengthOf(PROFILE_LENGTH);
    })

    it('should return the correct attributes (including the id)', () => {
      let profile:any = userProfiles[0];
      expect(profile.id).to.equal(PROFILE.ID);
      expect(profile.firstname).to.equal(PROFILE.FIRSTNAME);
      expect(profile.lastname).to.equal(PROFILE.LASTNAME);
    })

    it('should return the child within the attributes and set the child id.', () => {
      let profile:any = userProfiles[0];
      expect(profile).to.have.property('user');
      expect(profile.user).to.exist;
      expect(profile.userId).to.equal(USER.ID);
      expect(profile.user.id).to.equal(USER.ID);
      expect(profile.user.email).to.equal(USER.EMAIL);
    })

    it('should have injected the child in its own datastore', () => {
      let users:Array<any> = User.getAll();
      expect(users).to.have.lengthOf(1);
      expect(users[0].id).to.equal(USER.ID);
      expect(users[0].email).to.equal(USER.EMAIL);
    })
  })
});