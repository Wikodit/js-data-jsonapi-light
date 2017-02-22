import * as JSData from 'js-data';
// import * as JSDataJsonApiLight from '../dist/js-data-jsonapi-light';

declare global {
  interface Window {
    JSData: any;
    store: JSData.DataStore;
    JSDataJsonApiLight: any;
    Promise: PromiseConstructorLike;
  }
}