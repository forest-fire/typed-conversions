import { IDictionary } from 'common-types';
import * as Firebase from 'firebase-admin';

export function hashToArray<T = IDictionary>(
  hashObj: IDictionary<any>,
  __key__: string = 'id'
) {
  if (hashObj && typeof hashObj !== 'object') {
    throw new Error('Cant convert hash-to-array because hash was not passed in: ' + hashObj);
  }
  const hash: IDictionary = { ...{}, ...hashObj };
  const results: T[] = [];
  Object.keys(hash).forEach(key => {
    const newProps = typeof hash[key] === 'object'
      ? hash[key]
      : { value: hash[key] };
    const obj: IDictionary = { ...{}, ...newProps };
    obj[__key__] = key;
    results.push(obj as T);
  });
  return results;
}

export function flatten(list: any[]): any[] {
  return list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
}

export function arrayToHash<T = IDictionary>(
  list: any[],
  __key__: string = 'id'
) {
  if (!Array.isArray(list)) {
    throw new Error(`arrayToHash: input was not an array!`);
  }

  return list.reduce((acc, record) => {
    const recordNoId = { ...{}, ...record};
    delete recordNoId[__key__];
    return Object.keys(recordNoId).length === 1 && recordNoId.value
      ? { ...acc, ...{[record[__key__]]: recordNoId.value} }
      : { ...acc, ...{[record[__key__]]: recordNoId} };
  }, new Object());
}

/**
 * Snapshot to Array (unordered)
 *
 * converts snapshot directly to JS and then converts hash to an
 * array structure but any sorting that came from the server query
 * will be ignored.
 */
export function snapshotToArray<T = IDictionary>(
  snap: Firebase.database.DataSnapshot,
  idProp: string = 'id'
): T[] {
  const hash: IDictionary = snap.val() || {};

  return this.hashToArray(hash, idProp);
}

/**
 * Converts a Firebase snapshot to JS object with both val() and key
 * represented in the JS object
 *
 * @param snap the Firebase Snapshot
 * @param idProp the property used to store the "id/key" of the record
 */
export function snapshotToHash<T = IDictionary>(
  snap: Firebase.database.DataSnapshot,
  idProp: string = 'id'
): T {
  const hash: IDictionary = snap.val() || {};
  hash[idProp] = snap.key;

  return hash as T;
}

/**
 * Snapshot to Array (ordered)
 *
 * uses Firebase forEach() iterator to gain the appropriate sorting from the query.
 */
export function snapshotToOrderedArray<T = IDictionary>(
  snap: Firebase.database.DataSnapshot,
  idProp = 'id'
): T[] {
  const output: T[] = [];
  snap.forEach((record: Firebase.database.DataSnapshot) => {
    const obj: Partial<T> = record.val();
    const key: string = record.key;
    if (typeof obj !== 'object' ) {
      throw new Error(`Can't create a list from scalar values: "${obj}" | "${key}"`);
    }

    output.push( { ...{[idProp]: key }, ...obj as any } );

    return true;
  });

  return output as T[];
}

export function snapshotToOrderedHash<T = IDictionary>(
  snap: Firebase.database.DataSnapshot,
  idProp = 'id'): IDictionary<T> {
  const orderedArray = this.snapshotToOrderedArray(snap, idProp);
  return this.arrayToHash(orderedArray);
}
