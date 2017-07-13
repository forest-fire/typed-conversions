"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
function hashToArray(hashObj, __key__) {
    if (__key__ === void 0) { __key__ = 'id'; }
    var hash = __assign({}, hashObj);
    if (!hash) {
        return [];
    }
    var results = [];
    Object.keys(hash).forEach(function (key) {
        var obj = hash[key];
        obj[__key__] = key;
        results.push(obj);
    });
    return results;
}
exports.hashToArray = hashToArray;
function flatten(list) {
    return list.reduce(function (a, b) { return a.concat(Array.isArray(b) ? flatten(b) : b); }, []);
}
exports.flatten = flatten;
function snapshotToHash(snap, idProp) {
    if (idProp === void 0) { idProp = 'id'; }
    var hash = snap.val();
    if (!hash) {
        return new Object();
    }
    var idValue = typeof snap === 'object' && snap.key
        ? snap.key
        : null;
    return idValue && typeof hash === 'object'
        ? __assign({}, hash, (_a = {}, _a[idProp] = idValue, _a)) : hash;
    var _a;
}
exports.snapshotToHash = snapshotToHash;
function snapshotToHashList(snap, idProp) {
    if (idProp === void 0) { idProp = 'id'; }
    var hashList = [];
    snap.forEach(function (child) {
        hashList.push(snapshotToHash(child, idProp));
        return true;
    });
    return hashList;
}
exports.snapshotToHashList = snapshotToHashList;
