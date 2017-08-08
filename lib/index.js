"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hashToArray(hashObj, __key__ = 'id') {
    const hash = Object.assign({}, hashObj);
    if (!hash) {
        return [];
    }
    const results = [];
    Object.keys(hash).forEach(key => {
        const obj = hash[key];
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
function snapshotToArray(snap, idProp = 'id') {
    const hash = snap.val() || {};
    const output = [];
    Object.keys(hash).forEach(key => {
        const newProps = typeof hash[key] === 'object'
            ? hash[key]
            : { value: hash[key] };
        output.push(Object.assign({ [idProp]: key }, newProps));
    });
    return output;
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
//# sourceMappingURL=index.js.map