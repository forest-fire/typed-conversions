"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hashToArray(hashObj, __key__ = 'id') {
    if (hashObj && typeof hashObj !== 'object') {
        throw new Error('Cant convert hash-to-array because hash was not passed in: ' + hashObj);
    }
    const hash = Object.assign({}, hashObj);
    const results = [];
    Object.keys(hash).forEach(key => {
        const newProps = typeof hash[key] === 'object'
            ? hash[key]
            : { value: hash[key] };
        const obj = Object.assign({}, newProps);
        obj[__key__] = key;
        results.push(obj);
    });
    return results;
}
exports.hashToArray = hashToArray;
function flatten(list) {
    return list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
}
exports.flatten = flatten;
function arrayToHash(list, __key__ = 'id') {
    if (!Array.isArray(list)) {
        throw new Error(`arrayToHash: input was not an array!`);
    }
    return list.reduce((acc, record) => {
        const recordNoId = Object.assign({}, record);
        delete recordNoId[__key__];
        return Object.keys(recordNoId).length === 1 && recordNoId.value
            ? Object.assign({}, acc, { [record[__key__]]: recordNoId.value }) : Object.assign({}, acc, { [record[__key__]]: recordNoId });
    }, new Object());
}
exports.arrayToHash = arrayToHash;
function snapshotToArray(snap, idProp = 'id') {
    const hash = snap.val() || {};
    return this.hashToArray(hash, idProp);
}
exports.snapshotToArray = snapshotToArray;
function snapshotToOrderedArray(snap, idProp = 'id') {
    const output = [];
    snap.forEach((record) => {
        const obj = record.val();
        const key = record.key;
        if (typeof obj !== 'object') {
            throw new Error(`Can't create a list from scalar values: "${obj}" | "${key}"`);
        }
        output.push(Object.assign({ [idProp]: key }, obj));
        return true;
    });
    return output;
}
exports.snapshotToOrderedArray = snapshotToOrderedArray;
function snapshotToOrderedHash(snap, idProp = 'id') {
    const orderedArray = this.snapshotToOrderedArray(snap, idProp);
    return this.arrayToHash(orderedArray);
}
exports.snapshotToOrderedHash = snapshotToOrderedHash;
//# sourceMappingURL=index.js.map