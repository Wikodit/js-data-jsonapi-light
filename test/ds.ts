/// <reference path="../typings/karma.d.ts" />

import { DataStore, utils, Collection } from 'js-data'

declare var JSData:any;
declare var JSDataJsonApiLight:any;

if (!window.store) {
  window.store = new DataStore();
}

export const store = window.store

const jsonApiAdapter = new JSDataJsonApiLight.JsonApiAdapter({
  suffix: '.json',
  basePath: 'api',
  store: store
});

store.registerAdapter('jsonApi', jsonApiAdapter, { default: true })

afterEach(function(){
  (<any>store).clear()
})