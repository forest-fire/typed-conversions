"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-submodule-imports
// tslint:disable-next-line:no-implicit-dependencies
const lodash_es_1 = require("lodash-es");
function removeIdPropertyFromHash(hash, idProp = "id") {
    const output = {};
    Object.keys(hash).map((objId) => {
        const input = hash[objId];
        output[objId] = {};
        Object.keys(input).map(prop => {
            if (prop !== idProp) {
                output[objId][prop] = input[prop];
            }
        });
    });
    return output;
}
exports.removeIdPropertyFromHash = removeIdPropertyFromHash;
function keyValueDictionaryToArray(dict, options = {}) {
    const __key__ = options.key || "id";
    const __value__ = options.value || "value";
    return Object.keys(dict).reduce((result, key) => {
        return result.concat({ [__key__]: key, [__value__]: dict[key] });
    }, []);
}
exports.keyValueDictionaryToArray = keyValueDictionaryToArray;
function keyValueArrayToDictionary(input, options = {}) {
    const __key__ = options.key || "key";
    const __value__ = options.value || "value";
    return input.reduce((output, curr) => {
        const key = curr[__key__];
        const value = curr[__value__];
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
function hashToArray(hashObj, __key__ = "id") {
    if (hashObj && typeof hashObj !== "object") {
        throw new Error("Cant convert hash-to-array because hash was not passed in: " + hashObj);
    }
    const hash = Object.assign({}, hashObj);
    const results = [];
    const isHashArray = Object.keys(hash).every(i => hash[i] === true);
    const isHashValue = Object.keys(hash).every(i => typeof hash[i] !== "object");
    Object.keys(hash).map(id => {
        const obj = typeof hash[id] === "object"
            ? Object.assign({}, hash[id], { [__key__]: id }) : isHashArray
            ? id
            : { [__key__]: id, value: hash[id] };
        results.push(obj);
    });
    return results;
}
exports.hashToArray = hashToArray;
function flatten(list) {
    return list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
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
    const isScalar = typeof arr[0] === "object" ? false : true;
    if (isScalar && keyProperty) {
        const e = new Error(`You can not have an array of primitive values AND set a keyProperty!`);
        e.name = "NotAllowed";
        throw e;
    }
    if (!keyProperty && !isScalar) {
        if (arr[0].hasOwnProperty("id")) {
            keyProperty = "id";
        }
        else {
            const e = new Error(`Tried to default to a keyProperty of "id" but that property does not appear to be in the array passed in`);
            e.name = "NotAllowed";
            throw e;
        }
    }
    if (!Array.isArray(arr)) {
        const e = new Error(`arrayToHash: input was not an array!`);
        e.name = "NotAllowed";
        throw e;
    }
    const output = arr.reduce((prev, curr) => {
        const key = isScalar
            ? curr
            : typeof keyProperty === "function"
                ? keyProperty(curr)
                : curr[keyProperty];
        return isScalar
            ? Object.assign({}, prev, { [key]: true }) : Object.assign({}, prev, { [key]: curr });
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
function snapshotToArray(snap, idProp = "id") {
    const hash = snap.val() || {};
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
function snapshotToHash(snap, idProp = "id") {
    const hash = snap.val() || {};
    Object.keys(hash).forEach(key => typeof hash[key] === "object"
        ? (hash[key][idProp] = key)
        : (hash[key] = { [idProp]: key, value: hash[key] }));
    return hash;
}
exports.snapshotToHash = snapshotToHash;
/**
 * Snapshot to Array (ordered)
 *
 * uses Firebase forEach() iterator to gain the appropriate sorting from the query.
 */
function snapshotToOrderedArray(snap, idProp = "id") {
    const output = [];
    snap.forEach((child) => {
        const obj = child.val();
        const key = child.key;
        if (typeof obj !== "object") {
            throw new Error(`Can't create a list from scalar values: "${obj}" | "${key}"`);
        }
        output.push(Object.assign({ [idProp]: key }, obj));
        return true;
    });
    return output;
}
exports.snapshotToOrderedArray = snapshotToOrderedArray;
function snapshotToOrderedHash(snap, idProp = "id") {
    const orderedArray = this.snapshotToOrderedArray(snap, idProp);
    return this.arrayToHash(orderedArray);
}
exports.snapshotToOrderedHash = snapshotToOrderedHash;
/**
 *
 * @param dictionary A dictionary of a structured type
 * @param property Which property in each dictionary item are we getting
 */
function getPropertyAcrossDictionaryItems(dictionary, property) {
    const output = [];
    Object.keys(dictionary).map(item => {
        const value = lodash_es_1.get(dictionary[item], property, undefined);
        if (value !== undefined) {
            output.push(value);
        }
    });
    return output;
}
exports.getPropertyAcrossDictionaryItems = getPropertyAcrossDictionaryItems;
//# sourceMappingURL=index.js.map