import { mapperCacheRelationByField } from './utils';

export function wrapSerialize (self:any):any{
  return function(mapper:any, data:any, opts:any){
    let 
      beforeSerialize = opts.beforeSerialize || mapper.beforeSerialize || self.options.beforeSerialize,
      afterSerialize = opts.afterSerialize || mapper.afterSerialize || self.options.afterSerialize;
    
    if (beforeSerialize) data = beforeSerialize.call(self, mapper, data, opts);
    data = jsonApiSerialize.call(self, mapper, data, opts);
    if (afterSerialize) data = afterSerialize.call(self, mapper, data, opts);
    return data;
  }
}

export function jsonApiSerialize (mapper:any, data:any, opts:any){
  let id:any = data[mapper.idAttribute];
  delete data[mapper.idAttribute];
  
  // Just cache a pointer to relations for the Resource
  mapperCacheRelationByField(mapper);

  let relationships:any = {}

  for (let key in data) {
    let relation:any = mapper.relationByFieldId[key];
    if (relation) {
      relationships[relation.localField] = {
        data: {
          type: relation.relation,
          id: data[key]
        }
      }
      delete data[key]
    }
  }

  let output:any = {
    data: {
      type: mapper.name,
      attributes: data
    }
  }

  // Work for update or create, if an id is given, server should accept it
  if (id) output.data.id = id;
  if (Object.keys(relationships)) output.data.relationships = relationships;

  return output;
}