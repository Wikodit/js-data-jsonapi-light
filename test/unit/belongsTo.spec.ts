import { User, UserProfile } from '../resources'
import { expect } from 'chai';

describe('belongsTo', () => {
  it("should retrieve resource and their parent which have an hasOne link", () => {
    // Using /api/user-profiles.json

    const PROFILE = {
      ID: 'fa4ea433-5786-46c3-ab63-079fec1c488a',
      FIRSTNAME: 'James',
      LASTNAME: 'Bond'
    }

    const USER = {
      ID: 'e81fea3d-6379-4137-8068-7d70a90a1a7c',
      EMAIL: 'james@example.com'
    }

    return UserProfile.findAll({
      include: 'user'
    }).then((userProfiles:Array<any>) => {
      expect(userProfiles).to.be.an('array').and.to.have.lengthOf(1);

      let profile:any = userProfiles[0];
      expect(profile).to.have.property('user');
      expect(profile.id).to.equal(PROFILE.ID);
      expect(profile.firstname).to.equal(PROFILE.FIRSTNAME);
      expect(profile.lastname).to.equal(PROFILE.LASTNAME);

      expect(profile.user).to.exist;
      expect(profile.user.id).to.equal(USER.ID);
      expect(profile.user.email).to.equal(USER.EMAIL);

      let users:Array<any> = User.getAll();
      expect(users).to.have.lengthOf(1);
      expect(users[0].id).to.equal(USER.ID);
      expect(users[0].email).to.equal(USER.EMAIL);
    })
  })
});