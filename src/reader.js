
let utils = require('./utils.js');

class reader {

    files(directory) {
    	return utils.flatten(utils.walkSync(directory));
    }

}

module.exports = reader;