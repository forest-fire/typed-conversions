"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get = require("lodash.get");
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
    const __key__ = options.key || "key";
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
function hashToArray(hashObj, __key__ = "id") {
    if (hashObj && typeof hashObj !== "object") {
        throw new Error("Cant convert hash-to-array because hash was not passed in: " + hashObj);
    }
    const hash = Object.assign({}, hashObj);
    const results = [];
    Object.keys(hash).forEach(id => {
        const obj = hash[id];
        const allEqualTrue = (prev, curr) => {
            return obj[curr] !== true ? false : prev;
        };
        const isScalar = Object.keys(obj).reduce(allEqualTrue, true) ? true : false;
        const isSimpleArray = Object.keys(obj).every(i => hash[i] === true);
        const key = isScalar
            ? isSimpleArray
                ? results.push(id)
                : results.push(Object.assign({ [__key__]: id }, { value: hash[id] }))
            : results.push(isScalar ? id : Object.assign({}, obj, { [__key__]: id }));
    });
    return results;
}
exports.hashToArray = hashToArray;
function flatten(list) {
    return list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
}
exports.flatten = flatten;
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
        const key = isScalar ? curr : curr[keyProperty];
        return isScalar
            ? Object.assign({}, prev, { [key]: true }) : Object.assign({}, prev, { [key]: curr });
    }, {});
    return output;
}
exports.arrayToHash = arrayToHash;
function snapshotToArray(snap, idProp = "id") {
    const hash = snap.val() || {};
    return hashToArray(hash, idProp);
}
exports.snapshotToArray = snapshotToArray;
function snapshotToHash(snap, idProp = "id") {
    const hash = snap.val() || {};
    Object.keys(hash).forEach(key => typeof hash[key] === "object"
        ? (hash[key][idProp] = key)
        : (hash[key] = { [idProp]: key, value: hash[key] }));
    return hash;
}
exports.snapshotToHash = snapshotToHash;
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
function getPropertyAcrossDictionaryItems(dictionary, property) {
    const output = [];
    Object.keys(dictionary).map(item => {
        const value = get(dictionary[item], property, undefined);
        if (value !== undefined) {
            output.push(value);
        }
    });
    return output;
}
exports.getPropertyAcrossDictionaryItems = getPropertyAcrossDictionaryItems;
//# sourceMappingURL=index.js.map