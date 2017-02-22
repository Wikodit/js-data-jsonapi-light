/// <reference path="../typings/main.d.ts" />

import { utils, DataStore, Mapper } from 'js-data';
import { HttpAdapter } from 'js-data-http';
import { Adapter } from 'js-data-adapter';

// export class JSDataOverride {
//   addToCache (name:any, result:any, options?:any) {
    
//   }

//   mapperWrap (data:any, options?:any) {
//     console.log('MapperWrap options', options)
//     return data
//   }
// }

export class JsonApiAdapter extends HttpAdapter{
  adapter: Adapter;
  private store: DataStore;

  constructor(options?:any) {
    options = utils.deepMixIn({
      // Enable the possibility to retrieve more informations in the promise of
      // a response.
      // compositePromiseResponse: false
    }, options || {})

    if (!options.store) {
      throw new Error('JsonApiAdapter needs to be given a store option.')
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
    this.store = options.store;
  }

  private warn(...args:any[]) {
    console.warn.apply(null, arguments);
    return;
  }
  
  public jsonApiSerialize(resourceConfig:Mapper, data:any){
    // console.log('Serialize: ', resourceConfig, res);
    
    console.log(data)

    return data;
  }
  
  public jsonApiDeserialize(mapper:Mapper, res:any, options:any){
    // console.log('Deserialize: ', resourceConfig, res);
    
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
            if (!utils.isObject(link)) {
              this.warn('Wrong relation somewhere, object expected');
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

  // public HTTP(options?: any): JSData.JSDataPromise<JSData.DSHttpAdapterPromiseResolveType> {
  //   let compositeResponse = (<any>this.defaults).compositePromiseResponse;
  //   if(options.compositePromiseResponse !== undefined)
  //     compositeResponse = options.compositePromiseResponse;

  //   return super.HTTP(options).then((response: any) => {
  //     return response;
  //   }).catch((err: any) => {
  //     return <any>Promise.reject(err);
  //   })
  // }

  // private handleError(config: JSData.DSResourceDefinition<any>, options: JSData.DSConfiguration, error:any) {
  //   return error;
  // }

  // public findAll(config: JSData.DSResourceDefinition<any>, params?: JSData.DSFilterArg, options?: JSData.DSConfiguration): JSData.JSDataPromise<any> {
  //   return super.findAll(config, params, options).catch(
  //     (error: any) => {
  //       return Promise.reject(this.handleError(config, options, error));
  //     }
  //   ).then((data:any) => {
  //     return Promise.resolve({data:data, meta: 'lol'})
  //   });
  // }
}