/// <reference path="../typings/karma.d.ts" />

declare var JSData:any;
declare var JSDataJsonApiLight:any;

const jsonApiAdapter = new JSDataJsonApiLight.DSJsonApiLightAdapter({
  suffix: '.json',
  basePath: 'api'
});

export const DS = new JSData.DS();
DS.registerAdapter('jsonApi', jsonApiAdapter, { default: true })

afterEach(function(){
  DS.clear();
})