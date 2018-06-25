import { IDictionary } from "common-types";
export interface ISnapShot {
    val: () => any;
    key: string;
    forEach(mapper: (child: ISnapShot) => boolean): void;
}
export declare function removeIdPropertyFromHash<T = IDictionary>(hash: IDictionary<T>, idProp?: string): any;
export declare function keyValueDictionaryToArray<T = any>(dict: IDictionary<T>, options?: IDictionary): any[];
export declare function keyValueArrayToDictionary<T = any>(input: T[], options?: IDictionary): IDictionary;
export declare function hashToArray<T = any>(hashObj: IDictionary<T> | IDictionary<string> | IDictionary<number>, __key__?: keyof (T & {
    id: string;
})): T[];
export declare function flatten<T = any>(list: any): T[];
export declare function arrayToHash<T = any>(arr: T[], keyProperty?: keyof T): IDictionary<T>;
export declare function snapshotToArray<T = IDictionary>(snap: ISnapShot, idProp?: string): T[];
export declare function snapshotToHash<T = IDictionary>(snap: ISnapShot, idProp?: string): T;
export declare function snapshotToOrderedArray<T = IDictionary>(snap: ISnapShot, idProp?: string): T[];
export declare function snapshotToOrderedHash<T = IDictionary>(snap: ISnapShot, idProp?: string): IDictionary<T>;
export declare function getPropertyAcrossDictionaryItems<T>(dictionary: IDictionary, property: string): T[];
