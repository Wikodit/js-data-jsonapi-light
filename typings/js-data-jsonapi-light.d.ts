import * as JSData from 'js-data';

declare module JSDataJsonApiLight {
  export interface DSJsonApiLightAdapter extends JSData.DSHttpAdapter {
    warn: (message?: any, ...optionalParams: any[]) => void;
  }
}