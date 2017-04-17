"use strict";

import {extend} from 'util';

// import content_parser from './content_parser.js';
// import template_parser from './template_parser.js';
// import writer from './writer.js';

// var extend = require('util')._extend;

function assertConfigValid(config)
{
    // fs.existsSync    

    // assert variables is not null!

    // assert the template directory is a directory

    // assert the output_directory is a real directory

}

let configDefault = {
    "variables": null,                            // 
    "writer": writer,
    "reader": reader,

    "template_directory": null,                   // directory we will be using for our template
    // "output_directory": null,                     // directory we will output files into
    // "content_parser": "./content_parser.js",      // parse each file's content using this method 
    // "naming_parser": "./naming_parser.js",        // parse each filename/directory name using this method
    // "writer": "./writer.js"                       // handles writing the files array to an output directory
}

class generator {

    constructor (config = {}) {

        this.config = extend(configDefault, config);

        assertConfigValid(this.config);
    }

    run() {

        this.
        console.log(this.config.variables);
        // var variables = this.config.variables;

        // console.log('this is the variables path', variables);

        // var exported = require(variables);

        // console.log(exported);

        // console.log('running this bad boy!');
    }
}

module.exports = generator;