import { IDictionary } from "common-types";
export { IDictionary } from "common-types";
export interface ISnapShot {
    val: () => any;
    key: string;
    forEach(mapper: (child: ISnapShot) => boolean): void;
}
export declare function hashToArray<T = IDictionary>(hashObj: IDictionary<any>, __key__?: string): T[];
export declare function flatten(list: any[]): any[];
export declare function arrayToHash<T = IDictionary>(list: any[], __key__?: string): any;
export declare function snapshotToArray<T = IDictionary>(snap: ISnapShot, idProp?: string): T[];
export declare function snapshotToHash<T = IDictionary>(snap: ISnapShot, idProp?: string): T;
export declare function snapshotToOrderedArray<T = IDictionary>(snap: ISnapShot, idProp?: string): T[];
export declare function snapshotToOrderedHash<T = IDictionary>(snap: ISnapShot, idProp?: string): IDictionary<T>;
