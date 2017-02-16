import JSData = require('js-data');
import DSHttpAdapter = require('js-data-http');

const DSUtils:any = JSData.DSUtils;

export class DSJsonApiLightAdapter extends DSHttpAdapter implements JSData.IDSAdapter {
  adapter: JSData.IDSAdapter;

  constructor(options?:any) {
    if (!options) {
      options = {};
    }

    if (options.serialize) {
      options.beforeSerialize = options.serialize
    }

    if (options.deserialize) {
      options.afterDeserialize = options.deserialize
    }

    var selfWrapper:any = {};

    options.serialize = function(wrapper:any):any{
      return function(){
        return wrapper.self.jsonApiSerialize.apply(wrapper.self, arguments);
      }
    }(selfWrapper);

    options.deserialize = function(wrapper:any):any{
      return function(){
        return wrapper.self.jsonApiDeserialize.apply(wrapper.self, arguments);
      }
    }(selfWrapper);

    super(options);

    selfWrapper.self = this;
  }

  private warn(...args:any[]) {
    console.warn.apply(null, arguments);
    return;
  }
  
  public jsonApiSerialize(resourceConfig:any, res:any){
    // console.log('Serialize: ', resourceConfig, res);
    
    return res.data;
  }
  
  public jsonApiDeserialize(resourceConfig:any, res:any){
    // console.log('Deserialize: ', resourceConfig, res);
    
    if (!res.data || !res.data.data) return;

    const collectionReceived = DSUtils.isArray(res.data.data)

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
      let resource = resourceConfig.getResource(type);
      if (!resource) { this.warn(`Can\'t find resource '${type}'`); continue; }

      // Just cache a pointer to relations for the Resource
      if (!resource.relationByFields) {
        resource.relationByFields = {};
        for (let i = 0, l = (resource.relationList || []).length; i < l; i++ ) {
          let field:string = resource.relationList[i].localField;
          if (!field) { this.warn('localField missing'); continue; }
          resource.relationByFields[field] = resource.relationList[i];
        }
      }

      for (let id in itemsIndexed[type]) {
        let item:any = itemsIndexed[type][id];
        item.attributes[resource.idAttribute] = id;

        if (!item.relationships || !Object.keys(item.relationships)) continue;

        for (let relationField in (item.relationships || {})) {
          let relation:any = resource.relationByFields[relationField]
          if (!relation) {
            this.warn('Server has relationship client has not.');
            continue;
          }

          if (relation.type === 'belongsTo' || relation.type === 'hasOne') {
            let link:any = item.relationships[relationField].data
            if (!DSUtils.isObject(link)) {
              this.warn('Wrong relation somewhere, object expected');
              continue;
            }

            if (itemsIndexed[link.type] && itemsIndexed[link.type][link.id]) {
              let itemLinked:any = itemsIndexed[link.type][link.id];
              item.attributes[relation.localField] = itemLinked.attributes;
            }
          } else if (relation.type === 'hasMany') {
            let links:any = item.relationships[relationField].data
            if (!DSUtils.isArray(links)) {
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

    if (!collectionReceived) {
      // console.log('lolilol', res.data.data.attributes);
      return res.data.data.attributes;
    }


    let outputDatas:Array<any> = [];
    for (let i = 0, l = res.data.data.length; i < l; i++) {
      outputDatas.push(res.data.data[i].attributes);
    }

    // console.log(outputDatas);
    return outputDatas;
  }
}