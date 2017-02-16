import * as JSData from 'js-data'
import { DS } from '../ds'

export const UserGroup:JSData.DSResourceDefinition<any>  = DS.defineResource({
  name: 'UserGroup',
  endpoint: 'user-groups',
  relations: {
    hasMany: {
      'User': {
        localField: 'users',
        foreignKey: 'groupId'
      }
    }
  }
})