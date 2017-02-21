import * as JSData from 'js-data'
import { store } from '../ds'

export const UserGroup  = store.defineMapper('UserGroup', {
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