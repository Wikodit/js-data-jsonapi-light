import { DataStore } from 'js-data'

declare var JSData:any;
declare var JSDataJsonApiLight:any;

export const store = new DataStore({
  // addToCache: JSDataJsonApiLight.JSDataOverride.addToCache,
  // mapperWrap: JSDataJsonApiLight.JSDataOverride.mapperWrap
});

const jsonApiAdapter = new JSDataJsonApiLight.JsonApiAdapter({
  suffix: '.json',
  basePath: 'api',
  store: store
});

store.registerAdapter('jsonApi', jsonApiAdapter, { default: true })

// afterEach(function(){
//   DS.clear()
// })