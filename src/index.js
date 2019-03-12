"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var lodash_es_1 = require("lodash-es");
function removeIdPropertyFromHash(hash, idProp) {
    if (idProp === void 0) { idProp = "id"; }
    var output = {};
    Object.keys(hash).map(function (objId) {
        var input = hash[objId];
        output[objId] = {};
        Object.keys(input).map(function (prop) {
            if (prop !== idProp) {
                output[objId][prop] = input[prop];
            }
        });
    });
    return output;
}
exports.removeIdPropertyFromHash = removeIdPropertyFromHash;
function keyValueDictionaryToArray(dict, options) {
    if (options === void 0) { options = {}; }
    var __key__ = options.key || "id";
    var __value__ = options.value || "value";
    return Object.keys(dict).reduce(function (result, key) {
        var _a;
        return result.concat((_a = {}, _a[__key__] = key, _a[__value__] = dict[key], _a));
    }, []);
}
exports.keyValueDictionaryToArray = keyValueDictionaryToArray;
function keyValueArrayToDictionary(input, options) {
    if (options === void 0) { options = {}; }
    var __key__ = options.key || "key";
    var __value__ = options.value || "value";
    return input.reduce(function (output, curr) {
        var key = curr[__key__];
        var value = curr[__value__];
        output[key] = value;
        return output;
    }, {});
}
exports.keyValueArrayToDictionary = keyValueArrayToDictionary;
/**
 * hashToArray
 *
 * Converts a hash data structure of {key: value, key2: value2} to an
 * array of [ {id, value}, {id2, value2} ]. This should happen regardless
 * to whether the values are themselves hashes (which they often are) or
 * scalar values.
 *
 * The one edge case is where all the hashes passed in have a value of "true"
 * which indicates that this really just a simple value based array encoded as
 * a hash (as is often the case in Firebase for FK relationships).
 *
 * @param hashObj an object of keys that point to some data payload
 * @param ___key__ the property name on the converted array-of-hashes which will contain the key value; by default this is "id"
 */
function hashToArray(hashObj, __key__) {
    if (__key__ === void 0) { __key__ = "id"; }
    if (hashObj && typeof hashObj !== "object") {
        throw new Error("Cant convert hash-to-array because hash was not passed in: " + hashObj);
    }
    var hash = __assign({}, hashObj);
    var results = [];
    var isHashArray = Object.keys(hash).every(function (i) { return hash[i] === true; });
    var isHashValue = Object.keys(hash).every(function (i) { return typeof hash[i] !== "object"; });
    Object.keys(hash).map(function (id) {
        var _a, _b;
        var obj = typeof hash[id] === "object"
            ? __assign({}, hash[id], (_a = {}, _a[__key__] = id, _a)) : isHashArray
            ? id
            : (_b = {}, _b[__key__] = id, _b.value = hash[id], _b);
        results.push(obj);
    });
    return results;
}
exports.hashToArray = hashToArray;
function flatten(list) {
    return list.reduce(function (a, b) { return a.concat(Array.isArray(b) ? flatten(b) : b); }, []);
}
exports.flatten = flatten;
/**
 * arrayToHash
 *
 * Converts an array of things into a hash/dictionary where "things" is a consistent
 * type of data structure (can be either object or primitive)
 *
 * @param arr an array of a particular type
 * @param keyProperty the property that will be used as the dictionaries key; if false then will assign a firebase pushkey
 */
function arrayToHash(arr, keyProperty) {
    if (arr.length === 0) {
        return {};
    }
    var isScalar = typeof arr[0] === "object" ? false : true;
    if (isScalar && keyProperty) {
        var e = new Error("You can not have an array of primitive values AND set a keyProperty!");
        e.name = "NotAllowed";
        throw e;
    }
    if (!keyProperty && !isScalar) {
        if (arr[0].hasOwnProperty("id")) {
            keyProperty = "id";
        }
        else {
            var e = new Error("Tried to default to a keyProperty of \"id\" but that property does not appear to be in the array passed in");
            e.name = "NotAllowed";
            throw e;
        }
    }
    if (!Array.isArray(arr)) {
        var e = new Error("arrayToHash: input was not an array!");
        e.name = "NotAllowed";
        throw e;
    }
    var output = arr.reduce(function (prev, curr) {
        var _a, _b;
        var key = isScalar
            ? curr
            : typeof keyProperty === "function"
                ? keyProperty(curr)
                : curr[keyProperty];
        return isScalar
            ? __assign({}, prev, (_a = {}, _a[key] = true, _a)) : __assign({}, prev, (_b = {}, _b[key] = curr, _b));
    }, {});
    return output;
}
exports.arrayToHash = arrayToHash;
/**
 * Snapshot to Array (unordered)
 *
 * converts snapshot directly to JS and then converts hash to an
 * array structure but any sorting that came from the server query
 * will be ignored.
 */
function snapshotToArray(snap, idProp) {
    if (idProp === void 0) { idProp = "id"; }
    var hash = snap.val() || {};
    return hashToArray(hash, idProp);
}
exports.snapshotToArray = snapshotToArray;
/**
 * Converts a Firebase snapshot to JS object with both val() and key
 * represented in the JS object
 *
 * @param snap the Firebase Snapshot
 * @param idProp the property used to store the "id/key" of the record
 */
function snapshotToHash(snap, idProp) {
    if (idProp === void 0) { idProp = "id"; }
    var hash = snap.val() || {};
    Object.keys(hash).forEach(function (key) {
        var _a;
        return typeof hash[key] === "object"
            ? (hash[key][idProp] = key)
            : (hash[key] = (_a = {}, _a[idProp] = key, _a.value = hash[key], _a));
    });
    return hash;
}
exports.snapshotToHash = snapshotToHash;
/**
 * Snapshot to Array (ordered)
 *
 * uses Firebase forEach() iterator to gain the appropriate sorting from the query.
 */
function snapshotToOrderedArray(snap, idProp) {
    if (idProp === void 0) { idProp = "id"; }
    var output = [];
    snap.forEach(function (child) {
        var _a;
        var obj = child.val();
        var key = child.key;
        if (typeof obj !== "object") {
            throw new Error("Can't create a list from scalar values: \"" + obj + "\" | \"" + key + "\"");
        }
        output.push(__assign((_a = {}, _a[idProp] = key, _a), obj));
        return true;
    });
    return output;
}
exports.snapshotToOrderedArray = snapshotToOrderedArray;
function snapshotToOrderedHash(snap, idProp) {
    if (idProp === void 0) { idProp = "id"; }
    var orderedArray = this.snapshotToOrderedArray(snap, idProp);
    return this.arrayToHash(orderedArray);
}
exports.snapshotToOrderedHash = snapshotToOrderedHash;
/**
 *
 * @param dictionary A dictionary of a structured type
 * @param property Which property in each dictionary item are we getting
 */
function getPropertyAcrossDictionaryItems(dictionary, property) {
    var output = [];
    Object.keys(dictionary).map(function (item) {
        var value = lodash_es_1.get(dictionary[item], property, undefined);
        if (value !== undefined) {
            output.push(value);
        }
    });
    return output;
}
exports.getPropertyAcrossDictionaryItems = getPropertyAcrossDictionaryItems;
