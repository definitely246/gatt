'use strict';

let combine   = require('./utils.js').combine;
let str_utils = require('./str_utils.js');
let jp 		  = require('jsonpath');

/**
 * Gather a list of all the expressions in this path
 */
function extract_expressions(path)
{
	var pattern = /\{[^\}]*\}/g;

	return path.match(pattern).map((match) => {
		return match.substring(1, match.length - 1);
	});
}

/**
 * Does this build have any more complexity (unfolded arrays) to it?
 *
 * Note a complexity is just a path with unfolded array like this:
 * 
 *    {path.to.foo[]}
 */
function needs_to_be_unfolded_more(build)
{
	// loop over all the builds and find the first one with complexity
	for (var i = 0; i < build.length; i++)
	{
		if (build[i].path.indexOf('[]') > 0) return true;
	}

	// 	if no matches found, then just return false	
	return false;
}

/**
 * See if unfolded array exists in this str
 */
function has_unfolded_expression(str)
{
	return str.indexOf('[]') != -1;
}

/**
 * Get the real key for an expression
 */
function get_key(expr)
{
	var build = [];
	var parts = expr.split('.');

	for (var i = 0; i < parts.length; i++)
	{
		if (has_unfolded_expression(parts[i]))
		{
			build.push(str_utils.replace_last('[]', '', parts[i]));
			break;
		}

		build.push(parts[i]);
	}

	return build.join('.');
}

/**
 * Get the value for an expression
 */
function get_value(key, tree)
{
	let paths = key.split('.');

	for (var i = 0; i < paths.length; i++)
	{
		var path = paths[i];

		// treat arrays a little differently
		if (path.indexOf('[') >= 0 && path.indexOf(']') >= 0)
		{
			var index = str_utils.between(path, '[', ']');
			var ary_path = str_utils.replace_last('[' + index + ']', '', path);

			if (typeof tree[ary_path] === 'undefined')
			{
				throw "Invalid path: " + key;
			}

			tree = tree[ary_path];
			path = index;
		}

		// we didn't get a valid tree path
		// so we need to bail now
		if (typeof tree[path] === 'undefined')
		{
			throw 'Invalid path: ' + key;
		}

		tree = tree[path];

	}	

	return tree;
}

/**
 * Javascript likes to treat objects as
 * references so we need to make some copies
 * here and there so we don't re-use context objects
 */
function add_context_item(context, name, value)
{
	let sanity_check = 10;
	let context_name = '$' + name;
	let new_context = {};

	// copy over prior context so we don't get reference sharing
	Object.keys(context).forEach((key, index) => {
		new_context[key] = context[key];
	});

	while (typeof new_context[context_name] !== 'undefined' && sanity_check-- > 0)
	{
		context_name = '$' + context_name;
	}

	new_context[context_name] = value;

	return new_context;
}

/**
 * Reduce the complexity of the build items
 */
function unfold_next_layer(build, variables)
{
	var unfolded = [];

	for (var i = 0; i < build.length; i++)
	{
		let item = build[i];

		// get the top most expression that hasn't been unfolded
		let expr = extract_expressions(item.path)
				.filter(has_unfolded_expression)
				.shift();

		// get the full.path.key.to.expr[]
		let key = get_key(expr);

		// get the values array for this expression
		let values = get_value(key, combine(variables, item.context));

		// get the base
		let base = key.split('.').reverse().shift();

		for (var j = 0; j < values.length; j++)
		{
			let value = values[j];
			let new_path = str_utils.replace_first(key + '[]', key + '[' + j + ']', item.path)
			let new_context = add_context_item(item.context, base, value);

			unfolded.push({
				path: new_path,
				context: new_context,
				original: item.original,
			});

		}
	}

	return unfolded;
}

/**
 * Parses the path for us
 */
function parse_path(path, variables)
{
	var open = false;
	var key = '';
	var newpath = '';

	for (var i = 0; i < path.length; i++)
	{
		var char = path[i];

		// open up we are going to start reading the chars for a key
		if (char == '{')
		{
			open = true;
		}

		// just append the char to the newpath
		else if (!open)
		{
			newpath += char;
		}

		// we are open for creating the key name
		else if (open && char != '}')
		{
			key += char;
		}

		// close this key expression, parse it, and tack onto newpath
		else if (open && char == '}')
		{
			open = false;
			newpath += get_value(key, variables);
			key = '';
		}
	}

	return newpath;
}


/**
 * Builds a complex path such as {some.thing[].like.thispath[].val1}/{thispath.val2}
 */
class builder
{
    build(file, variables)
    {
    	var sanity_check = 50;	// don't get stuck in an infinite loop... we shouldn't need over 50 iterations

    	var layers = [
    		{
				path: file,
				context: {},
				original: file,
    		}
    	];

    	// unfold the layers (paths that have arrays[] in them)
    	while (sanity_check-- > 0 && needs_to_be_unfolded_more(layers))
		{
			layers = unfold_next_layer(layers, variables);
		}

		// update the path and variables for every layer that was flattened out
		for (var i = 0; i < layers.length; i++)
		{
			layers[i].variables = combine(variables, layers[i].context);
			layers[i].path = parse_path(layers[i].path, layers[i].variables);
		}

		return layers;
    }
}

module.exports = builder;