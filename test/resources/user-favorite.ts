import * as JSData from 'js-data'

export const UserFavorite = window.store.defineMapper('UserFavorite', {
  relations: {
    belongsTo: {
      'Article': {
        localField: 'article',
        foreignKey: 'articleId'
      },
      'User': {
        localField: 'user',
        foreignKey: 'userId'
      }
    }
  }
})