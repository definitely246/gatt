
let fs = require('fs');
let tmpl = require('blueimp-tmpl');

/**
 * Parse a file with given variables and return some content as a string
 * Using this parser here: https://github.com/blueimp/JavaScript-Templates
 */
class parser {

	constructor(tmplRoot = '$') {
		tmpl.arg = tmplRoot
	}

    parse(file, variables) {
    	try {
			return tmpl(fs.readFileSync(file).toString(), variables);
    	}
    	catch (e) {

    		// ignore empty files
    		if (typeof e.message !== 'undefined' && e.message == 'document is not defined' && typeof e.name !== 'undefined' && e.name == 'ReferenceError')
    		{
    			return '';
    		}

    		throw e;
    	}
    }
}

module.exports = parser;