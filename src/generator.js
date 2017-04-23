"use strict";

let fs        = require('fs');
let str_utils = require('./str_utils.js');
let utils     = require('./utils.js');
let reader    = require('./reader.js');
let builder   = require('./builder.js');
let parser    = require('./parser.js');
let writer    = require('./writer.js');

let configDefault = {
    "variables": null,                // this is an object of variables to use
    "reader_directory": null,         // directory we will be using for our template
    "writer_directory": null,         // directory we will output files into

    "reader"  : new reader,           // this is how we handle reading a template directory
    "builder" : new builder,          // this is how we handle building out files and dynamic context
    "parser"  : new parser,           // this is how we handle parsing each file in files array
    "writer"  : new writer            // this is how we handle writing out a single file
}

function assertConfigValid(config)
{
    if (typeof config.variables != 'object')
    {
        throw "Variables needs to be an object";
    }

    if (!fs.existsSync(config.reader_directory))
    {
        throw "Reader directory does not exist: " + config.reader_directory;
    }

    if (!fs.existsSync(config.writer_directory))
    {
        throw "Writer directory does not exist: " + config.writer_directory;
    }
}

class generator {

    constructor (config = {}) {
        this.config = utils.extend(configDefault, config);
        assertConfigValid(this.config);
    }

    run() {
        var promises = [];

        this.files().map((file) => {
            this.build(file).map((build) => {
                promises.push(this.write(build.path, this.parse(build.original, build.variables)));
            });
        });

        return Promise.all(promises);
    }

    files() {
        return this.config.reader.files(
            this.config.reader_directory
        );        
    }

    build(file) {
        return this.config.builder.build(
            file, this.config.variables
        )
    }

    parse(file, variables = null) {
        variables = variables != null ? variables : this.config.variables;
        return this.config.parser.parse(
            file, variables
        );
    }

    write(file_path, file_content) {
        let relative_path = str_utils.replace_first(this.config.reader_directory, '', file_path);
        let fullpath = this.config.writer_directory + relative_path;
        let dirname = utils.dirname(fullpath);
        let basename = utils.basename(fullpath);

        return this.config.writer.write( dirname, basename, file_content );
    }
}

module.exports = generator;