
var _extend = require('util')._extend;
var mkdirp  = require('mkdirp');
var path    = require('path');
var fs      = require('fs');

const flatten = arr => arr.reduce((acc, val) => 
      acc.concat(Array.isArray(val) ? flatten(val) : val), []);

const walkSync = dir => fs.readdirSync(dir)
      .map(file => fs.statSync(path.join(dir, file)).isDirectory()
        ? walkSync(path.join(dir, file))
        : path.join(dir, file).replace(/\\/g, '/'));

module.exports = {
	
	extend: _extend,

	mkdir: mkdirp,

	dirname: path.dirname,

	basename : path.basename,

	flatten: flatten,

	walkSync : walkSync,

	content(file, encoding = 'utf8')
	{
		return fs.readFileSync(file, encoding);
	},

	/**
	 * We combine objects like this to keep
	 * from overriding objects mistakingly by reference
	 */
	combine(obj1, obj2)
	{
		return _extend(_extend({}, obj1), obj2);
	}

};