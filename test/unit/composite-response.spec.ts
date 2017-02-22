import * as JSData from 'js-data';
import * as Resources from '../resources'
import { expect } from 'chai';
import { store } from '../ds';

interface DSJsonApiLightResponse {
  data: Array<any> | any;
  meta: any;
}

describe('Composite Response :', () => {
  describe('when resources are fetched with a compositeResponse option', () => {
    const 
      USER_LENGTH = 1,
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
  })
});