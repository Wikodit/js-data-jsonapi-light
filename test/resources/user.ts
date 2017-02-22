import * as JSData from 'js-data'
import { store } from '../ds'

export const User = store.defineMapper('User',{
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
      // ,
      // 'UserFavorite': {
      //   localField: 'favorites',
      //   foreignKey: 'articleId'
      // }
    },
    belongsTo: {
      'UserGroup': {
        localField: 'group',
        localKey: 'groupId'
      }
    }
  }
})