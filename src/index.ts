import { IDictionary } from 'common-types';
import * as Firebase from 'firebase-admin';

export function hashToArray<T = IDictionary>(
  hashObj: IDictionary<any>,
  __key__: string = 'id'
) {
  const hash: IDictionary = { ...{}, ...hashObj };
  if (!hash) {
    return [];
  }
  const results: T[] = [];
  Object.keys(hash).forEach(key => {
    const obj: IDictionary = hash[key];
    obj[__key__] = key;
    results.push(obj as T);
  });
  return results;
}

export function flatten(list: any[]): any[] {
  return list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
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
  const output: T[] = [];
  if (typeof hash !== 'object') {
    return [ hash ];
  }
  Object.keys(hash).forEach(key => {
    const newProps = typeof hash[key] === 'object'
      ? hash[key]
      : { value: hash[key] };

    output.push({
      ...{ [idProp]: key },
      ...newProps as any
    });
  });

  return output;
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
