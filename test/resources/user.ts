import * as JSData from 'js-data'

export const User = (<any>window).store.defineMapper('User',{
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
      },
      // ,
      // 'UserFavorite': {
      //   localField: 'favorites',
      //   foreignKey: 'articleId'
      // }
      'CompanyUser': {
        localField: 'companyUsers',
        localKey: 'userId'
      },
    },
    belongsTo: {
      'UserGroup': {
        localField: 'group',
        foreignKey: 'groupId'
      }
    }
  }
})
