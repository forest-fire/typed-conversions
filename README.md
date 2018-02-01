# typed-data-conversions

A small set of data conversion functions with Typescript 2.x typing. Conversions include:

## General Use
- `hashToArray<T>`
- `arrayToHash<T>`
- `flatten`

## Firebase Specific
- `snapshotToArray<T>: T[]`
- `snapshotToHash<T>: IDictionary<T>` - combines snap.val() and snap.key into a JS Object
- `snapshotToOrderedArray<T>: T[]`
- `snapshotToOrderedHash<T>: Array<IDictionary<T>>`
