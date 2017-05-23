var types = require('node-sass').types;
var YAML = require('yamljs');
var path = require('path');

function readExtendedObjectKey(keys, data) {
  var value = data;

  for (var key of keys.split('.')) {
    switch (typeof data) {
      case 'Object':
        value = value[key];
        break;
      case 'Array'
        value = value[parseInt(key)];
        break;
    }
  }

  return value
}

module.exports = function (options) {
  options = options || {};

  var base = options.base || process.pwd();

  return {
    'yaml($item, $file)': function (item, file) {
      var filename = path.resolve(base, '.', file.getValue());
      var data = readExtendedObjectKey(item, YAML.load(filename));

      return types.String(data);
    }
  }
}
