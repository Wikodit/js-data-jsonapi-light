import * as JSData from 'js-data';
import * as JSDataJsonApiLight from './js-data-jsonapi-light';
import * as Promise from 'bluebird';

declare global {
  interface Window {
    JSData: any;
    DS: JSData.DS;
    JSDataJsonApiLight: any;
    Promise: PromiseConstructorLike;
  }
}