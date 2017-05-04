# js-data-jsonapi-light

[![NPM][npmB]][npmL] [![CircleCI build][circleciMB]][circleciML] [![CircleCI build develop][circleciB]][circleciL] [![Codecov][codecovB]][codecovL] [![Issues][issuesB]][issuesL]

[npmB]: https://img.shields.io/npm/v/js-data-jsonapi-light.svg?style=flat
[npmL]: https://www.npmjs.org/package/js-data-jsonapi-light
[issuesB]: https://img.shields.io/github/issues/Wikodit/js-data-jsonapi-light.svg
[issuesL]: https://github.com/Wikodit/js-data-jsonapi-light/issues
[circleciB]: https://img.shields.io/circleci/project/Wikodit/js-data-jsonapi-light/develop.svg?style=flat&label=develop
[circleciL]: https://circleci.com/gh/Wikodit/js-data-jsonapi-light/tree/develop
[circleciMB]: https://img.shields.io/circleci/project/Wikodit/js-data-jsonapi-light/master.svg?style=flat&label=master
[circleciML]: https://circleci.com/gh/Wikodit/js-data-jsonapi-light/tree/master
[codecovB]: https://img.shields.io/codecov/c/github/Wikodit/js-data-jsonapi-light/develop.svg?style=flat&label=coverage
[codecovL]: https://codecov.io/gh/Wikodit/js-data-jsonapi-light

## Overview

JsonAPI Adapter based on [js-data-http](https://github.com/js-data/js-data-http) for [js-data](http://www.js-data.io)

This adapter just add a light serialize and deserialize layer over DSHttpAdapter.

## Compatibility

| package      | requirement   |
| ------------ | ------------- |
| js-data      | >= 3.0.0-rc.7 |
| js-data-http | >= 3.0.0-rc.2 |

By design it is not compatible with JS-Data v2, for a full integration on v2, you should use: [js-data-jsonapi](https://github.com/BlairAllegroTech/js-data-jsonapi).

## Quick Start

First you need to install everything needed :

`npm install --save js-data js-data-http js-data-jsonapi js-data-jsonapi-light`

Load `js-data-jsonapi-light.js` last.

```js
import { DataStore } from 'js-data'
// or `var DataStore = JSDate.DataStore`

import { JsonApiAdapter } from 'js-data-jsonapi-light'
// or `var JsonApiAdapter = JSDataJsonApiLight.JsonApiAdapter`

// Initialize our Store
const store = new DataStore();

// Initialize our Adapter
const jsonApiAdapter = new JsonApiAdapter({
  // Same options as DSHttpAdapter
  // However, you should use before/after deserialize/serialize instead of serialize/deserialize
});

// Register the Adapter as the default one in the store
store.registerAdapter('jsonApi', jsonApiAdapter, { default: true })
```

## Exemples

### Use case

* You can find examples of Mapper Definitions in [test/resources](https://github.com/Wikodit/js-data-jsonapi-light/tree/develop/test/resources).
* Fake JsonAPI responses corresponding to those mapper can be found in [test/api](https://github.com/Wikodit/js-data-jsonapi-light/tree/develop/test/api)
* Bootstrap of JSData + JsonAPI could be found in [test/ds](https://github.com/Wikodit/js-data-jsonapi-light/tree/develop/test/ds.ts)
* Exemple of use could be found in [test/unit](https://github.com/Wikodit/js-data-jsonapi-light/tree/develop/test/unit)

### Define your mappers

JSData works with mappers which define the communication part and the way your resources are linked together

```
const UserMapper = window.store.defineMapper('User',{
  endpoint: 'users', // optional, it will default to `User`
  relations: {
    hasOne: {
      'UserProfile': {
        localField: 'profile',
        foreignKey: 'userId'
      }
    },
    hasMany: {
      'Article': {
        localField: 'articles',
        foreignKey: 'authorId'
      }
    },
    belongsTo: {
      'UserGroup': {
        localField: 'group',
        localKey: 'groupId'
      }
    }
  }
})
```

### Fetch your data

```
UserMapper.findAll({ include: 'profile' }).then((records) => {
  console.log(records);
})
```

Once some records has been loaded they are also cached in the DataStore, you can access them synchronously with :
```
records = store.getAll('User')
```

### Hooks

Sometime you want to be able to do some custom additional serialization / deserialization.

#### By using the adapter

```js
  const jsonApiAdapter = new JsonApiAdapter({
    beforeDeserialize: function(mapper, data, opts) { return data; }
    afterDeserialize: function(mapper, data, opts) { return data; }
    beforeSerialize: function(mapper, data, opts) { return data; }
    afterSerialize: function(mapper, data, opts) { return data; }
  });
```

#### By using the mapper

```js
  const UserMapper = store.defineMapper('User', {
    beforeDeserialize: function(mapper, data, opts) { return data; }
    afterDeserialize: function(mapper, data, opts) { return data; }
    beforeSerialize: function(mapper, data, opts) { return data; }
    afterSerialize: function(mapper, data, opts) { return data; }
  });
```

#### When doing requests

```js
  store.findAll('User', {}, {
    beforeDeserialize: function(mapper, data, opts) { return data; }
    afterDeserialize: function(mapper, data, opts) { return data; }
  });

  store.update('User', {}, {
    beforeSerialize: function(mapper, data, opts) { return data; }
    afterSerialize: function(mapper, data, opts) { return data; }
  });
```

## Options

### Adapter options

#### `beforeDeserialize`, `afterDeserialize`, `beforeSerialize`, `afterSerialize`

Deserialization and serialization hooks, see above.

### CRUD methods options

#### `raw: boolean`

Send back raw response

Eg. To retrieve JSONApi Meta :

```js
store.findAll('User', {}, {
  raw: true
}).then((response) => {
  console.log(response.data); // Return the Records
  console.log(response.meta); // Return the JSONApi Metas
})
```

* Compatible with: `all`

#### `forceReplace: boolean(false)`

On update, force all fields to be sent even if they haven't been changed.
It will switch from default PATCH http verb to PUT.

If some properties are passed to the update, only those will be sent. Those who has not changed compared to the record original properties will not be sent.
Be careful, because it means, once the update made, the server will return saved datas, and it will erased possible properties that were changed on the record but not given to the update. Nothing wrong with that, it's the correct behavior, but you should know about this logic.

* Compatible with: `update`, `save`

#### `forceRelationshipsInAttributes: boolean(false)`

On update, force all relationships data to be sent using `attributes` structure instead of default `relationships` within the resource object.
Note it is not JsonAPI compliant, it is a convenient option to support some specific backends.

* See #23
* Compatible with: `update`, `save`

#### `beforeDeserialize`, `afterDeserialize`, `beforeSerialize`, `afterSerialize`

Deserialization and serialization hooks, see above.

## Development Status

### What is done

* Deserialization, supporting hasMany, hasOne, belongsTo relationships
* Meta handling
* Serialization
* Custom hooks
* By default update PATCH changes instead of PUT the record

### What is remaining

* ManyToMany
* Error handling

## License

The MIT Licence (MIT)

Copyright (c) 2017 WIKODIT SAS

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.