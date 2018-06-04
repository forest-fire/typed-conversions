import { IDictionary } from "common-types";
export interface ISnapShot {
    val: () => any;
    key: string;
    forEach(mapper: (child: ISnapShot) => boolean): void;
}
export declare function removeIdPropertyFromHash<T = IDictionary>(hash: IDictionary<T>, idProp?: string): any;
export declare function hashToArray<T = any>(hashObj: IDictionary<T>, __key__?: string): T[];
export declare function flatten<T = any>(list: any): T[];
export declare function arrayToHash<T = any>(arr: T[], keyProperty?: keyof T): IDictionary<T>;
export declare function snapshotToArray<T = IDictionary>(snap: ISnapShot, idProp?: string): T[];
export declare function snapshotToHash<T = IDictionary>(snap: ISnapShot, idProp?: string): T;
export declare function snapshotToOrderedArray<T = IDictionary>(snap: ISnapShot, idProp?: string): T[];
export declare function snapshotToOrderedHash<T = IDictionary>(snap: ISnapShot, idProp?: string): IDictionary<T>;
