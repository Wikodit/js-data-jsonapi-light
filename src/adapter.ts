import { utils, DataStore, Mapper } from 'js-data';
import { HttpAdapter } from 'js-data-http';
import { Adapter } from 'js-data-adapter';
import { jsonApiDeserialize, wrapDeserialize } from './deserializer';
import { jsonApiSerialize, wrapSerialize } from './serializer';
import { ERROR } from './strings';

export class JsonApiAdapter extends HttpAdapter{
  private options: any;

  constructor(options?:any) {
    options = utils.deepMixIn({
      // Some default
    }, options || {})

    if (options.serialize || options.deserialize) {
      throw new Error(ERROR.PREVENT_SERIALIZE_DESERIALIZE_OPTIONS)
    }

    super(options);

    this.options = options;

    this.serialize = wrapSerialize(this);
    this.deserialize = wrapDeserialize(this);
  }
  
  private warn(...args:any[]) {
    console.warn.apply(null, arguments);
    return;
  }

  private handleResponse (opts?:any) { return function (response:any): Promise<any> {
    if (opts && opts.raw) {
      response.meta = response.data.meta;
      response.data = response.data.result;
    }

    // @todo #6 need to handle errors here

    return response;
  }}

  private handleBeforeLifecycle (opts?:any): Promise<void> {
    if(opts && (opts.serialize || opts.deserialize)) {
      return Promise.reject(new Error(ERROR.PREVENT_SERIALIZE_DESERIALIZE_OPTIONS))
    }

    return Promise.resolve();
  }

  public find(mapper: Mapper, id: string | number, opts?: any): Promise<any> {
    return this.handleBeforeLifecycle(opts).then(() => {
      return HttpAdapter.prototype.find.call(this, mapper, id, opts);
    }).then(this.handleResponse(opts));
  }  
  
  public findAll(mapper: Mapper, query?: any, opts?: any): Promise<any> {
    return this.handleBeforeLifecycle(opts).then(() => {
      return HttpAdapter.prototype.findAll.call(this, mapper, query, opts);
    }).then(this.handleResponse(opts));
  }

  public create(mapper: Mapper, props: any, opts?: any): Promise<any> {
    return this.handleBeforeLifecycle(opts).then(() => {
      return HttpAdapter.prototype.create.call(this, mapper, props, opts);
    }).then(this.handleResponse(opts))
  }

  public update(mapper: Mapper, id: any, props: any, opts?: any): Promise<any> {
    // Ensure id is properly set
    props[mapper.idAttribute] = id;

    // If we don't force the replace, then we will attempt to only update what
    // has been changed through PATCH
    if (!opts.forceReplace) {
      // opts has the finaly say over the method used
      opts.method = opts.method || 'patch';
      
      // We need the record to get changes
      let record = (<any>mapper).datastore.get(mapper.name, id);
      if (record) {
        // Now we have two possible cases :
        // * either props contain parameters the user want to update, and only
        //   those should be updated
        // * or when record is saved, props contains all data from the record
        //   even unchanged data
        // So we can't use record.changes(), because if first case it will be
        // empty or with not the data we want to send. Thus we can do the same
        // things the changes method do, but with props rather than with 
        // current attributes.
        
        // opts.changes = record.changes();
        opts.changes = utils.diffObjects(props, record._get('previous'), opts);
      }
    }

    return this.handleBeforeLifecycle(opts).then(() => {
      return HttpAdapter.prototype.update.call(this, mapper, id, props, opts)
    }).then(this.handleResponse(opts))
  }

  public destroy(mapper: Mapper, id: string | number, opts?: any): Promise<any> {
    return this.handleBeforeLifecycle(opts).then(() => {
      return HttpAdapter.prototype.destroy.call(this, mapper, id, opts);
    }).then(this.handleResponse(opts))
  }

  // Unsupported methods
  public createMany(mapper: Mapper, props: any, opts?: any): Promise<any> {
    return Promise.reject(new Error(ERROR.NO_BATCH_CREATE));
  }

  public updateAll(mapper: Mapper, props: any, query: any, opts?: any): Promise<any> {
    return Promise.reject(new Error(ERROR.NO_BATCH_UPDATE));
  }

  public updateMany(mapper: Mapper, records: any, opts?: any): Promise<any> {
    return Promise.reject(new Error(ERROR.NO_BATCH_UPDATE));
  }

  public destroyAll(mapper: Mapper, query: any, opts?: any): Promise<any> {
    return Promise.reject(new Error(ERROR.NO_BATCH_DESTROY));
  }
}