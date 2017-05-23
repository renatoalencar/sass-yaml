'use strict';

var types = require('node-sass').types;
var YAML = require('yamljs');
var path = require('path');

function readExtendedObjectKey(keys, data) {
  var value = data;

  for (var key of keys.split('.')) {
    switch (typeof value) {
      case 'object':
        value = value[key];
        break;
      case 'array':
        value = value[parseInt(key)];
        break;
    }
  }

  return value
}

function toSassObject(value) {


  return {
    string: types.String,
    object: function (item) {
      if (value === null)
        return types.Null();

      var value = types.Map(item.length);

      for (var i = 0; i < item.length; i++) {
        var key = item.keys()[i];
        value.setKey(i, key);
        value.setValue(i, item[key]);
      }

      return value
    },
    number: types.Number,
    boolean: types.Boolean
  }[typeof value](value)
}

module.exports = function (options) {
  options = options || {};

  var base = options.base || process.cwd();

  return {
    'yaml($item, $file)': function (item, file) {
      var filename = path.resolve(base, '.', file.getValue());
      var data = readExtendedObjectKey(item.getValue(), YAML.load(filename));

      return toSassObject(data);
    }
  }
}
