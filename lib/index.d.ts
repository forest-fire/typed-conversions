import { IDictionary } from 'common-types';
import * as Firebase from 'firebase-admin';
export declare function hashToArray<T = IDictionary>(hashObj: IDictionary<any>, __key__?: string): T[];
export declare function flatten(list: any[]): any[];
export declare function snapshotToHash<T = IDictionary>(snap: Firebase.database.DataSnapshot, idProp?: string): any;
export declare function snapshotToHashList<T = IDictionary>(snap: Firebase.database.DataSnapshot, idProp?: string): T[];
