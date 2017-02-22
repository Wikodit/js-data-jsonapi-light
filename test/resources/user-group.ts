import * as JSData from 'js-data'

export const UserGroup  = window.store.defineMapper('UserGroup', {
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