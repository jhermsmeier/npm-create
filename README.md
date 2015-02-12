# npm-create
[![npm](http://img.shields.io/npm/v/npm-create.svg?style=flat-square)](https://npmjs.com/npm-create)
[![npm downloads](http://img.shields.io/npm/dm/npm-create.svg?style=flat-square)](https://npmjs.com/npm-create)
[![build status](http://img.shields.io/travis/jhermsmeier/npm-create.svg?style=flat-square)](https://travis-ci.org/jhermsmeier/npm-create)

## Install via [npm](https://npmjs.com)

```sh
$ npm install npm-create
```

## Usage

```sh
# Create & enter the directory for your module
$ mkdir some-package && cd some-package
# Run it
$ npm-create
# Answer the questions
? Module name: (test)
? Repository prefix: ()
? Version: (0.0.0) 1.0.0
? Description: () Some description of your module
? Keywords: () key, words, test, useless
? License: (Use arrow keys)
> MIT
  BSD-3-Clause
  BSD-2-Clause
  GPL-3.0
  Apache-2.0
? Entry point: (lib/test)
? Test utility: (Use arrow keys)
> none
  mocha
# You're done
```
