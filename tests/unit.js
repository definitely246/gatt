import test from 'ava';
import sinon from 'sinon';
import fs from 'fs';
import rimraf from 'rimraf';
import mkdirp from 'mkdirp';

import variables from './examples/variables.js';
import str_utils from '../src/str_utils.js';
import utils from '../src/utils.js';
import gatt from '../index.js';
import Generator from '../src/generator.js';
import Reader from '../src/reader.js';
import Builder from '../src/builder.js';
import Parser from '../src/parser.js';
import Writer from '../src/writer.js';

async function cleanup(t) {
	await new Promise(r => {
		rimraf('tests/builds/unit/', r);
	});
	await new Promise(r => {
		mkdirp('tests/builds/unit/', r);
	});
}

test.before(cleanup);

test.after(cleanup);

// test the generator
test('generator can run', t => {

	// given
	const reader = {
		files: sinon.stub().returns(['file1.txt'])
	};

	const builder = {
		build: sinon.stub().returns([{
			path: 'file1.txt',
			original: 'file1.txt',
			variables: {}
		}])
	};

	const parser = {
		parse: sinon.stub().returns('something parsed')
	};

	const writer = {
		write: sinon.stub().returns('')
	};

	var generator = new Generator({
		reader_directory: 'tests/examples/template1',
		writer_directory: 'tests/examples/template1',
		variables: variables,
		reader: reader,
		builder: builder,
		parser: parser,
		writer: writer
	});


	// when
	generator.run();


	// then
	t.true(reader.files.called);
	t.true(builder.build.called);
	t.true(parser.parse.called);
	t.true(writer.write.called);
});


// test the reader
test('reader can get list of files in a directory', t => {
	var reader = new Reader;
	t.deepEqual(reader.files('tests/examples/template1'), [ 'tests/examples/template1/var1_test/normal_file.txt', 'tests/examples/template1/var1_test/{var1}.txt' ]);
});


// test the builder
test('builder can build example $var2', t => {
	var builder = new Builder;
	var results = builder.build('foobar/{var2[]}.txt', variables);

	t.deepEqual(results, [
		{ 
			path: 'foobar/1.txt',
			context: { '$var2': 1 },
			original: 'foobar/{var2[]}.txt',
			variables: utils.combine(variables, { '$var2' : 1 })
		},
		{
			path: 'foobar/2.txt',
			context: { '$var2': 2 },
			original: 'foobar/{var2[]}.txt',
			variables: utils.combine(variables, { '$var2' : 2 })
		},
		{
			path: 'foobar/3.txt',
			context: { '$var2': 3 },
			original: 'foobar/{var2[]}.txt',
			variables: utils.combine(variables, { '$var2': 3 })
		}
	]);
});




// test the parser
test('parser can parse', t => {
	var parser = new Parser;
	var results = parser.parse('tests/examples/template1/var1_test/{var1}.txt', variables);
	t.is(results, utils.content('tests/expected/template1/var1_test/val1.txt'));
});


// test the writer
test('writer can write', async t => {
	var writer = new Writer;
	await writer.write('tests/builds/unit/', 'foo.txt', 'writing foo test');
	t.is(utils.content('tests/builds/unit/foo.txt'), 'writing foo test');
});


// test the str_utils
test('str utils can append_missing', t => {
	t.is(str_utils.append_missing('foo', 'bar'), 'foobar');
	t.is(str_utils.append_missing('foobar', 'bar'), 'foobar');
});

test('str utils can replace all', t => {
	t.is(str_utils.replace_all('foo', 'bar', 'foo durka durka foo!'), 'bar durka durka bar!');	
});

test('str utils can replace last', t => {
	t.is(str_utils.replace_last('foo', 'bar', 'foo durka durka foo!'), 'foo durka durka bar!');	
});

test('str utils can replace first', t => {
	t.is(str_utils.replace_first('foo', 'bar', 'foo durka durka foo!'), 'bar durka durka foo!');	
});

test('str utils can do between', t => {
	t.is(str_utils.between('Some [thing] here', '[', ']'), 'thing');
	t.is(str_utils.between('Some string here, does this work correctly?', 'string ', ' correctly?'), 'here, does this work');
});


// test the utils
test('utils can extend', t => {
	t.deepEqual(utils.extend({a : 1}, {b: 2}), { a : 1, b : 2 });
});

test.cb('utils can make directory', t => {
	utils.mkdir('tests/builds/unit/foodir', function() {
		t.true(fs.existsSync('tests/builds/unit/foodir'));
		t.end();
	});
});

test('utils can get a dirname', t => {
	t.is(utils.dirname('tests/builds/unit/foodir'), 'tests/builds/unit');
});

test('utils can get a basename', t => {
	t.is(utils.basename('tests/builds/unit/foodir'), 'foodir');
});

test('utils can combine objects', t => {
	t.deepEqual(utils.combine({a : 1 }, {b: 2}), { a : 1, b : 2 });
})

