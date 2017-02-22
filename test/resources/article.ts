import * as JSData from 'js-data'

export const Article  = window.store.defineMapper('Article', {
  endpoint: 'articles',
  relations: {
    belongsTo: {
      'User': {
        localField: 'author',
        localKey: 'authorId'
      }
    }
    // ,
    // hasMany: {
    //   'UserFavorite': {
    //     localField: 'followers',
    //     foreignKey: 'articleId'
    //   }
    // }
  }
})