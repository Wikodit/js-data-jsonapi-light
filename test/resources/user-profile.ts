import * as JSData from 'js-data'
import { DS } from '../run'

export const UserProfile:JSData.DSResourceDefinition<any>  = DS.defineResource({
  name: 'UserProfile',
  endpoint: 'user-profiles',
  relations: {
    belongsTo: {
      'User': {
        localField: 'user',
        localKey: 'userId'
      }
    }
  }
})