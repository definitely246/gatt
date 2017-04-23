import fs from 'fs';
import test from 'ava';
import rimraf from 'rimraf';
import mkdirp from 'mkdirp';

import utils from '../src/utils.js';
import str_utils from '../src/str_utils.js';
import gatt from '../index.js';
import Reader from '../src/reader.js';

/**
 * Clean up the builds/func directory
 */
async function cleanup(t) {
	await new Promise(r => {
		rimraf('tests/builds/func/', r);
	});
	await new Promise(r => {
		mkdirp('tests/builds/func/', r);
	});
}

/**
 * Compares the expected template files to 
 * the build template files for an exact match
 */
async function build_matches_expected(t, template) {

	// given
	let reader = new Reader;

	const variables = require('./examples/variables.js');

	await new Promise(r => { 
		mkdirp(`tests/builds/func/${template}`, r);
	});


	// when
	await gatt({
		"variables": variables,
		"reader_directory": `tests/examples/${template}`,
		"writer_directory": `tests/builds/func/${template}`,
	});

	
	// then
	const expected_files = reader.files(`tests/expected/${template}`).map(file => {
		return str_utils.replace_first('expected', 'builds/func', file);
	});

	// make sure the directories contain the exact same file names
	t.deepEqual(reader.files(`tests/builds/func/${template}`), expected_files);

	// make sure each file contains exact content
	reader.files(`tests/builds/func/${template}`).map(file => {
		let expected = str_utils.replace_first('builds/func', 'expected', file);
		t.is(utils.content(file), utils.content(expected));
	});
}

test.beforeEach(cleanup);

test.after(cleanup);

test('it generates template1', async t => {
	await build_matches_expected(t, 'template1');
});

test('it generates template2', async t => {
	await build_matches_expected(t, 'template2');
});

test('it generates template3', async t => {
	await build_matches_expected(t, 'template3');
});

test('it generates template4', async t => {
	await build_matches_expected(t, 'template4');
});

test('it generates template5', async t => {
	await build_matches_expected(t, 'template5');
});

test('it generates template6', async t => {
	await build_matches_expected(t, 'template6');
});

test('it generates template7', async t => {
	await build_matches_expected(t, 'template7');
});


// TODO keep making more example tests







