function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

function hashToArray(hashObj) {
  var __key__ = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "id";

  if (hashObj && _typeof(hashObj) !== "object") {
    throw new Error("Cant convert hash-to-array because hash was not passed in: " + hashObj);
  }

  var hash = Object.assign({}, hashObj);
  var results = [];
  Object.keys(hash).forEach(function (key) {
    var newProps = _typeof(hash[key]) === "object" ? hash[key] : {
      value: hash[key]
    };
    var obj = Object.assign({}, newProps);
    obj[__key__] = key;
    results.push(obj);
  });
  return results;
}

exports.hashToArray = hashToArray;

function flatten(list) {
  return list.reduce(function (a, b) {
    return a.concat(Array.isArray(b) ? flatten(b) : b);
  }, []);
}

exports.flatten = flatten;

function arrayToHash(list) {
  var __key__ = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "id";

  if (!Array.isArray(list)) {
    throw new Error("arrayToHash: input was not an array!");
  }

  return list.reduce(function (acc, record) {
    var recordNoId = Object.assign({}, record);
    delete recordNoId[__key__];
    return Object.keys(recordNoId).length === 1 && recordNoId.value ? Object.assign({}, acc, _defineProperty({}, record[__key__], recordNoId.value)) : Object.assign({}, acc, _defineProperty({}, record[__key__], recordNoId));
  }, new Object());
}

exports.arrayToHash = arrayToHash;

function snapshotToArray(snap) {
  var idProp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "id";
  var hash = snap.val() || {};
  return hashToArray(hash, idProp);
}

exports.snapshotToArray = snapshotToArray;

function snapshotToHash(snap) {
  var idProp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "id";
  var hash = snap.val() || {};
  Object.keys(hash).forEach(function (key) {
    var _hash$key;

    return _typeof(hash[key]) === "object" ? hash[key][idProp] = key : hash[key] = (_hash$key = {}, _defineProperty(_hash$key, idProp, key), _defineProperty(_hash$key, "value", hash[key]), _hash$key);
  });
  return hash;
}

exports.snapshotToHash = snapshotToHash;

function snapshotToOrderedArray(snap) {
  var idProp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "id";
  var output = [];
  snap.forEach(function (child) {
    var obj = child.val();
    var key = child.key;

    if (_typeof(obj) !== "object") {
      throw new Error("Can't create a list from scalar values: \"".concat(obj, "\" | \"").concat(key, "\""));
    }

    output.push(Object.assign(_defineProperty({}, idProp, key), obj));
    return true;
  });
  return output;
}

exports.snapshotToOrderedArray = snapshotToOrderedArray;

function snapshotToOrderedHash(snap) {
  var idProp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "id";
  var orderedArray = this.snapshotToOrderedArray(snap, idProp);
  return this.arrayToHash(orderedArray);
}

exports.snapshotToOrderedHash = snapshotToOrderedHash;
