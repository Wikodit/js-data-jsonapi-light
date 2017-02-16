import { Article, User, UserGroup, UserProfile } from '../resources'
import { expect } from 'chai';

describe('belongsTo', () => {
  it("should #find() a resource and get two levels of included: belongsTo => hasOne", () => {
    // Using /api/user-profiles.json
    const ARTICLE = {
      ID: '017bc4b9-014c-4873-bbda-12c4f5475740',
      TITLE: "What's up today?"
    }

    const USER = {
      ID: 'e81fea3d-6379-4137-8068-7d70a90a1a7c',
      EMAIL: 'james@example.com'
    }

    const PROFILE = {
      ID: 'fa4ea433-5786-46c3-ab63-079fec1c488a',
      FIRSTNAME: 'James',
      LASTNAME: 'Bond'
    }

    const GROUP = {
      ID: '2ff03213-3990-41da-ba8c-1999b1e96f7a',
      NAME: 'Spies'
    }

    return Article.find(ARTICLE.ID, {
      params: {
        include: 'user.profile,user.group'
      }
    }).then((article:any) => {
      expect(article).to.be.an('object');

      expect(article).to.have.property('author');
      expect(article.author).to.exist;
      expect(article.author).to.have.property('profile');
      expect(article.author).to.have.property('group');

      expect(article.id).to.equal(ARTICLE.ID);
      expect(article.title).to.equal(ARTICLE.TITLE);

      expect(article.author.id).to.equal(USER.ID);
      expect(article.author.email).to.equal(USER.EMAIL);

      expect(article.author.group.id).to.equal(GROUP.ID);
      expect(article.author.group.name).to.equal(GROUP.NAME);

      expect(article.author.profile.id).to.equal(PROFILE.ID);
      expect(article.author.profile.firstname).to.equal(PROFILE.FIRSTNAME);

      let users:Array<any> = User.getAll();
      expect(users).to.have.lengthOf(1);
      expect(users[0].id).to.equal(USER.ID);
      expect(users[0].email).to.equal(USER.EMAIL);

      let groups:Array<any> = UserGroup.getAll();
      expect(groups).to.have.lengthOf(1);
      expect(groups[0].id).to.equal(GROUP.ID);
      expect(groups[0].name).to.equal(GROUP.NAME);

      let profiles:Array<any> = UserProfile.getAll();
      expect(profiles).to.have.lengthOf(1);
      expect(profiles[0].id).to.equal(PROFILE.ID);
      expect(profiles[0].firstname).to.equal(PROFILE.FIRSTNAME);
    })
  })
});