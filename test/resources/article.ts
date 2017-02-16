import * as JSData from 'js-data'
import { DS } from '../run'

export const Article:JSData.DSResourceDefinition<any>  = DS.defineResource({
  name: 'Article',
  endpoint: 'articles',
  relations: {
    belongsTo: {
      'User': {
        localField: 'author',
        localKey: 'authorId'
      }
    }
  }
})