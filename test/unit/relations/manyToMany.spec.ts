import * as Resources from '../../resources'
import { expect } from 'chai';
import { store } from '../../ds';

const rawCompanies = require('../../api/companies.json')

describe('relations/manyToMany', () => {
  describe.only( 'when resources are fetched with nested included', () => {
    beforeEach(() => {
      return store.findAll('Company', {
        include: { companyUsers: {include: 'user' }}
      })
    })

    it('should store companies, users and companyUsers', () => {
      let companies = store.getAll('Company')
      expect(companies).to.have.lengthOf(rawCompanies.data.length)
      
      let companyUser = store.getAll('CompanyUser')
      expect(companyUser).to.have.lengthOf(
        rawCompanies.included.filter((el: any) => {
          return el.type === 'CompanyUser'
        }).length
      )

      let users = store.getAll('User')
      expect(users).to.have.lengthOf(
        rawCompanies.included.filter((el: any) => {
          return el.type === 'CompanyUser'
        }).length
      )
    })

    it('should do the correct associations', () => {
      let companies = store.getAll('Company')
      let users = companies[0].companyUsers.map((cu) => { return cu.user })
      expect(users).to.have.lengthOf(3)
    })
  })

  describe('when resources are fetched with including their child of a manyToMany relation', () => {
    const
      USER_LENGTH = 1,
      FAVORITE_LENGTH = 2,
      USER = {
        ID: 'e81fea3d-6379-4137-8068-7d70a90a1a7c',
        EMAIL: 'james@example.com'
      },
      ARTICLE1 = {
        ID: '017bc4b9-014c-4873-bbda-12c4f5475740',
        TITLE: "What's up today?"
      },
      ARTICLE2 = {
        ID: 'c9998237-bd57-4eb5-b5de-943250b852c2',
        TITLE: "This is yestarday"
      };
    
    let users:Array<any>, user:any;

    beforeEach(() => {
      return store.findAll('User', {
        include: 'favorites'
      }).then((datas:Array<any>) => { users = datas })
    })

    afterEach(() => { users = null })

    xit('should return an array of correct length', () => {
      expect(users).to.be.an('array').and.to.have.lengthOf(USER_LENGTH);
      user = user[0];
    })

    xit('should return the correct attributes (including the id)', () => {
      expect(user.id).to.equal(USER.ID);
      expect(user.email).to.equal(USER.EMAIL);
    })

    xit('should return children within the attributes (with ids)', () => {
      expect(user).to.have.property('favorites').to.have.lengthOf(FAVORITE_LENGTH);

      expect(user.favorites[0].id).to.equal(ARTICLE1.ID);
      expect(user.favorites[0].title).to.equal(ARTICLE1.TITLE);

      expect(user.favorites[1].id).to.equal(ARTICLE2.ID);
      expect(user.favorites[1].title).to.equal(ARTICLE2.TITLE);
    })

    xit('should have injected children in their own datastore', () => {
     
    })
  })
});