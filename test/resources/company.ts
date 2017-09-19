import * as JSData from 'js-data'

export const Company  = (<any>window).store.defineMapper('Company', {
  endpoint: 'companies',
  relations: {
    hasMany: {
      'CompanyUser': {
        foreignKey: 'companyId',
        localField: 'companyUsers'
      }
    },
  }
})