# js-data-jsonapi-light

## Overview

JsonAPI Adapter based on [js-data-http](https://github.com/js-data/js-data-http) for [js-data](http://www.js-data.io)

This adapter just add a light serialize and deserialize layer over DSHttpAdapter.

For a more complete integration, you could use: [js-data-jsonapi](https://github.com/BlairAllegroTech/js-data-jsonapi)

## Quick Start

`npm install --save js-data js-data-http js-data-jsonapi`

Load `js-data-jsonapi-light.js` last.

```js
const jsonApiAdapter = new JSDataJsonApiLight.DSJsonApiLightAdapter({
  // Same options as DSHttpAdapter
  // If a serialization option is given, it will be run before JSONApi serialization has occured
  // If a deserialization option is given, it will be run after JSONApi deserialization has occured
});

const DS = new JSData.DS();
DS.registerAdapter('jsonApi', jsonApiAdapter, { default: true })
```


## Development Status

### Version

0.0.1-alpha.1

### What is done

* Deserialization, supporting hasMany, hasOne, belongsTo relationships

### What is remaining

* Serialization

## License

The MIT Licence (MIT)

Copyright (c) 2017 WIKODIT SAS

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.