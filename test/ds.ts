/// <reference path="../typings/karma.d.ts" />

import { DataStore, utils, Collection } from 'js-data'

declare var JSData:any;
declare var JSDataJsonApiLight:any;

if (!window.store) {
  window.store = new DataStore({
    // addToCache: JSDataJsonApiLight.JSDataOverride.addToCache,
    // mapperWrap: JSDataJsonApiLight.JSDataOverride.mapperWrap
  });
}

export const store = window.store

const jsonApiAdapter = new JSDataJsonApiLight.JsonApiAdapter({
  suffix: '.json',
  basePath: 'api',
  store: store
});

store.registerAdapter('jsonApi', jsonApiAdapter, { default: true })

afterEach(function(){
  // utils.forOwn(store._collections, (collection:Collection, name:string) => {
  //   collection.removeAll({});
    
  //   (<any>store._completedQueries)[name] = {};
  // });
  (<any>store).clear()
})