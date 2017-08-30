import * as JSData from 'js-data';
import * as Resources from '../resources'
import { expect } from 'chai';
import { store } from '../ds';

interface DSJsonApiLightResponse {
  data: Array<any> | any;
  meta: any;
}

describe('Composite Response :', () => {
  describe('when resources are fetched with a raw option', () => {
    const 
      USER_LENGTH = 1,
      INCLUDED_LENGTH = 2,
      USER = {
        ID: 'e81fea3d-6379-4137-8068-7d70a90a1a7c',
        EMAIL: 'james@example.com'
      },
      META = {
        COUNT: 50,
        ABOUT: { "copyright": "Copyright 2017 Wikodit" }
      }

    let response:any;
    
    beforeEach(() => {
      return store.findAll('User', {}, {
        raw: true // JS-Data has the support for a raw parameter in v3
      }).then((datas:any) => { response = datas })
    })

    afterEach(() => { response = null })

    it('should return a composite response in the findAll promise', () => {
      expect(response).to.have.property('data');
      expect(response).to.have.property('rawData');
      expect(response).to.have.property('meta');
    })
    
    it('should return the injected items in the data property of the composite response', () => {
      expect(response.data).to.be.an('array').and.to.have.lengthOf(USER_LENGTH);
      expect(response.data[0].id).to.equal(USER.ID);
      expect(response.data[0].email).to.equal(USER.EMAIL);
    })

    it('should return the metas in the metas property of the composite response', () => {
      expect(response.meta).to.be.an('object');
      expect(response.meta.count).to.equal(META.COUNT);
      expect(response.meta.about).to.deep.equal(META.ABOUT);
    })

    it('should return the raw response in the rawData property of the composite response', () => {
      expect(response.rawData).to.be.an('object');
      expect(response.rawData).to.have.property('data');
      expect(response.rawData).to.have.property('meta');
      expect(response.rawData).to.have.property('links');
      expect(response.rawData).to.have.property('included');
      expect(response.rawData.data[0]).to.be.an('object');
      expect(response.rawData.data[0].id).to.equal(USER.ID);
      expect(response.rawData.data[0].type).to.equal('User');
      expect(response.rawData.data[0]).to.have.property('attributes');
      expect(response.rawData.data[0]).to.have.property('relationships');
      expect(response.rawData.data[0].attributes).to.be.an('object');
      expect(response.rawData.data[0].relationships).to.be.an('object');
      expect(response.rawData.data[0].attributes.email).to.equal(USER.EMAIL);
      expect(response.rawData.included)
        .to.be.an('array')
        .and.to.have.lengthOf(INCLUDED_LENGTH);
    })
  })
});