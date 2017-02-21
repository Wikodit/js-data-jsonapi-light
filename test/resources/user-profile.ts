import { Mapper } from 'js-data'
import { store } from '../ds'

export const UserProfile:Mapper  = store.defineMapper('UserProfile', {
  endpoint: 'user-profiles',
  relations: {
    belongsTo: {
      'User': {
        localField: 'user',
        localKey: 'userId'
      }
    }
  }
})