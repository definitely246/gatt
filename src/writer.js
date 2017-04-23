var fs    = require('fs');
var utils = require('./utils.js');

/**
 * Handles writing a file to a directory
 *
 * this is useful in case we want to write some sort of logic about each file
 * for example, if we want to ignore writing certain types of files...
 */
class writer {

    write(directory, file, content) {

    	var fullpath = directory + '/' + file;

    	return new Promise((resolve, reject) => {

    		utils.mkdir(directory, (err) => {				
				if (err) {
					return reject({err, fullpath});
				}

				fs.writeFile(fullpath, content, (err) => {
					if (err) {
						return reject({ err, fullpath });
					}

					resolve(fullpath);
				});    			
    		})

    	});

    }
}

module.exports = writer;