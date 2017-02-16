import * as JSData from 'js-data'
import { DS } from '../ds'

export const User:JSData.DSResourceDefinition<any> = DS.defineResource({
  name: 'User',
  endpoint: 'users',
  relations: {
    hasOne: {
      'UserProfile': {
        localField: 'profile',
        foreignKey: 'userId'
      }
    },
    hasMany: {
      'Article': {
        localField: 'articles',
        foreignKey: 'authorId'
      }
    },
    belongsTo: {
      'UserGroup': {
        localField: 'group',
        localKey: 'groupId'
      }
    }
  }
})