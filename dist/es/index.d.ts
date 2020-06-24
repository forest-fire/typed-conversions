import { IDictionary } from "common-types";
export interface ISnapShot {
    val: () => any;
    key: string;
    forEach(mapper: (child: ISnapShot) => boolean): void;
}
export declare function removeIdPropertyFromHash<T = IDictionary>(hash: IDictionary<T>, idProp?: string): any;
export declare function keyValueDictionaryToArray<T = any>(dict: IDictionary<T>, options?: IDictionary): any[];
export declare function keyValueArrayToDictionary<T = any>(input: T[], options?: IDictionary): IDictionary;
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
export declare function hashToArray<T = any>(hashObj: IDictionary<T> | IDictionary<string> | IDictionary<number>, __key__?: keyof (T & {
    id: string;
})): T[];
export declare function flatten<T = any>(list: any): T[];
export declare type FunctionProperty<T> = (obj: T) => string;
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
export declare function arrayToHash<T = any>(arr: T[], keyProperty?: keyof T | FunctionProperty<T>, removeIdProperty?: boolean): IDictionary<T>;
/**
 * Snapshot to Array (unordered)
 *
 * converts snapshot directly to JS and then converts hash to an
 * array structure but any sorting that came from the server query
 * will be ignored.
 */
export declare function snapshotToArray<T = IDictionary>(snap: ISnapShot, idProp?: string): T[];
/**
 * Converts a Firebase snapshot to JS object with both val() and key
 * represented in the JS object
 *
 * @param snap the Firebase Snapshot
 * @param idProp the property used to store the "id/key" of the record
 */
export declare function snapshotToHash<T = IDictionary>(snap: ISnapShot, idProp?: string): T;
/**
 * Snapshot to Array (ordered)
 *
 * uses Firebase forEach() iterator to gain the appropriate sorting from the query.
 */
export declare function snapshotToOrderedArray<T = IDictionary>(snap: ISnapShot, idProp?: string): T[];
export declare function snapshotToOrderedHash<T = IDictionary>(snap: ISnapShot, idProp?: string): IDictionary<T>;
/**
 *
 * @param dictionary A dictionary of a structured type
 * @param property Which property in each dictionary item are we getting
 */
export declare function getPropertyAcrossDictionaryItems<T>(dictionary: IDictionary, property: string): T[];
