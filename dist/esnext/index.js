import get from "get-value";
export function removeIdPropertyFromHash(hash, idProp = "id") {
    const output = {};
    Object.keys(hash).map((objId) => {
        const input = hash[objId];
        output[objId] = {};
        Object.keys(input).map((prop) => {
            if (prop !== idProp) {
                output[objId][prop] = input[prop];
            }
        });
    });
    return output;
}
export function keyValueDictionaryToArray(dict, options = {}) {
    const __key__ = options.key || "id";
    const __value__ = options.value || "value";
    return Object.keys(dict).reduce((result, key) => {
        return result.concat({ [__key__]: key, [__value__]: dict[key] });
    }, []);
}
export function keyValueArrayToDictionary(input, options = {}) {
    const __key__ = options.key || "key";
    const __value__ = options.value || "value";
    return input.reduce((output, curr) => {
        const key = curr[__key__];
        const value = curr[__value__];
        output[key] = value;
        return output;
    }, {});
}
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
export function hashToArray(hashObj, __key__ = "id") {
    if (hashObj && typeof hashObj !== "object") {
        throw new Error("Cant convert hash-to-array because hash was not passed in: " + hashObj);
    }
    const hash = Object.assign({}, hashObj);
    const results = [];
    const isHashArray = Object.keys(hash).every((i) => hash[i] === true);
    const isHashValue = Object.keys(hash).every((i) => typeof hash[i] !== "object");
    Object.keys(hash).map((id) => {
        const obj = typeof hash[id] === "object"
            ? Object.assign(Object.assign({}, hash[id]), { [__key__]: id }) : isHashArray
            ? id
            : { [__key__]: id, value: hash[id] };
        results.push(obj);
    });
    return results;
}
export function flatten(list) {
    return list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
}
/**
 * arrayToHash
 *
 * Converts an array of things into a hash/dictionary where "things" is a consistent
 * type of data structure (can be either object or primitive)
 *
 * @param arr an array of a particular type
 * @param keyProperty the property that will be used as the dictionaries key; if false
 * then will assign a firebase pushkey
 * @param removeIdProperty allow you to optionally exclude the `id` from the object
 * as it is redundant to the `key` of the hash. By default though, this is _not_ done as
 * Firemodel benefits (and expects) from this duplication.
 */
export function arrayToHash(arr, keyProperty, removeIdProperty = false) {
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
            ? Object.assign(Object.assign({}, prev), { [key]: true }) : Object.assign(Object.assign({}, prev), { [key]: curr });
    }, {});
    return removeIdProperty ? removeIdPropertyFromHash(output) : output;
}
/**
 * Snapshot to Array (unordered)
 *
 * converts snapshot directly to JS and then converts hash to an
 * array structure but any sorting that came from the server query
 * will be ignored.
 */
export function snapshotToArray(snap, idProp = "id") {
    const hash = snap.val() || {};
    return hashToArray(hash, idProp);
}
/**
 * Converts a Firebase snapshot to JS object with both val() and key
 * represented in the JS object
 *
 * @param snap the Firebase Snapshot
 * @param idProp the property used to store the "id/key" of the record
 */
export function snapshotToHash(snap, idProp = "id") {
    const hash = snap.val() || {};
    Object.keys(hash).forEach((key) => typeof hash[key] === "object"
        ? (hash[key][idProp] = key)
        : (hash[key] = { [idProp]: key, value: hash[key] }));
    return hash;
}
/**
 * Snapshot to Array (ordered)
 *
 * uses Firebase forEach() iterator to gain the appropriate sorting from the query.
 */
export function snapshotToOrderedArray(snap, idProp = "id") {
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
export function snapshotToOrderedHash(snap, idProp = "id") {
    const orderedArray = this.snapshotToOrderedArray(snap, idProp);
    return this.arrayToHash(orderedArray);
}
/**
 *
 * @param dictionary A dictionary of a structured type
 * @param property Which property in each dictionary item are we getting
 */
export function getPropertyAcrossDictionaryItems(dictionary, property) {
    const output = [];
    Object.keys(dictionary).map((item) => {
        const value = get(dictionary[item], property);
        if (value !== undefined) {
            output.push(value);
        }
    });
    return output;
}
//# sourceMappingURL=index.js.map