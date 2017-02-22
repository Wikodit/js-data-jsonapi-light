import * as JSData from 'js-data';
import { HttpAdapter } from 'js-data-http';
import { Adapter } from 'js-data-adapter';

export interface JsonApiA2dapter extends HttpAdapter {
  store: any;
  warn: (message?: any, ...optionalParams: any[]) => void;
}

export interface DSJsonApiLightResponse {
  data: Array<any> | any;
  meta: any;
}