import { IDictionary } from 'common-types';
import * as Firebase from 'firebase-admin';

export function hashToArray<T = IDictionary>(hashObj: IDictionary<any>, __key__: string = 'id') {
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
  return list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
  );
}

export function snapshotToHash<T = IDictionary>(snap: Firebase.database.DataSnapshot, idProp: string = 'id') {
  const hash = snap.val();
  
  if (!hash) {
    return new Object() as T;
  }
  const idValue = typeof snap === 'object' && snap.key 
    ? snap.key 
    : null;
    
  return idValue && typeof hash === 'object'
    ? { ...hash, ...{[idProp]: idValue} }
    : hash;
}

export function snapshotToHashList<T = IDictionary>(snap: Firebase.database.DataSnapshot, idProp = 'id') {
  const hashList: T[] = [];
  snap.forEach((child: any) => {
    hashList.push( snapshotToHash<T>(child, idProp) );
    return true;
  });

  return hashList as T[];
}
