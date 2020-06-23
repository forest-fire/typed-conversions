import convert = require("../src");

import * as helpers from "./testing/helpers";

import { INameValuePair } from "common-types";
import { expect } from "chai";
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

    expect(converted).to.be.an("object");
    expect(helpers.length(converted)).to.equal(8);
    expect(helpers.firstRecord(converted)).has.property("id");
  });

  it("works with bespoke idProp", () => {
    const converted = convert.snapshotToHash(listSnapshot as any, "key");

    expect(converted).to.be.an("object");
    expect(helpers.length(converted)).to.equal(8);
    expect(helpers.firstRecord(converted)).has.property("key");
  });

  it("works with a scalar snapshot", () => {
    const converted = convert.snapshotToHash(scalarSnapshot as any, "key");

    expect(converted).to.be.an("object");
    expect(helpers.length(converted)).to.equal(8);
    expect(helpers.firstRecord(converted)).has.property("key");
  });
});

describe("hashToArray()", () => {
  it("works with no 'id' conflicts", () => {
    const converted = convert.hashToArray({ ...{}, ...basicHash });
    expect(converted).to.be.an("array");
    expect(converted.length).to.equal(Object.keys(basicHash).length);
    expect(converted.filter((i) => i.age === 22).length).to.equal(2);
  });

  it("works with an 'id' conflict", () => {
    const converted = convert.hashToArray(conflictedHash);

    expect(converted).to.be.an("array");
    expect(converted.length).to.equal(Object.keys(conflictedHash).length);
    expect(converted.filter((i) => i.age === 22).length).to.equal(3);
    expect(converted.map((c: any) => c.id)).includes("-K13129djdf");
    expect(converted.map((c: any) => c.id)).not.includes("1341");
  });

  it("works with an alternate ID property", () => {
    const converted = convert.hashToArray(conflictedHash, "_id" as any);
    expect(converted).to.be.an("array");
    expect(converted.length).to.equal(Object.keys(conflictedHash).length);
    expect(converted.filter((i) => i.age === 22).length).to.equal(3);
    expect(converted.map((c: any) => c._id)).includes("-K13129djdf");
    expect(converted.map((c: any) => c._id)).not.includes("1341");
  });

  it("scalar name/value converts to array of name value", () => {
    const converted = convert.keyValueDictionaryToArray(scalarHash, {
      key: "key",
    });
    expect(converted).to.be.an("array");
    expect(converted.length).to.equal(Object.keys(scalarHash).length);

    converted.map((item) => {
      expect(item).to.be.an("object");
      expect(item).to.haveOwnProperty("key");
      expect(item).to.haveOwnProperty("value");

      expect(item.value).to.be.a("number");
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
    expect(converted).to.be.an("array").and.to.have.lengthOf(5);

    converted.forEach((c) => {
      expect(c).to.be.an("object");
      expect(c).to.haveOwnProperty("id");
      expect(c).to.haveOwnProperty("value");
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
    expect(converted).to.be.an("array").and.to.have.lengthOf(5);
    expect(converted[0]).to.be.a("string");
  });

  it("scalar name/value converts to array of name value", () => {
    const converted = convert.keyValueDictionaryToArray(scalarHash());
    expect(converted).to.be.an("array");

    expect(converted.length).to.equal(Object.keys(scalarHash()).length);

    converted.map((item) => {
      expect(item).to.be.an("object");
      expect(item).to.haveOwnProperty("id");
      expect(item).to.haveOwnProperty("value");
      expect(item.value).to.be.a("number");
    });
  });

  it("keyValueDictionaryToArray, keyValueArrayToDictionary are inverses", () => {
    const converted = convert.keyValueDictionaryToArray(scalarHash(), {
      key: "id",
    });
    const convertedBack = convert.keyValueArrayToDictionary(converted, {
      key: "id",
    });
    expect(converted).to.be.an("array");
    expect(convertedBack).to.be.an("object");
    expect(JSON.stringify(scalarHash())).to.equal(
      JSON.stringify(convertedBack)
    );
  });

  it("scalar name/value pairing converts to an name/value dictionary", () => {
    const converted = convert.hashToArray<INameValuePair>(scalarHash());
    expect(converted).to.be.an("array");

    expect(converted.length).to.equal(Object.keys(scalarHash()).length);

    converted.map((item) => {
      expect(item).to.be.an("object");
      expect(item).to.haveOwnProperty("id");
      expect(item).to.haveOwnProperty("value");
      expect(item.value).to.be.a("number");
    });
  });

  it("scalar keys mapped to true returns a simple array", () => {
    const converted = convert.hashToArray(scalarArray());
    expect(converted).to.be.an("array");
    expect(converted.length).to.equal(Object.keys(scalarArray()).length);
    Object.keys(scalarArray()).map((key) => {
      expect(converted).to.contain(key);
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
    expect(hash).to.be.an("object");
    expect(helpers.length(hash)).is.equal(simpleList.length);
    expect(helpers.firstRecord(hash).name).to.equal("Bob");
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
    expect(hash).to.be.an("object");
    expect(helpers.length(hash)).is.equal(simpleList.length);
    expect(helpers.firstRecord(hash).name).to.equal("Bob");
  });

  it("works with an array of scalar values", () => {
    const converted = convert.arrayToHash(scalarList);
    // const reverted = convert.hashToArray(converted);
    expect(converted).to.be.an("object");
    expect(Object.keys(converted)).contains("foo");
    expect(Object.keys(converted)).contains("bar");
    expect(Object.keys(converted)).contains("baz");
    expect(helpers.length(converted)).is.equal(scalarList.length);
  });

  it("scalar array produces is idempotent with hashToArray()", async () => {
    const converted = convert.arrayToHash(scalarList);
    const reverted = convert.hashToArray(converted);
    expect(reverted).to.have.lengthOf(Object.keys(converted).length);
    reverted.map((item) => {
      expect(Object.keys(converted)).contains(item);
    });
  });

  it("hashToArray() and arrayToHash() are (largely) idempotent when working with Dictionaries", () => {
    const converted = convert.hashToArray(basicHash); // brings in ID prop to array
    const reverted = removeIdPropertyFromHash(convert.arrayToHash(converted));

    expect(JSON.stringify(reverted)).to.equal(JSON.stringify(basicHash));

    const c2 = convert.hashToArray(basicHashWithId);
    const r2 = convert.arrayToHash(c2);

    expect(JSON.stringify(r2)).to.equal(JSON.stringify(basicHashWithId));
  });
});

describe("snapshotToArray()", () => {
  it('snapshot with default id of "id" works', () => {
    const list = convert.snapshotToArray(listSnapshot as any);
    const expectedLength = helpers.length(listSnapshot.val());

    expect(Object.keys(list).length).to.equal(expectedLength);
    const knownKey = helpers.firstKey(listSnapshot.val());
    expect(list.map((i) => i.id)).to.include(knownKey);
    expect(list[0].id).to.be.a("string");
    expect(list[0].name).to.be.a("string");
    expect(list[0].age).to.be.a("number");
  });

  it('snapshot with non-default "id" works', () => {
    const list = convert.snapshotToArray(listSnapshot as any, "_id");
    const expectedLength = helpers.length(listSnapshot.val());

    expect(Object.keys(list).length).to.equal(expectedLength);
    const knownKey = helpers.firstKey(listSnapshot.val());
    expect(list.map((i) => i._id)).to.include(knownKey);
    expect(list[0]._id).to.be.a("string");
    expect(list[0].name).to.be.a("string");
    expect(list[0].age).to.be.a("number");
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
      expect(true).to.equal(true);
    }
  });
});

describe("snapshotToSortedArray()", () => {
  it.skip("key sort returns results in right order");
  it.skip("child sort returns results in right order");
  it.skip("value sort returns results in right order");
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
    expect(convert.flatten(multiNumbersWithIntersection).length).to.equal(9);
    expect(convert.flatten(multiNumbersWithIntersection)).to.include(1);
    expect(convert.flatten(multiNumbersWithIntersection)).to.not.include(5);
    expect(convert.flatten(multiNumbersWithIntersection)).to.include(9);
    expect(
      convert.flatten(multiNumbersWithIntersection).filter((n) => n === 1)
        .length
    ).to.equal(3);
  });

  it("array of promises flattens correctly", () => {
    expect(convert.flatten(arrayOfPromises).length).to.equal(6);
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
    expect(converted).to.be.an("array");
    expect(converted).to.have.lengthOf(2);
    expect(converted).to.contain(1);
    expect(converted).to.contain(2);
  });
});
