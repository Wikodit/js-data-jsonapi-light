import { mapperCacheRelationByField } from './utils';
import { utils, Mapper } from 'js-data';

export function wrapDeserialize(self:any):any{
  return function(mapper:any, res:any, opts:any){
    let 
      beforeDeserialize = opts.beforeDeserialize || mapper.beforeDeserialize || self.options.beforeDeserialize,
      afterDeserialize = opts.afterDeserialize || mapper.afterDeserialize || self.options.afterDeserialize;
    
    if (beforeDeserialize) res = beforeDeserialize.call(self, mapper, res, opts);
    res = jsonApiDeserialize.call(self, mapper, res, opts);
    if (afterDeserialize) res = afterDeserialize.call(self, mapper, res, opts);
    return res;
  }
}

export function jsonApiDeserialize(mapper:Mapper, res:any, opts:any){
  if (!res.data || !res.data.data) return;

  const collectionReceived = utils.isArray(res.data.data)

  // We store all possible items stores in the response in a Object[type][id]
  // structure
  let itemsIndexed:any = {};
  let itemCollection:Array<any> = [].concat(res.data.included || [])
                                    .concat(res.data.data || []);

  let i = itemCollection.length;
  while (i--) {
    let item:any = itemCollection[i]
    if (!item.type || !item.id) {
      //@warn
      // Just remove it so that we don't need to deal with it later
      itemCollection.splice(i, 1);
      continue;
    }

    if (!itemsIndexed[item.type]) itemsIndexed[item.type] = {};
    itemsIndexed[item.type][item.id] = item;
  }

  // Know we will check every possible relationships and try to affect them
  // the correct key/id
  for (let type in itemsIndexed) {
    let resource:any = this.store.getMapper(type);
    if (!resource) { this.warn(`Can\'t find resource '${type}'`); continue; }

    // Just cache a pointer to relations for the Resource
    mapperCacheRelationByField(resource);

    for (let id in itemsIndexed[type]) {
      let item:any = itemsIndexed[type][id];
      item.attributes[resource.idAttribute] = id;

      if (!item.relationships || !Object.keys(item.relationships)) continue;

      for (let relationField in (item.relationships || {})) {
        let relation:any = resource.relationByField[relationField]
        if (!relation || !item.relationships[relationField] || !item.relationships[relationField].data) {
          continue;
        }

        if (relation.type === 'belongsTo' || relation.type === 'hasOne') {
          let link:any = item.relationships[relationField].data
          if (!utils.isObject(link)) {
            this.warn('Wrong relation somewhere, object expected', relation);
            continue;
          }

          if (itemsIndexed[link.type] && itemsIndexed[link.type][link.id]) {
            let itemLinked:any = itemsIndexed[link.type][link.id];
            item.attributes[relation.localField] = itemLinked.attributes;
          }
        } else if (relation.type === 'hasMany') {
          let links:any = item.relationships[relationField].data
          if (!utils.isArray(links)) {
            this.warn('Wrong relation somewhere, array expected');
            continue;
          }

          item.attributes[relation.localField] = [];
          for (let i = 0, l = links.length; i < l; i++) {
            let link:any = links[i];
            if (itemsIndexed[link.type] && itemsIndexed[link.type][link.id]) {
              let itemLinkd:any = itemsIndexed[link.type][link.id];
              item.attributes[relation.localField].push(itemLinkd.attributes);
            }
          }
        } else { this.warn('Unknown relation'); continue; }
      }
    }
  }

  let outputDatas:Array<any> | any;
  if (!collectionReceived) {
    outputDatas = res.data.data.attributes;
  } else {
    outputDatas = [];
    for (let i = 0, l = res.data.data.length; i < l; i++) {
      outputDatas.push(res.data.data[i].attributes);
    }
  }

  if (!opts.raw) {
    return outputDatas;
  }

  return {
    result: outputDatas,
    meta: res.data.meta
  };
}