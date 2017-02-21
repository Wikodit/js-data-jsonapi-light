(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("js-data"), require("js-data-http"));
	else if(typeof define === 'function' && define.amd)
		define(["js-data", "js-data-http"], factory);
	else if(typeof exports === 'object')
		exports["JSDataJsonApiLight"] = factory(require("js-data"), require("js-data-http"));
	else
		root["JSDataJsonApiLight"] = factory(root["JSData"], root["JSDataHttp"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var js_data_1 = __webpack_require__(1);
var js_data_http_1 = __webpack_require__(2);
var JsonApiAdapter = (function (_super) {
    __extends(JsonApiAdapter, _super);
    function JsonApiAdapter(options) {
        var _this = this;
        options = js_data_1.utils.deepMixIn({}, options || {});
        if (!options.store) {
            throw new Error('JsonApiAdapter needs to be given a store option.');
        }
        if (options.serialize) {
            options.beforeSerialize = options.serialize;
        }
        if (options.deserialize) {
            options.afterDeserialize = options.deserialize;
        }
        var selfWrapper = {};
        options.serialize = function (wrapper) {
            return function () {
                return wrapper.self.jsonApiSerialize.apply(wrapper.self, arguments);
            };
        }(selfWrapper);
        options.deserialize = function (wrapper) {
            return function () {
                return wrapper.self.jsonApiDeserialize.apply(wrapper.self, arguments);
            };
        }(selfWrapper);
        _this = _super.call(this, options) || this;
        selfWrapper.self = _this;
        _this.store = options.store;
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
    JsonApiAdapter.prototype.jsonApiSerialize = function (resourceConfig, data) {
        console.log(data);
        return data;
    };
    JsonApiAdapter.prototype.jsonApiDeserialize = function (mapper, res, options) {
        if (!res.data || !res.data.data)
            return;
        var collectionReceived = js_data_1.utils.isArray(res.data.data);
        var itemsIndexed = {};
        var itemCollection = [].concat(res.data.included || [])
            .concat(res.data.data || []);
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
        for (var type in itemsIndexed) {
            var resource = this.store.getMapper(type);
            if (!resource) {
                this.warn("Can't find resource '" + type + "'");
                continue;
            }
            if (!resource.relationByFields) {
                resource.relationByFields = {};
                for (var i_1 = 0, l = (resource.relationList || []).length; i_1 < l; i_1++) {
                    var field = resource.relationList[i_1].localField;
                    if (!field) {
                        this.warn('localField missing');
                        continue;
                    }
                    resource.relationByFields[field] = resource.relationList[i_1];
                }
            }
            for (var id in itemsIndexed[type]) {
                var item = itemsIndexed[type][id];
                item.attributes[resource.idAttribute] = id;
                if (!item.relationships || !Object.keys(item.relationships))
                    continue;
                for (var relationField in (item.relationships || {})) {
                    var relation = resource.relationByFields[relationField];
                    if (!relation) {
                        this.warn('Server has relationship client has not.');
                        continue;
                    }
                    if (relation.type === 'belongsTo' || relation.type === 'hasOne') {
                        var link = item.relationships[relationField].data;
                        if (!js_data_1.utils.isObject(link)) {
                            this.warn('Wrong relation somewhere, object expected');
                            continue;
                        }
                        if (itemsIndexed[link.type] && itemsIndexed[link.type][link.id]) {
                            var itemLinked = itemsIndexed[link.type][link.id];
                            item.attributes[relation.localField] = itemLinked.attributes;
                        }
                    }
                    else if (relation.type === 'hasMany') {
                        var links = item.relationships[relationField].data;
                        if (!js_data_1.utils.isArray(links)) {
                            this.warn('Wrong relation somewhere, array expected');
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
                        this.warn('Unknown relation');
                        continue;
                    }
                }
            }
        }
        if (!collectionReceived) {
            return res.data.data.attributes;
        }
        var outputDatas = [];
        for (var i_3 = 0, l = res.data.data.length; i_3 < l; i_3++) {
            outputDatas.push(res.data.data[i_3].attributes);
        }
        return outputDatas;
    };
    return JsonApiAdapter;
}(js_data_http_1.HttpAdapter));
exports.JsonApiAdapter = JsonApiAdapter;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ })
/******/ ]);
});
//# sourceMappingURL=js-data-jsonapi-light.js.map