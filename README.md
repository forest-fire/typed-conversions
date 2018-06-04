# typed-data-conversions

A small set of data conversion functions with Typescript 2.x typing. Conversions include:

## General Use

- **hashToArray**&lt; T = any &gt;(_hash_: IDictionary&lt; T &gt;): T[]
- **arrayToHash**&lt; T = any &gt;(_arr_: T[]): IDictionary&lt; T &gt;
- **removeIdPropertyFromHash**&lt; T = any &gt;(_hash_: IDictionary<T>, _keyProp_: keyof T = "id"): IDictionary<Exclude<T, "id">>
- **flatten**&lt; T = any &gt;(list: T[]): T[]

## Firebase Specific

- `snapshotToArray<T>: T[]`
- `snapshotToHash<T>: IDictionary<T>` - combines snap.val() and snap.key into a JS Object
- `snapshotToOrderedArray<T>: T[]`
- `snapshotToOrderedHash<T>: Array<IDictionary<T>>`
