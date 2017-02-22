import { Mapper } from 'js-data'

export const UserProfile  = window.store.defineMapper('UserProfile', {
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