import { IDictionary } from "common-types";
import { get } from "native-dash";

export interface ISnapShot {
  val: () => any;
  key: string;
  forEach(mapper: (child: ISnapShot) => boolean): void;
}

export function removeIdPropertyFromHash<T = IDictionary>(
  hash: IDictionary<T>,
  idProp = "id"
) {
  const output: any = {};
  Object.keys(hash).map((objId) => {
    const input: IDictionary = hash[objId];
    output[objId] = {};
    Object.keys(input).map((prop) => {
      if (prop !== idProp) {
        output[objId][prop] = input[prop];
      }
    });
  });
  return output;
}

export function keyValueDictionaryToArray<T = any>(
  dict: IDictionary<T>,
  options: IDictionary = {}
) {
  const __key__ = options.key || "id";
  const __value__ = options.value || "value";
  return Object.keys(dict).reduce((result, key) => {
    return result.concat({ [__key__]: key, [__value__]: dict[key] });
  }, []);
}

export function keyValueArrayToDictionary<T = any>(
  input: T[],
  options: IDictionary = {}
): IDictionary {
  const __key__ = options.key || "key";
  const __value__ = options.value || "value";
  return input.reduce((output: any, curr: IDictionary) => {
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
export function hashToArray<T = any>(
  hashObj: IDictionary<T> | IDictionary<string> | IDictionary<number>,
  __key__: keyof (T & { id: string }) = "id"
) {
  if (hashObj && typeof hashObj !== "object") {
    throw new Error(
      "Cant convert hash-to-array because hash was not passed in: " + hashObj
    );
  }
  const hash: IDictionary = { ...{}, ...hashObj };
  const results: T[] = [];
  const isHashArray = Object.keys(hash).every((i) => hash[i] === true);
  const isHashValue = Object.keys(hash).every(
    (i) => typeof hash[i] !== "object"
  );

  Object.keys(hash).map((id) => {
    const obj =
      typeof hash[id] === "object"
        ? { ...hash[id], [__key__]: id }
        : isHashArray
          ? id
          : { [__key__]: id, value: hash[id] };

    results.push(obj);
  });
  return results;
}

export function flatten<T = any>(list: any): T[] {
  return list.reduce(
    (a: any, b: any) => a.concat(Array.isArray(b) ? flatten(b) : b),
    []
  );
}

export type FunctionProperty<T> = (obj: T) => string;

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
export function arrayToHash<T = any>(
  arr: T[],
  keyProperty?: keyof T | FunctionProperty<T>,
  removeIdProperty: boolean = false
): IDictionary<T> {
  if (arr.length === 0) {
    return {};
  }

  const isScalar: boolean = typeof arr[0] === "object" ? false : true;
  if (isScalar && keyProperty) {
    const e = new Error(
      `You can not have an array of primitive values AND set a keyProperty!`
    );
    e.name = "NotAllowed";
    throw e;
  }

  if (!keyProperty && !isScalar) {
    if (arr[0].hasOwnProperty("id")) {
      keyProperty = "id" as keyof T;
    } else {
      const e = new Error(
        `Tried to default to a keyProperty of "id" but that property does not appear to be in the array passed in`
      );
      e.name = "NotAllowed";
      throw e;
    }
  }

  if (!Array.isArray(arr)) {
    const e = new Error(`arrayToHash: input was not an array!`);
    e.name = "NotAllowed";
    throw e;
  }

  const output: IDictionary<T> = arr.reduce((prev, curr) => {
    const key = isScalar
      ? curr
      : typeof keyProperty === "function"
        ? (keyProperty(curr) as keyof T)
        : curr[keyProperty];

    return isScalar
      ? { ...prev, ...{ [key as any]: true } }
      : { ...prev, ...{ [key as any]: curr } };
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
export function snapshotToArray<T = IDictionary>(
  snap: ISnapShot,
  idProp: string = "id"
): T[] {
  const hash: IDictionary = snap.val() || {};

  return hashToArray(hash, idProp);
}

/**
 * Converts a Firebase snapshot to JS object with both val() and key
 * represented in the JS object
 *
 * @param snap the Firebase Snapshot
 * @param idProp the property used to store the "id/key" of the record
 */
export function snapshotToHash<T = IDictionary>(
  snap: ISnapShot,
  idProp: string = "id"
): T {
  const hash: IDictionary = snap.val() || {};
  Object.keys(hash).forEach((key) =>
    typeof hash[key] === "object"
      ? (hash[key][idProp] = key)
      : (hash[key] = { [idProp]: key, value: hash[key] })
  );
  return hash as T;
}

/**
 * Snapshot to Array (ordered)
 *
 * uses Firebase forEach() iterator to gain the appropriate sorting from the query.
 */
export function snapshotToOrderedArray<T = IDictionary>(
  snap: ISnapShot,
  idProp = "id"
): T[] {
  const output: T[] = [];
  snap.forEach((child: ISnapShot) => {
    const obj: any = child.val();
    const key: string = child.key;
    if (typeof obj !== "object") {
      throw new Error(
        `Can't create a list from scalar values: "${obj}" | "${key}"`
      );
    }
    output.push({ ...{ [idProp]: key }, ...obj });

    return true;
  });

  return output as T[];
}

export function snapshotToOrderedHash<T = IDictionary>(
  snap: ISnapShot,
  idProp = "id"
): IDictionary<T> {
  const orderedArray = this.snapshotToOrderedArray(snap, idProp);
  return this.arrayToHash(orderedArray);
}

/**
 *
 * @param dictionary A dictionary of a structured type
 * @param property Which property in each dictionary item are we getting
 */
export function getPropertyAcrossDictionaryItems<T>(
  dictionary: IDictionary,
  property: string
): T[] {
  const output: any[] = [];
  Object.keys(dictionary).map((item) => {
    const value = get(dictionary[item], property);
    if (value !== undefined) {
      output.push(value);
    }
  });

  return output;
}
