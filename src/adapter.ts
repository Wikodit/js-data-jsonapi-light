import { utils, DataStore, Mapper } from 'js-data';
import { HttpAdapter } from 'js-data-http';
import { Adapter } from 'js-data-adapter';
import { jsonApiDeserialize, wrapDeserialize } from './deserializer';
import { jsonApiSerialize, wrapSerialize } from './serializer';
import { ERROR } from './strings';

export class JsonApiAdapter extends HttpAdapter{
  private store: DataStore;
  private options: any;

  constructor(options?:any) {
    options = utils.deepMixIn({
      // Some default
    }, options || {})

    if (!options.store) {
      throw new Error(ERROR.FORCE_STORE_OPTION)
    }

    if (options.serialize || options.deserialize) {
      throw new Error(ERROR.PREVENT_SERIALIZE_DESERIALIZE_OPTIONS)
    }

    super(options);

    this.store = options.store;
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

  public createMany(mapper: Mapper, props: any, opts?: any): Promise<any> {
    return Promise.reject(new Error('JSONApi doesn\'t support creating in batch.'));
  }

  public update(mapper: Mapper, id: any, props: any, opts?: any): Promise<any> {
    // Ensure id is properly set
    props[mapper.idAttribute] = id;

    return this.handleBeforeLifecycle(opts).then(() => {
      return HttpAdapter.prototype.update.call(this, mapper, id, props, opts)
    }).then(this.handleResponse(opts))
  }

  public updateAll(mapper: Mapper, props: any, query: any, opts?: any): Promise<any> {
    return Promise.reject(new Error('JSONApi doesn\'t support updating in batch.'));
  }

  public updateMany(mapper: Mapper, records: any, opts?: any): Promise<any> {
    return Promise.reject(new Error('JSONApi doesn\'t support updating in batch.'));
  }

  public destroy(mapper: Mapper, id: string | number, opts?: any): Promise<any> {
    return this.handleBeforeLifecycle(opts).then(() => {
      return HttpAdapter.prototype.destroy.call(this, mapper, id, opts);
    }).then(this.handleResponse(opts))
  }

  public destroyAll(mapper: Mapper, query: any, opts?: any): Promise<any> {
    return Promise.reject(new Error('JSONApi doesn\'t support destroying in batch.'));
  }
}