import * as JSData from 'js-data'

export const UserFavorite = window.store.defineMapper('UserFavorite', {
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