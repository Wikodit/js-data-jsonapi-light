import * as JSData from 'js-data'

export const CompanyUser  = (<any>window).store.defineMapper('CompanyUser', {
  endpoint: 'company-users',
  relations: {
    belongsTo: {
      'Company': {
        foreignKey: 'companyId',
        localField: 'company'
      },
      'User': {
        foreignKey: 'userId',
        localField: 'user'
      }
    },
  }
})