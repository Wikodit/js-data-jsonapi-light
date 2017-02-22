import * as JSData from 'js-data'
import { store } from '../ds'

export const UserFavorite = store.defineMapper('UserFavorite', {
  relations: {
    belongsTo: {
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