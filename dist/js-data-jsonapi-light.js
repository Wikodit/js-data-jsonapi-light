(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("js-data"), require("js-data-http"));
	else if(typeof define === 'function' && define.amd)
		define(["js-data", "js-data-http"], factory);
	else if(typeof exports === 'object')
		exports["JSDataJsonApiLight"] = factory(require("js-data"), require("js-data-http"));
	else
		root["JSDataJsonApiLight"] = factory(root["JSData"], root["JSDataHttp"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_6__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR = {
    "FORCE_STORE_OPTION": "JsonApiAdapter needs to be given a store option.",
    "PREVENT_SERIALIZE_DESERIALIZE_OPTIONS": "You can not use deserialize and serialize options with this adapter, you should instead provide an afterSerialize, a beforeSerialize, an afterDeserialize or a beforeDeserialize.",
    NO_BATCH_CREATE: 'JSONApi doesn\'t support creating in batch.',
    NO_BATCH_UPDATE: 'JSONApi doesn\'t support updating in batch.',
    NO_BATCH_DESTROY: 'JSONApi doesn\'t support destroying in batch.'
};
exports.WARNING = {
    NO_RESSOURCE: function (type) { return "Can't find resource '" + type + "'"; },
    RELATION_UNKNOWN: 'Unknown relation',
    WRONG_RELATION_ARRAY_EXPECTED: 'Wrong relation somewhere, array expected',
    WRONG_RELATION_OBJECT_EXPECTED: 'Wrong relation somewhere, object expected',
    NO_FOREIGN_KEY: 'No `foreignKey` on this relation. Be careful `localKey` doesn\'t exist anymore on JSData v3 and has been replaced with `foreignKey`. `belongsTo` relations must have a `foreignKey`.'
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var strings_1 = __webpack_require__(0);
function mapperCacheRelationByField(mapper) {
    if (!mapper.relationByField || !mapper.relationByFieldId) {
        mapper.relationByField = {};
        mapper.relationByFieldId = {};
        for (var i = 0, l = (mapper.relationList || []).length; i < l; i++) {
            var field = mapper.relationList[i].localField;
            if (mapper.relationList[i].type === 'belongsTo') {
                var key = mapper.relationList[i].foreignKey;
                if (!mapper.relationList[i].foreignKey) {
                    this.warn(strings_1.WARNING.NO_FOREIGN_KEY, mapper.relationList[i]);
                }
                else {
                    mapper.relationByFieldId[key] = mapper.relationList[i];
                }
            }
            if (field) {
                mapper.relationByField[field] = mapper.relationList[i];
            }
            else {
                this.warn('localField missing');
                continue;
            }
        }
    }
}
exports.mapperCacheRelationByField = mapperCacheRelationByField;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var js_data_1 = __webpack_require__(1);
var js_data_http_1 = __webpack_require__(6);
var deserializer_1 = __webpack_require__(4);
var serializer_1 = __webpack_require__(5);
var strings_1 = __webpack_require__(0);
var JsonApiAdapter = (function (_super) {
    __extends(JsonApiAdapter, _super);
    function JsonApiAdapter(options) {
        var _this = this;
        options = js_data_1.utils.deepMixIn({}, options || {});
        if (options.serialize || options.deserialize) {
            throw new Error(strings_1.ERROR.PREVENT_SERIALIZE_DESERIALIZE_OPTIONS);
        }
        _this = _super.call(this, options) || this;
        _this.options = options;
        _this.serialize = serializer_1.wrapSerialize(_this);
        _this.deserialize = deserializer_1.wrapDeserialize(_this);
        return _this;
    }
    JsonApiAdapter.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.warn.apply(null, arguments);
        return;
    };
    JsonApiAdapter.prototype.handleResponse = function (opts) {
        return function (response) {
            if (opts && opts.raw) {
                response.rawData = response.data.rawData;
                response.meta = response.data.meta;
                response.data = response.data.result;
            }
            return response;
        };
    };
    JsonApiAdapter.prototype.handleBeforeLifecycle = function (opts) {
        if (opts && (opts.serialize || opts.deserialize)) {
            return Promise.reject(new Error(strings_1.ERROR.PREVENT_SERIALIZE_DESERIALIZE_OPTIONS));
        }
        return Promise.resolve();
    };
    JsonApiAdapter.prototype.find = function (mapper, id, opts) {
        var _this = this;
        return this.handleBeforeLifecycle(opts).then(function () {
            return js_data_http_1.HttpAdapter.prototype.find.call(_this, mapper, id, opts);
        }).then(this.handleResponse(opts));
    };
    JsonApiAdapter.prototype.findAll = function (mapper, query, opts) {
        var _this = this;
        return this.handleBeforeLifecycle(opts).then(function () {
            return js_data_http_1.HttpAdapter.prototype.findAll.call(_this, mapper, query, opts);
        }).then(this.handleResponse(opts));
    };
    JsonApiAdapter.prototype.create = function (mapper, props, opts) {
        var _this = this;
        return this.handleBeforeLifecycle(opts).then(function () {
            return js_data_http_1.HttpAdapter.prototype.create.call(_this, mapper, props, opts);
        }).then(this.handleResponse(opts));
    };
    JsonApiAdapter.prototype.update = function (mapper, id, props, opts) {
        var _this = this;
        props[mapper.idAttribute] = id;
        if (!opts.forceReplace) {
            opts.method = opts.method || 'patch';
            var record = mapper.datastore.get(mapper.name, id);
            if (record) {
                opts.changes = js_data_1.utils.diffObjects(props, record._get('previous'), opts);
            }
        }
        return this.handleBeforeLifecycle(opts).then(function () {
            return js_data_http_1.HttpAdapter.prototype.update.call(_this, mapper, id, props, opts);
        }).then(this.handleResponse(opts));
    };
    JsonApiAdapter.prototype.destroy = function (mapper, id, opts) {
        var _this = this;
        return this.handleBeforeLifecycle(opts).then(function () {
            return js_data_http_1.HttpAdapter.prototype.destroy.call(_this, mapper, id, opts);
        }).then(this.handleResponse(opts));
    };
    JsonApiAdapter.prototype.createMany = function (mapper, props, opts) {
        return Promise.reject(new Error(strings_1.ERROR.NO_BATCH_CREATE));
    };
    JsonApiAdapter.prototype.updateAll = function (mapper, props, query, opts) {
        return Promise.reject(new Error(strings_1.ERROR.NO_BATCH_UPDATE));
    };
    JsonApiAdapter.prototype.updateMany = function (mapper, records, opts) {
        return Promise.reject(new Error(strings_1.ERROR.NO_BATCH_UPDATE));
    };
    JsonApiAdapter.prototype.destroyAll = function (mapper, query, opts) {
        return Promise.reject(new Error(strings_1.ERROR.NO_BATCH_DESTROY));
    };
    return JsonApiAdapter;
}(js_data_http_1.HttpAdapter));
exports.JsonApiAdapter = JsonApiAdapter;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(2);
var js_data_1 = __webpack_require__(1);
var strings_1 = __webpack_require__(0);
function wrapDeserialize(self) {
    return function (mapper, res, opts) {
        var beforeDeserialize = opts.beforeDeserialize || mapper.beforeDeserialize || self.options.beforeDeserialize, afterDeserialize = opts.afterDeserialize || mapper.afterDeserialize || self.options.afterDeserialize;
        if (beforeDeserialize)
            res = beforeDeserialize.call(self, mapper, res, opts);
        res = jsonApiDeserialize.call(self, mapper, res, opts);
        if (afterDeserialize)
            res = afterDeserialize.call(self, mapper, res, opts);
        return res;
    };
}
exports.wrapDeserialize = wrapDeserialize;
function jsonApiDeserialize(mapper, res, opts) {
    if (!res.data || !res.data.data)
        return;
    var store = mapper.datastore;
    var collectionReceived = js_data_1.utils.isArray(res.data.data);
    var itemsIndexed = {};
    var itemCollection = [].concat(res.data.included || []);
    var i = itemCollection.length;
    while (i--) {
        var item = itemCollection[i];
        if (!item.type || !item.id) {
            itemCollection.splice(i, 1);
            continue;
        }
        if (!itemsIndexed[item.type])
            itemsIndexed[item.type] = {};
        itemsIndexed[item.type][item.id] = item;
    }
    var fullCollection = [].concat(res.data.included || [])
        .concat(res.data.data || []);
    for (var i_1 = fullCollection.length; i_1--;) {
        var item = fullCollection[i_1];
        var id = item.id, type = item.type;
        if (!type || !id)
            continue;
        var resource = store.getMapper(type);
        if (!resource) {
            this.warn(strings_1.WARNING.NO_RESSOURCE(type));
            continue;
        }
        utils_1.mapperCacheRelationByField(resource);
        item.attributes[resource.idAttribute] = id;
        if (!item.relationships || !Object.keys(item.relationships))
            continue;
        for (var relationField in (item.relationships || {})) {
            var relation = resource.relationByField[relationField];
            if (!relation || !item.relationships[relationField] || !item.relationships[relationField].data) {
                continue;
            }
            if (relation.type === 'belongsTo' || relation.type === 'hasOne') {
                var link = item.relationships[relationField].data;
                if (!js_data_1.utils.isObject(link)) {
                    this.warn(strings_1.WARNING.WRONG_RELATION_OBJECT_EXPECTED, relation);
                    continue;
                }
                if (relation.type === 'belongsTo') {
                    if (!relation.foreignKey) {
                        this.warn(strings_1.WARNING.NO_FOREIGN_KEY, relation);
                    }
                    else {
                        item.attributes[relation.foreignKey] = link.id;
                    }
                }
                if (itemsIndexed[link.type] && itemsIndexed[link.type][link.id]) {
                    var remoteIdAttribute = relation.relatedCollection.idAttribute;
                    var itemLinked = itemsIndexed[link.type][link.id];
                    itemLinked.attributes[remoteIdAttribute] = link.id;
                    item.attributes[relation.localField] = itemLinked.attributes;
                }
            }
            else if (relation.type === 'hasMany') {
                var links = item.relationships[relationField].data;
                if (!js_data_1.utils.isArray(links)) {
                    this.warn(strings_1.WARNING.WRONG_RELATION_ARRAY_EXPECTED);
                    continue;
                }
                item.attributes[relation.localField] = [];
                for (var i_2 = 0, l = links.length; i_2 < l; i_2++) {
                    var link = links[i_2];
                    if (itemsIndexed[link.type] && itemsIndexed[link.type][link.id]) {
                        var itemLinkd = itemsIndexed[link.type][link.id];
                        item.attributes[relation.localField].push(itemLinkd.attributes);
                    }
                }
            }
            else {
                this.warn(strings_1.WARNING.RELATION_UNKNOWN);
                continue;
            }
        }
    }
    var outputDatas;
    if (!collectionReceived) {
        outputDatas = res.data.data.attributes;
    }
    else {
        outputDatas = [];
        for (var i_3 = 0, l = res.data.data.length; i_3 < l; i_3++) {
            outputDatas.push(res.data.data[i_3].attributes);
        }
    }
    if (!opts.raw) {
        return outputDatas;
    }
    return {
        result: outputDatas,
        meta: res.data.meta,
        rawData: res.data
    };
}
exports.jsonApiDeserialize = jsonApiDeserialize;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(2);
var js_data_1 = __webpack_require__(1);
function wrapSerialize(self) {
    return function (mapper, data, opts) {
        var beforeSerialize = opts.beforeSerialize || mapper.beforeSerialize || self.options.beforeSerialize, afterSerialize = opts.afterSerialize || mapper.afterSerialize || self.options.afterSerialize;
        if (beforeSerialize)
            data = beforeSerialize.call(self, mapper, data, opts);
        data = jsonApiSerialize.call(self, mapper, data, opts);
        if (afterSerialize)
            data = afterSerialize.call(self, mapper, data, opts);
        return data;
    };
}
exports.wrapSerialize = wrapSerialize;
function jsonApiSerialize(mapper, data, opts) {
    var id = data[mapper.idAttribute];
    delete data[mapper.idAttribute];
    utils_1.mapperCacheRelationByField(mapper);
    var output = { data: { type: mapper.name } };
    if (id)
        output.data.id = id;
    var relationships = {};
    var attributes = {};
    if (!opts.forceReplace && opts.changes && id) {
        data = js_data_1.utils.deepMixIn(js_data_1.utils.deepMixIn({}, opts.changes.changed), opts.changes.added);
    }
    if (opts.forceRelationshipsInAttributes !== true) {
        for (var key in data) {
            var relation = mapper.relationByFieldId[key];
            if (!relation) {
                attributes[key] = data[key];
                continue;
            }
            relationships[relation.localField] = {
                data: {
                    type: relation.relation,
                    id: data[key]
                }
            };
        }
    }
    else {
        attributes = data;
    }
    if (Object.keys(relationships).length !== 0) {
        output.data.relationships = relationships;
    }
    if (Object.keys(attributes).length !== 0) {
        output.data.attributes = attributes;
    }
    return output;
}
exports.jsonApiSerialize = jsonApiSerialize;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(3));


/***/ })
/******/ ]);
});
//# sourceMappingURL=js-data-jsonapi-light.js.map