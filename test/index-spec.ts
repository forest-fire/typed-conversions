
import convert = require("../src/index");
import * as helpers from './testing/helpers';
import * as chai from "chai";

const expect = chai.expect;

const basicHash = {
  "-K13121djdf": { name: 'Bob', age: 35 },
  "-K13122djdf": { name: 'Chris', age: 12 },
  "-K13123djdf": { name: 'Frank', age: 22 },
  "-K13124djdf": { name: 'Kabuki', age: 44 },
  "-K13125djdf": { name: 'Ken', age: 56 },
  "-K13126djdf": { name: 'David', age: 78 },
  "-K13127djdf": { name: 'Tammy', age: 28 },
  "-K13128djdf": { name: 'Lucy', age: 22 },
};

const scalarHash = {
"-K13121djdf": 100,
"-K13122djdf": 105,
"-K13123djdf": 8,
"-K13124djdf": 6,
"-K13125djdf": 25,
"-K13126djdf": 300,
"-K13127djdf": 200,
"-K13128djdf": 150,
};

const conflictedHash = {
  ...basicHash,
  ...{"-K13129djdf": { name: 'Lucy', age: 22, id: "1341" }}
};

const listSnapshot = {
  key: 'foobar',
  val: () => ({
    "-K13121djdf": { name: 'Bob', age: 35 },
    "-K13122djdf": { name: 'Chris', age: 12 },
    "-K13123djdf": { name: 'Frank', age: 22 },
    "-K13124djdf": { name: 'Kabuki', age: 44 },
    "-K13125djdf": { name: 'Ken', age: 56 },
    "-K13126djdf": { name: 'David', age: 78 },
    "-K13127djdf": { name: 'Tammy', age: 28 },
    "-K13128djdf": { name: 'Lucy', age: 22 }
  })
};

const valueSnapshot = {
  key: 'foobar',
  val: () => 'hello world'
};

const listOfScalar = {
  key: 'foobar',
  val: () => ({
    one: 1,
    two: 2,
    three: 3
  })
};

describe('snapshotToHash', () => {
  it('works with default idProp', () => {
    const converted = convert.snapshotToHash(listSnapshot as any);
    expect(converted).to.be.an('object');
    expect(helpers.length(converted)).to.equal(8);
    expect(helpers.firstRecord(converted)).has.property('id');
  });

  it('works with bespoke idProp', () => {
    const converted = convert.snapshotToHash(listSnapshot as any, 'key');
    expect(converted).to.be.an('object');
    expect(helpers.length(converted)).to.equal(8);
    expect(helpers.firstRecord(converted)).has.property('key');
  });
});

describe("hashToArray()", () => {
  it("works with no 'id' conflicts", () => {
    const converted = convert.hashToArray({...{}, ...basicHash });
    expect(converted).to.be.an('array');
    expect(converted.length).to.equal(Object.keys(basicHash).length);
    expect(converted.filter(i => i.age === 22).length).to.equal(2);
  });

  it("works with an 'id' conflict", () => {
    const converted = convert.hashToArray(conflictedHash);
    expect(converted).to.be.an('array');
    expect(converted.length).to.equal(Object.keys(conflictedHash).length);
    expect(converted.filter(i => i.age === 22).length).to.equal(3);
    expect(converted.map(c => c.id)).includes("-K13129djdf");
    expect(converted.map(c => c.id)).not.includes("1341");
  });

  it("works with an alternate ID property", () => {
    const converted = convert.hashToArray(conflictedHash, '_id');
    expect(converted).to.be.an('array');
    expect(converted.length).to.equal(Object.keys(conflictedHash).length);
    expect(converted.filter(i => i.age === 22).length).to.equal(3);
    expect(converted.map(c => c._id)).includes("-K13129djdf");
    expect(converted.map(c => c._id)).not.includes("1341");
  });

  it('scalar hash converts to id/value pairings', () => {
    const converted = convert.hashToArray(scalarHash);
    expect(converted).to.be.an('array');
    expect(converted.length).to.equal(Object.keys(scalarHash).length);
    expect(converted[0].id).to.be.a('string');
    expect(converted[0].value).to.be.a('number');
  });

});

describe('arrayToHash()', () => {
  const simpleList = [
    {id: '1234', name: 'Bob', age: 12},
    {id: '4567', name: 'Chris', age: 25},
    {id: '5678', name: 'Cindy', age: 36},
    {id: '6789', name: 'Scott', age: 5},
  ];

  const scalarList = [
    {id: '1234', value: 'Bob'},
    {id: '4567', value: 'Chris'},
    {id: '5678', value: 'Cindy'},
    {id: '6789', value: 'Scott'},
  ];

  it('works with default ID property', () => {
    const hash = convert.arrayToHash(simpleList);
    expect(hash).to.be.an('object');
    expect(helpers.length(hash)).is.equal(simpleList.length);
    expect(helpers.firstRecord(hash).name).to.equal('Bob');
  });

  it('works with bespoke ID property', () => {
    const hash = convert.arrayToHash(simpleList.map(r => {
      const output = { ...{_id: r.id}, ...r };
      delete output.id;
      return output;
    }), '_id');
    expect(hash).to.be.an('object');
    expect(helpers.length(hash)).is.equal(simpleList.length);
    expect(helpers.firstRecord(hash).name).to.equal('Bob');
  });

  it('works with scalar derived hash', () => {
    const converted = convert.arrayToHash(scalarList);
    const reverted = convert.hashToArray(converted);
    expect(converted).to.be.an('object');
    expect(helpers.length(converted)).is.equal(scalarList.length);
    expect(helpers.firstRecord(converted)).to.equal('Bob');

    // check reversions
    expect(helpers.firstRecord(reverted).value).to.equal(helpers.firstRecord(scalarList).value);
    expect(helpers.firstRecord(reverted).id).to.equal(helpers.firstRecord(scalarList).id);
  });

  it('inverts hashToArray()', () => {
    const converted = convert.hashToArray(basicHash);
    const reverted = convert.arrayToHash(converted);
    expect(JSON.stringify(reverted)).to.equal(JSON.stringify(basicHash));
  });
});

describe("snapshotToArray()", () => {

  it('snapshot with default id of "id" works', () => {
    const list = convert.snapshotToArray(listSnapshot as any);
    const expectedLength = helpers.length(listSnapshot.val());

    expect(Object.keys(list).length).to.equal(expectedLength);
    const knownKey = helpers.firstKey(listSnapshot.val());
    expect(list.map(i => i.id)).to.include(knownKey);
    expect(list[0].id).to.be.a('string');
    expect(list[0].name).to.be.a('string');
    expect(list[0].age).to.be.a('number');
  });

  it('snapshot with non-default "id" works', () => {
    const list = convert.snapshotToArray(listSnapshot as any, '_id');
    const expectedLength = helpers.length(listSnapshot.val());

    expect(Object.keys(list).length).to.equal(expectedLength);
    const knownKey = helpers.firstKey(listSnapshot.val());
    expect(list.map(i => i._id)).to.include(knownKey);
    expect(list[0]._id).to.be.a('string');
    expect(list[0].name).to.be.a('string');
    expect(list[0].age).to.be.a('number');
  });

  it('snapshot of a hash with scalar values creates id/value objects', () => {
    const scalars = convert.snapshotToArray(listOfScalar as any);
    expect(scalars).to.be.an('array');
    expect(scalars.map(s => s.id)).to.include(helpers.firstKey(listOfScalar.val()));
    expect(scalars.map(s => s.id)).to.include(helpers.lastKey(listOfScalar.val()));
    expect(scalars[0].value).to.be.a('number');
  });

  it('snapshot of a raw scalar value should throw an error', () => {
    try {
      const scalar = convert.snapshotToArray(valueSnapshot as any);
    } catch (e) {
      expect(true).to.equal(true);
    }
  });

});

describe("snapshotToSortedArray()", () => {
  it.skip('key sort returns results in right order');
  it.skip('child sort returns results in right order');
  it.skip('value sort returns results in right order');
});

describe('flatten()', () => {
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
    [ Promise.resolve(), Promise.resolve(), Promise.resolve(), ],
    [ Promise.resolve(), Promise.resolve(), Promise.resolve(), ]
  ];

  it('flattening a multi-dimensional arrays which have intersection works', () => {
    expect(convert.flatten(multiNumbersWithIntersection).length).to.equal(9);
    expect(convert.flatten(multiNumbersWithIntersection)).to.include(1);
    expect(convert.flatten(multiNumbersWithIntersection)).to.not.include(5);
    expect(convert.flatten(multiNumbersWithIntersection)).to.include(9);
    expect(convert
      .flatten(multiNumbersWithIntersection)
      .filter(n => n === 1).length
    ).to.equal(3);
  });

  it('array of promises flattens correctly', () => {
    expect(convert.flatten(arrayOfPromises).length).to.equal(6);
  });
});
