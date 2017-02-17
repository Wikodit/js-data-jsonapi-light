import * as JSData from 'js-data'
import { DS } from '../ds'

export const User:JSData.DSResourceDefinition<any> = DS.defineResource({
  name: 'UserFavorite',
  relations: {
    hasMany: {
      'Article': {
        localField: 'article',
        localKey: 'articleId'
      },
      'User': {
        localField: 'user',
        localKey: 'userId'
      }
    }
  }
})