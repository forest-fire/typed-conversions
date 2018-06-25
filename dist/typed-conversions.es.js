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

var get = require("lodash.get");

function removeIdPropertyFromHash(hash) {
  var idProp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "id";
  var output = {};
  Object.keys(hash).map(function (objId) {
    var input = hash[objId];
    output[objId] = {};
    Object.keys(input).map(function (prop) {
      if (prop !== idProp) {
        output[objId][prop] = input[prop];
      }
    });
  });
  return output;
}

exports.removeIdPropertyFromHash = removeIdPropertyFromHash;

function keyValueDictionaryToArray(dict) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var __key__ = options.key || "key";

  var __value__ = options.value || "value";

  return Object.keys(dict).reduce(function (result, key) {
    var _result$concat;

    return result.concat((_result$concat = {}, _defineProperty(_result$concat, __key__, key), _defineProperty(_result$concat, __value__, dict[key]), _result$concat));
  }, []);
}

exports.keyValueDictionaryToArray = keyValueDictionaryToArray;

function hashToArray(hashObj) {
  var __key__ = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "id";

  if (hashObj && _typeof(hashObj) !== "object") {
    throw new Error("Cant convert hash-to-array because hash was not passed in: " + hashObj);
  }

  var hash = Object.assign({}, hashObj);
  var results = [];
  Object.keys(hash).forEach(function (id) {
    var obj = hash[id];

    var allEqualTrue = function allEqualTrue(prev, curr) {
      return obj[curr] !== true ? false : prev;
    };

    var isScalar = Object.keys(obj).reduce(allEqualTrue, true) ? true : false;
    var isSimpleArray = Object.keys(obj).every(function (i) {
      return hash[i] === true;
    });
    var key = isScalar ? isSimpleArray ? results.push(id) : results.push(Object.assign(_defineProperty({}, __key__, id), {
      value: hash[id]
    })) : results.push(isScalar ? id : Object.assign({}, obj, _defineProperty({}, __key__, id)));
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

function arrayToHash(arr, keyProperty) {
  if (arr.length === 0) {
    return {};
  }

  var isScalar = _typeof(arr[0]) === "object" ? false : true;

  if (isScalar && keyProperty) {
    var e = new Error("You can not have an array of primitive values AND set a keyProperty!");
    e.name = "NotAllowed";
    throw e;
  }

  if (!keyProperty && !isScalar) {
    if (arr[0].hasOwnProperty("id")) {
      keyProperty = "id";
    } else {
      var _e = new Error("Tried to default to a keyProperty of \"id\" but that property does not appear to be in the array passed in");

      _e.name = "NotAllowed";
      throw _e;
    }
  }

  if (!Array.isArray(arr)) {
    var _e2 = new Error("arrayToHash: input was not an array!");

    _e2.name = "NotAllowed";
    throw _e2;
  }

  var output = arr.reduce(function (prev, curr) {
    var key = isScalar ? curr : curr[keyProperty];
    return isScalar ? Object.assign({}, prev, _defineProperty({}, key, true)) : Object.assign({}, prev, _defineProperty({}, key, curr));
  }, {});
  return output;
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

function getPropertyAcrossDictionaryItems(dictionary, property) {
  var output = [];
  Object.keys(dictionary).map(function (item) {
    var value = get(dictionary[item], property, undefined);

    if (value !== undefined) {
      output.push(value);
    }
  });
  return output;
}

exports.getPropertyAcrossDictionaryItems = getPropertyAcrossDictionaryItems;
