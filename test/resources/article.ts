import * as JSData from 'js-data'
import { store } from '../ds'

export const Article  = store.defineMapper('Article', {
  endpoint: 'articles',
  relations: {
    belongsTo: {
      'User': {
        localField: 'author',
        localKey: 'authorId'
      }
    },
    hasMany: {
      'UserFavorite': {
        localField: 'followers',
        foreignKey: 'articleId'
      }
    }
  }
})