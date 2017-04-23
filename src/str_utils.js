
module.exports = {
	append_missing(str, missing)
	{
		return (missing == str.substr(-1 * missing.length))
			? str
			: str + missing;
	},

	replace_all(needle, replacement, haystack, ignore)
	{
		return haystack.replace(new RegExp(needle.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(replacement)=="string")?replacement.replace(/\$/g,"$$$$"):replacement);
	},

	replace_last(needle, replacement, haystack)
	{
		var indexOf = haystack.lastIndexOf(needle);

		if (indexOf >= 0)
		{
			return haystack.substring(0, indexOf) + replacement + haystack.substring(needle.length + indexOf);
		}

		return haystack;
	},

	replace_first(needle, replacement, haystack)
	{
		var indexOf = haystack.indexOf(needle);

		if (indexOf >= 0)
		{
			return haystack.substring(0, indexOf) + replacement + haystack.substring(needle.length + indexOf);
		}

		return haystack;
	},

	between(str, start, end)
	{
		var startIndex = str.indexOf(start);

		var endIndex = startIndex + str.substring(startIndex).indexOf(end);

		if (startIndex >= 0 && endIndex >= 0)
		{
			return str.substring(startIndex + start.length, endIndex);
		}

		return str;
	}
};