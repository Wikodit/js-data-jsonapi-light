import * as JSData from 'js-data'

export const Category  = window.store.defineMapper('Category', {
  endpoint: 'categories',
  relations: {
    belongsTo: {
      'Category': {
        localField: 'parent',
        foreignKey: 'parentId'
      }
    },
    hasMany: {
      'Category': {
        localField: 'children',
        foreignKey: 'parentId'
      }
    }
  }
})