import convert = require("../src");

import "jest-extended";

import * as helpers from "./testing/helpers";

import { INameValuePair } from "common-types";
import { removeIdPropertyFromHash } from "../src/index";

const basicHash = {
  "-K13121djdf": { name: "Bob", age: 35 },
  "-K13122djdf": { name: "Chris", age: 12 },
  "-K13123djdf": { name: "Frank", age: 22 },
  "-K13124djdf": { name: "Kabuki", age: 44 },
  "-K13125djdf": { name: "Ken", age: 56 },
  "-K13126djdf": { name: "David", age: 78 },
  "-K13127djdf": { name: "Tammy", age: 28 },
  "-K13128djdf": { name: "Lucy", age: 22 },
};

const basicHashWithId = {
  "-K13121djdf": { name: "Bob", age: 35, id: "-K13121djdf" },
  "-K13122djdf": { name: "Chris", age: 12, id: "-K13122djdf" },
  "-K13123djdf": { name: "Frank", age: 22, id: "-K13123djdf" },
  "-K13124djdf": { name: "Kabuki", age: 44, id: "-K13124djdf" },
  "-K13125djdf": { name: "Ken", age: 56, id: "-K13125djdf" },
  "-K13126djdf": { name: "David", age: 78, id: "-K13126djdf" },
  "-K13127djdf": { name: "Tammy", age: 28, id: "-K13127djdf" },
  "-K13128djdf": { name: "Lucy", age: 22, id: "-K13128djdf" },
};

const scalarHash = () => ({
  "-K13121djdf": 100,
  "-K13122djdf": 105,
  "-K13123djdf": 8,
  "-K13124djdf": 6,
  "-K13125djdf": 25,
  "-K13126djdf": 300,
  "-K13127djdf": 200,
  "-K13128djdf": 150,
});

const scalarArray = () => ({
  "-K13121djdf": true,
  "-K13122djdf": true,
  "-K13123djdf": true,
  "-K13124djdf": true,
  "-K13125djdf": true,
  "-K13126djdf": true,
  "-K13127djdf": true,
  "-K13128djdf": true,
});

const conflictedHash = {
  ...basicHash,
  ...{ "-K13129djdf": { name: "Lucy", age: 22, id: "1341" } },
};

const listSnapshot = {
  key: "foobar",
  val: () => ({
    "-K13121djdf": { name: "Bob", age: 35 },
    "-K13122djdf": { name: "Chris", age: 12 },
    "-K13123djdf": { name: "Frank", age: 22 },
    "-K13124djdf": { name: "Kabuki", age: 44 },
    "-K13125djdf": { name: "Ken", age: 56 },
    "-K13126djdf": { name: "David", age: 78 },
    "-K13127djdf": { name: "Tammy", age: 28 },
    "-K13128djdf": { name: "Lucy", age: 22 },
  }),
};

const valueSnapshot = {
  key: "foobar",
  val: () => "hello world",
};

const scalarSnapshot = {
  key: "foobar",
  val: () => scalarHash(),
};

const listOfScalar = {
  key: "foobar",
  val: () => ({
    one: 1,
    two: 2,
    three: 3,
  }),
};

describe("snapshotToHash", () => {
  it("works with default idProp", () => {
    const converted = convert.snapshotToHash(listSnapshot as any);

    expect(converted).toBeObject();
    expect(helpers.length(converted)).toBe(8);
    expect(helpers.firstRecord(converted)).toHaveProperty("id");
  });

  it("works with bespoke idProp", () => {
    const converted = convert.snapshotToHash(listSnapshot as any, "key");

    expect(converted).toBeObject();
    expect(helpers.length(converted)).toBe(8);
    expect(helpers.firstRecord(converted)).toHaveProperty("key");
  });

  it("works with a scalar snapshot", () => {
    const converted = convert.snapshotToHash(scalarSnapshot as any, "key");

    expect(converted).toBeObject();
    expect(helpers.length(converted)).toBe(8);
    expect(helpers.firstRecord(converted)).toHaveProperty("key");
  });
});

describe("hashToArray()", () => {
  it("works with no 'id' conflicts", () => {
    const converted = convert.hashToArray({ ...{}, ...basicHash });
    expect(converted).toBeArray();
    expect(converted.length).toBe(Object.keys(basicHash).length);
    expect(converted.filter((i) => i.age === 22).length).toBe(2);
  });

  it("works with an 'id' conflict", () => {
    const converted = convert.hashToArray(conflictedHash);

    expect(converted).toBeArray();
    expect(converted.length).toBe(Object.keys(conflictedHash).length);
    expect(converted.filter((i) => i.age === 22).length).toBe(3);
    expect(converted.map((c: any) => c.id)).toEqual(
      expect.arrayContaining(["-K13129djdf"])
    );
    expect(converted.map((c: any) => c.id)).toEqual(
      expect.not.arrayContaining(["1341"])
    );
  });

  it("works with an alternate ID property", () => {
    const converted = convert.hashToArray(conflictedHash, "_id" as any);
    expect(converted).toBeArray();
    expect(converted.length).toBe(Object.keys(conflictedHash).length);
    expect(converted.filter((i) => i.age === 22).length).toBe(3);
    expect(converted.map((c: any) => c._id)).toEqual(
      expect.arrayContaining(["-K13129djdf"])
    );
    expect(converted.map((c: any) => c._id)).toEqual(
      expect.not.arrayContaining(["1341"])
    );
  });

  it("scalar name/value converts to array of name value", () => {
    const converted = convert.keyValueDictionaryToArray(scalarHash, {
      key: "key",
    });
    expect(converted).toBeArray();
    expect(converted.length).toBe(Object.keys(scalarHash).length);

    converted.map((item) => {
      expect(item).toBeObject();
      expect(item).toHaveProperty("key");
      expect(item).toHaveProperty("value");

      expect(item.value).toBeNumber();
    });
  });

  it("hashToArray() detects and converts a hashValue data stucture to a key value structure", async () => {
    const data = {
      "-LFsnvrP4aDu3wcbxfVk": 1529961496026,
      "-LFsnvrvoavTDlWzdoPL": 1529961496059,
      "-LFsnvsq2FDo48xxRzmO": 1529961496118,
      "-LFsnvswzAKs8hgu6B7R": 1529961496124,
      "-LFsnvt2hq28zZHeddyn": 1529961496131,
    };
    const converted = convert.hashToArray(data);
    expect(converted).toBeArray();
    expect(converted).toHaveLength(5);

    converted.forEach((c) => {
      expect(c).toBeObject();
      expect(c).toHaveProperty("id");
      expect(c).toHaveProperty("value");
    });
  });

  it("hashToArray() detects and converts a hashArray to a simple array", async () => {
    const data = {
      "-LFsnvrP4aDu3wcbxfVk": true,
      "-LFsnvrvoavTDlWzdoPL": true,
      "-LFsnvsq2FDo48xxRzmO": true,
      "-LFsnvswzAKs8hgu6B7R": true,
      "-LFsnvt2hq28zZHeddyn": true,
    };
    const converted = convert.hashToArray(data);
    expect(converted).toBeArray();
    expect(converted).toHaveLength(5);
    expect(converted[0]).toBeString();
  });

  it("scalar name/value converts to array of name value", () => {
    const converted = convert.keyValueDictionaryToArray(scalarHash());
    expect(converted).toBeArray();

    expect(converted.length).toBe(Object.keys(scalarHash()).length);

    converted.map((item) => {
      expect(item).toBeObject();
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("value");
      expect(item.value).toBeNumber();
    });
  });

  it("keyValueDictionaryToArray, keyValueArrayToDictionary are inverses", () => {
    const converted = convert.keyValueDictionaryToArray(scalarHash(), {
      key: "id",
    });
    const convertedBack = convert.keyValueArrayToDictionary(converted, {
      key: "id",
    });
    expect(converted).toBeArray();
    expect(convertedBack).toBeObject();
    expect(JSON.stringify(scalarHash())).toBe(JSON.stringify(convertedBack));
  });

  it("scalar name/value pairing converts to an name/value dictionary", () => {
    const converted = convert.hashToArray<INameValuePair>(scalarHash());
    expect(converted).toBeArray();

    expect(converted.length).toBe(Object.keys(scalarHash()).length);

    converted.map((item) => {
      expect(item).toBeObject();
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("value");
      expect(item.value).toBeNumber();
    });
  });

  it("scalar keys mapped to true returns a simple array", () => {
    const converted = convert.hashToArray(scalarArray());
    expect(converted).toBeArray();
    expect(converted.length).toBe(Object.keys(scalarArray()).length);
    Object.keys(scalarArray()).map((key) => {
      expect(converted).toEqual(expect.arrayContaining([key]));
    });
  });
});

describe("arrayToHash()", () => {
  const simpleList = [
    { id: "1234", name: "Bob", age: 12 },
    { id: "4567", name: "Chris", age: 25 },
    { id: "5678", name: "Cindy", age: 36 },
    { id: "6789", name: "Scott", age: 5 },
  ];

  const scalarList = ["foo", "bar", "baz"];

  it("works with default ID property", () => {
    const hash = convert.arrayToHash(simpleList);
    expect(hash).toBeObject();
    expect(helpers.length(hash)).toBe(simpleList.length);
    expect(helpers.firstRecord(hash).name).toBe("Bob");
  });

  it("works with bespoke ID property", () => {
    const hash = convert.arrayToHash(
      simpleList.map((r) => {
        const output = { ...{ _id: r.id }, ...r };
        delete output.id;
        return output;
      }),
      "_id"
    );
    expect(hash).toBeObject();
    expect(helpers.length(hash)).toBe(simpleList.length);
    expect(helpers.firstRecord(hash).name).toBe("Bob");
  });

  it("works with an array of scalar values", () => {
    const converted = convert.arrayToHash(scalarList);
    // const reverted = convert.hashToArray(converted);
    expect(converted).toBeObject();
    expect(Object.keys(converted)).toEqual(expect.arrayContaining(["foo"]));
    expect(Object.keys(converted)).toEqual(expect.arrayContaining(["bar"]));
    expect(Object.keys(converted)).toEqual(expect.arrayContaining(["baz"]));
    expect(helpers.length(converted)).toBe(scalarList.length);
  });

  it("scalar array produces is idempotent with hashToArray()", async () => {
    const converted = convert.arrayToHash(scalarList);
    const reverted = convert.hashToArray(converted);
    expect(reverted).toHaveLength(Object.keys(converted).length);
    reverted.map((item) => {
      expect(Object.keys(converted)).toEqual(expect.arrayContaining([item]));
    });
  });

  it("hashToArray() and arrayToHash() are (largely) idempotent when working with Dictionaries", () => {
    const converted = convert.hashToArray(basicHash); // brings in ID prop to array
    const reverted = removeIdPropertyFromHash(convert.arrayToHash(converted));

    expect(JSON.stringify(reverted)).toBe(JSON.stringify(basicHash));

    const c2 = convert.hashToArray(basicHashWithId);
    const r2 = convert.arrayToHash(c2);

    expect(JSON.stringify(r2)).toBe(JSON.stringify(basicHashWithId));
  });
});

describe("snapshotToArray()", () => {
  it('snapshot with default id of "id" works', () => {
    const list = convert.snapshotToArray(listSnapshot as any);
    const expectedLength = helpers.length(listSnapshot.val());

    expect(Object.keys(list).length).toBe(expectedLength);
    const knownKey = helpers.firstKey(listSnapshot.val());
    expect(list.map((i) => i.id)).toEqual(expect.arrayContaining([knownKey]));
    expect(list[0].id).toBeString();
    expect(list[0].name).toBeString();
    expect(list[0].age).toBeNumber();
  });

  it('snapshot with non-default "id" works', () => {
    const list = convert.snapshotToArray(listSnapshot as any, "_id");
    const expectedLength = helpers.length(listSnapshot.val());

    expect(Object.keys(list).length).toBe(expectedLength);
    const knownKey = helpers.firstKey(listSnapshot.val());
    expect(list.map((i) => i._id)).toEqual(expect.arrayContaining([knownKey]));
    expect(list[0]._id).toBeString();
    expect(list[0].name).toBeString();
    expect(list[0].age).toBeNumber();
  });

  // it("snapshot of a hash with scalar values creates id/value objects", () => {
  //   const scalars = convert.snapshotToArray(listOfScalar as any);
  //   expect(scalars).to.be.an("array");
  //   expect(scalars.map(s => s.id)).to.include(helpers.firstKey(listOfScalar.val()));
  //   expect(scalars.map(s => s.id)).to.include(helpers.lastKey(listOfScalar.val()));
  //   expect(scalars[0].value).to.be.a("number");
  // });

  it("snapshot of a raw scalar value should throw an error", () => {
    try {
      const scalar = convert.snapshotToArray(valueSnapshot as any);
    } catch (e) {
      expect(true).toBe(true);
    }
  });
});

describe("snapshotToSortedArray()", () => {
  it.skip("key sort returns results in right order", () => undefined);
  it.skip("child sort returns results in right order", () => undefined);
  it.skip("value sort returns results in right order", () => undefined);
});

describe("flatten()", () => {
  const multiNumbersNoIntersection = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];

  const multiNumbersWithIntersection = [
    [1, 2, 3],
    [1, 2, 6],
    [1, 2, 9],
  ];

  const arrayOfPromises = [
    [Promise.resolve(), Promise.resolve(), Promise.resolve()],
    [Promise.resolve(), Promise.resolve(), Promise.resolve()],
  ];

  it("flattening a multi-dimensional arrays which have intersection works", () => {
    expect(convert.flatten(multiNumbersWithIntersection).length).toBe(9);
    expect(convert.flatten(multiNumbersWithIntersection)).toEqual(
      expect.arrayContaining([1])
    );
    expect(convert.flatten(multiNumbersWithIntersection)).toEqual(
      expect.not.arrayContaining([5])
    );
    expect(convert.flatten(multiNumbersWithIntersection)).toEqual(
      expect.arrayContaining([9])
    );
    expect(
      convert.flatten(multiNumbersWithIntersection).filter((n) => n === 1)
        .length
    ).toBe(3);
  });

  it("array of promises flattens correctly", () => {
    expect(convert.flatten(arrayOfPromises).length).toBe(6);
  });
});

describe("others > ", () => {
  it("getPropertiesAcrossDictionaryItems works with a populated dictionary", async () => {
    const dictionary = {
      abc: {
        name: "foo",
        meta: {
          thingy: 1,
        },
      },
      cdf: {
        name: "foo",
        meta: {
          thingy: 2,
        },
      },
    };
    const converted = convert.getPropertyAcrossDictionaryItems(
      dictionary,
      "meta.thingy"
    );
    expect(converted).toBeArray();
    expect(converted).toHaveLength(2);
    expect(converted).toEqual(expect.arrayContaining([1]));
    expect(converted).toEqual(expect.arrayContaining([2]));
  });
});
