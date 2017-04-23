# gatt

Generate All The Things using a template reader/writer pattern.

## Usage

First download and install gatt

```
npm install gatt
```

Next you will need to create some file, for example, `foo.js`

```
// foo.js

var gatt = require('gatt');

var variables = {
	"foo": "Hello there!",
	"bar": { "a": 'asdf' },
	"baz": [
		'a', 'b', 'c'
	],
	"bap": [
		{ 'a' : 1 },
		{ 'a' : 2 },
		{ 'a' : 3 }
	]
};

gatt({
	reader_directory: 'template/',
	writer_directory: 'built/',
	variables: variables
});
```

We need to create the folders `template/` and `built/` or we will get an error. Let's create them and run our example!

```
mkdir template
mkdir built

touch template/{foo}.txt
touch template/{bar.a}.txt
touch template/{baz[]}.txt
touch template/{bap[].a}.txt

node foo.js
```

If we are lucky, we should see some new files created inside our `built/` folder.

```
built/

```


## Example Templates

Out of the box the parser uses [blueimp-tmpl](https://github.com/blueimp/JavaScript-Templates). You can override this if you want to use some other parser. Here is some example syntax available from blueimp-tmpl. If you put this in your files you should see your content update when the file is built.

```
// inside of template/{bar[]}.txt
this instance of bar = {%= $.$bar %} 
this key for bar {%= $.$ %}
```

You can nest arrays of arrays as well, for example:

```
touch template/{baz[]}/{baz[]}/{$baz}/{$$baz}/{bap[].a}.txt
```

After building you would be left with a directory structure like this:

```
  built/a/a/a/a/1.txt
  built/a/a/a/a/2.txt
  built/a/a/a/a/3.txt
  built/a/b/a/b/1.txt
  built/a/b/a/b/2.txt
  built/a/b/a/b/3.txt
  built/a/c/a/c/1.txt
  built/a/c/a/c/2.txt
  built/a/c/a/c/3.txt

  built/b/a/a/a/1.txt
  built/b/a/b/a/2.txt
  built/b/a/b/a/3.txt
  built/b/b/b/b/1.txt
  built/b/b/b/b/2.txt
  built/b/b/b/b/3.txt
  built/b/c/b/c/1.txt
  built/b/c/b/c/2.txt
  built/b/c/b/c/3.txt

  built/c/a/c/a/1.txt
  built/c/a/c/a/2.txt
  built/c/a/c/a/3.txt
  built/c/b/c/b/1.txt
  built/c/b/c/b/2.txt
  built/c/b/c/b/3.txt
  built/c/c/c/c/1.txt
  built/c/c/c/c/2.txt
  built/c/c/c/c/3.txt

```

*Holy permutations batman!*

Notice above that I accessed the current array iteration's value of `{$baz}` and `{$$baz}`? You also have access to these values inside your template files as well. This example is a bit crazy but it shows you how flexible templates can be.


## Advanced Configuration

Every aspect of GATT is configurable. Here is all the default config options. Theoritically you could override
the default reader, builder, parser, or writer if you wanted to change behavior. 

```
gatt({
    "variables": null,                // this is an object of variables to use
    "reader_directory": null,         // directory we will be using for our template
    "writer_directory": null,         // directory we will output files into

    "reader"  : new reader,           // this is how we handle reading a template directory
    "builder" : new builder,          // this is how we handle building out files and dynamic context
    "parser"  : new parser,           // this is how we handle parsing each file in files array
    "writer"  : new writer            // this is how we handle writing out a single file
})
```

*NEED PICTURE HERE ON PIPELINE FOR READER -> BUILDER -> PARSER -> WRITER*



## TODO: 

* Need to add description on how to use this thing at some point...
* Maybe a video would be nice too?
* Write performance tests - make a template with a lot of variables and files and get the stop - start benchmark for it...  then we can start writing 
	- make parser.parse non-blocking (async) does it help performance?
	- make a cache that only processes things that have changed? does it help performance?
	- does flatten help boost performance?


