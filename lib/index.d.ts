import { IDictionary } from 'common-types';
import * as Firebase from 'firebase-admin';
export declare function hashToArray<T = IDictionary>(hashObj: IDictionary<any>, __key__?: string): T[];
export declare function flatten(list: any[]): any[];
export declare function arrayToHash<T = IDictionary>(list: any[], __key__?: string): any;
export declare function snapshotToArray<T = IDictionary>(snap: Firebase.database.DataSnapshot, idProp?: string): T[];
export declare function snapshotToHash<T = IDictionary>(snap: Firebase.database.DataSnapshot, idProp?: string): IDictionary<T>;
export declare function snapshotToOrderedArray<T = IDictionary>(snap: Firebase.database.DataSnapshot, idProp?: string): T[];
export declare function snapshotToOrderedHash<T = IDictionary>(snap: Firebase.database.DataSnapshot, idProp?: string): IDictionary<T>;
