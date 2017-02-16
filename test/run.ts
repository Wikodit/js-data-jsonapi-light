declare var JSData:any;
declare var JSDataJsonApiLight:any;

import * as Promise from 'bluebird';
window.Promise = Promise

JSData.DSUtils.Promise = Promise;

const jsonApiAdapter = new JSDataJsonApiLight.DSJsonApiLightAdapter({
  suffix: '.json',
  basePath: 'api'
});

export const DS = new JSData.DS();
DS.registerAdapter('jsonApi', jsonApiAdapter, { default: true })

afterEach(function(){
  DS.clear();
})