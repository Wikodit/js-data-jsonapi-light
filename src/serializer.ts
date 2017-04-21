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

  let output:any = { data: { type: mapper.name } };

  // Work for update or create, if an id is given, server should accept it
  if (id) output.data.id = id;

  let relationships:any = {};
  let attributes:any = {};

  // opts.changes is there when update method is PATCH
  // in this case we change only what has changed
  if (!opts.forceReplace && opts.changes && id) {
    data = opts.changes.changed;
  }

  // @todo For the moment sending hasMany items is not supported and maybe
  // shouldn't be supported for security reasons (cf. JSON Api Spec)
  for (let key in data) {
    let relation:any = mapper.relationByFieldId[key];

    // No relations means a simple attribute
    if (!relation) {
      attributes[key] = data[key];
      continue;
    }

    // Relation that can be in data are only belongsTo since it has a localKey
    relationships[relation.localField] = {
      data: {
        type: relation.relation,
        id: data[key]
      }
    }
  }

  // Only include relationships if needed
  if (Object.keys(relationships).length) {
    output.data.relationships = relationships;
  }

  // Only include attributes if needed
  if (Object.keys(attributes).length !== 0) {
    output.data.attributes = attributes;
  }

  return output;
}