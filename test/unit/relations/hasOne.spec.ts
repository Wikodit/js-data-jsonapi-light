import { Article, User, UserGroup, UserProfile } from '../../resources'
import { expect } from 'chai';

describe('hasOne', () => {
  describe('when resources are fetched with two level of children included: belongsTo => hasOne => belongsTo', () => {
    const 
      ARTICLE = {
        ID: '017bc4b9-014c-4873-bbda-12c4f5475740',
        TITLE: "What's up today?"
      },
      USER = {
        ID: 'e81fea3d-6379-4137-8068-7d70a90a1a7c',
        EMAIL: 'james@example.com'
      },
      PROFILE = {
        ID: 'fa4ea433-5786-46c3-ab63-079fec1c488a',
        FIRSTNAME: 'James',
        LASTNAME: 'Bond'
      },
      GROUP = {
        ID: '2ff03213-3990-41da-ba8c-1999b1e96f7a',
        NAME: 'Spies'
      }

    let article:any;

    beforeEach(() => {
      return Article.find(ARTICLE.ID, {
        params: {
          include: 'user.profile,user.group'
        }
      }).then((datas:any) => { article = datas })
    })

    afterEach(() => { article = null })

    it('should return an object with correct attributes (including id)', () => {
      expect(article).to.be.an('object');
      expect(article.id).to.equal(ARTICLE.ID);
      expect(article.title).to.equal(ARTICLE.TITLE);
    })

    it('should return the child withing attributes (with id)', () => {
      expect(article).to.have.property('author');
      expect(article.author.id).to.equal(USER.ID);
      expect(article.author.email).to.equal(USER.EMAIL);
    })

    it('should return the child of child (with id) belongsTo => hasMany', () => {
      expect(article.author).to.have.property('group');
      expect(article.author.group.id).to.equal(GROUP.ID);
      expect(article.author.group.name).to.equal(GROUP.NAME);
    })

    it('should return the child of child (with id) hasOne => belongsTo', () => {
      expect(article.author).to.have.property('profile');
      expect(article.author.profile.id).to.equal(PROFILE.ID);
      expect(article.author.profile.firstname).to.equal(PROFILE.FIRSTNAME);
    })

    it('should have injected the child in its own datastore', () => {
      let users:Array<any> = User.getAll();
      expect(users).to.have.lengthOf(1);
      expect(users[0].id).to.equal(USER.ID);
      expect(users[0].email).to.equal(USER.EMAIL);
    })

    it('should have injected the child parent in its own datastore', () => {
      let groups:Array<any> = UserGroup.getAll();
      expect(groups).to.have.lengthOf(1);
      expect(groups[0].id).to.equal(GROUP.ID);
      expect(groups[0].name).to.equal(GROUP.NAME);
    })

    it('should have injected the child of the child in its own datastore', () => {
      let profiles:Array<any> = UserProfile.getAll();
      expect(profiles).to.have.lengthOf(1);
      expect(profiles[0].id).to.equal(PROFILE.ID);
      expect(profiles[0].firstname).to.equal(PROFILE.FIRSTNAME);
    })
  })
});