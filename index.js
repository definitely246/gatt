"use strict";

var generator = require("./src/generator.js");

module.exports = function(config) {
	return new generator(config);
};