
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

describe("hashToArray()", () => {
  it("works with no 'id' conflicts", () => {
    const converted = convert.hashToArray(basicHash);
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

  it('snapshot of a raw scalar value resolves to a single element array', () => {
    const scalar = convert.snapshotToArray(valueSnapshot as any);
    expect(scalar.length).to.equal(1);
    expect(scalar[0]).to.equal('hello world');
  });

});

describe("snapshotToSortedArray()", () => {
  it.skip('returns results with default key sort');
  it.skip('returns results with child sort');
  it.skip('returns results with value sort');
});
