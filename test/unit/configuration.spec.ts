import { expect, assert } from 'chai';
import { DataStore, utils, Collection } from 'js-data'

declare var JSData:any;
declare var JSDataJsonApiLight:any;

describe('Configuration :', () => {
  it('should throw an error if store is not given as adapter property', () => {
    assert.throws(() => {
      new JSDataJsonApiLight.JsonApiAdapter()
    }, Error, 'JsonApiAdapter needs to be given a store option.')
  })
});