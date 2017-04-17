import fs from 'fs';
import test from 'ava';
import gatt from '../index.js';


let variables = require('./examples/variables.js');

test('We can run a default generator', t => {


	let result = gatt({
		"variables": variables,
		"template_directory": "tests/examples/template1",
		"output_directory": "tests/builds/template1",
	}).run();







	// fs.readdir(__dirname + '/examples/template1', function(err, items) {
	// 	console.log('item', err, items);
	// });

	// require the template1_var
	// check that template_directory and output_directory exists
	// check the output_directory for correct file content

	// if (process.argv.length <= 2) {
	//     console.log("Usage: " + __filename + " path/to/directory");
	//     process.exit(-1);
	// }
	// var path = process.argv[2];

	// fs.readdir(path, function(err, items) {
	//     console.log(items);
	 
	//     for (var i=0; i<items.length; i++) {
	//         console.log(items[i]);
	//     }
	// });

	t.is('a', 'a');

});

test.todo("We check that variables eventually becomes an object");


test.todo('We can generate variables separately');
test.todo('We can parse everything separately');
test.todo('We can write files separately');
test.todo('We can parse templates separately');
test.todo('We can parse content separately');

test.todo("We can override variables");
test.todo('We can override template_directory');
test.todo('We can override output_directory');
test.todo('We can override content_parser');
test.todo('We can override template_parser');
test.todo('We can override writer');