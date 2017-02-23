# js-data-jsonapi-light

[![NPM][npmB]][npmL] [![CircleCI build][circleciMB]][circleciML] [![CircleCI build develop][circleciB]][circleciL] [![Codecov][codecovB]][codecovL] [![Issues][issuesB]][issuesL]

[npmB]: https://img.shields.io/npm/v/js-data-jsonapi-light.svg?style=flat
[npmL]: https://www.npmjs.org/package/js-data-json-light
[issuesB]: https://img.shields.io/github/issues/Wikodit/js-data-jsonapi-light.svg
[issuesL]: https://github.com/Wikodit/js-data-jsonapi-light/issues
[circleciB]: https://img.shields.io/circleci/project/Wikodit/js-data-jsonapi-light/develop.svg?style=flat&label=build%20develop
[circleciL]: https://circleci.com/gh/Wikodit/js-data-jsonapi-light/tree/develop
[circleciMB]: https://img.shields.io/circleci/project/Wikodit/js-data-jsonapi-light/master.svg?style=flat&label=build%20master
[circleciML]: https://circleci.com/gh/Wikodit/js-data-jsonapi-light/tree/master
[codecovB]: https://img.shields.io/codecov/c/github/Wikodit/js-data-jsonapi-light/develop.svg?style=flat&label=coverage
[codecovL]: https://codecov.io/gh/Wikodit/js-data-jsonapi-light

## Overview

JsonAPI Adapter based on [js-data-http](https://github.com/js-data/js-data-http) for [js-data](http://www.js-data.io)

This adapter just add a light serialize and deserialize layer over DSHttpAdapter.

## Compatibility

| js-data      | >= 3.0.0-rc.7 |
| js-data-http | >= 3.0.0-rc.2 |

By design it is not compatible with JS-Data v2, for a full integration on v2, you could use: [js-data-jsonapi](https://github.com/BlairAllegroTech/js-data-jsonapi).

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
  // Store needs to be given to the adapter
  store: store

  // Same options as DSHttpAdapter
  // If a serialization option is given, it will be run before JSONApi serialization has occured
  // If a deserialization option is given, it will be run after JSONApi deserialization has occured
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


### Get JSONApi Meta

To retrieve JSONApi Meta on every call :

```js
store.findAll('User', {}, {
  raw: true
}).then((response) => {
  console.log(response.data); // Return the Records
  console.log(response.meta); // Return the JSONApi Metas
})
```

## Development Status

### Version

1.0.0-alpha.2

### What is done

* Deserialization, supporting hasMany, hasOne, belongsTo relationships
* Meta handling

### What is remaining

* Serialization
* ManyToMany
* Error handling

## License

The MIT Licence (MIT)

Copyright (c) 2017 WIKODIT SAS

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.