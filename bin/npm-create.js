#!/usr/bin/env node

var path = require( 'path' )
var fs = require( 'fs' )
var prompt = require( 'inquirer' ).prompt
var readdir = require( 'readdirp' )
var config = require( 'npmconf' )
var lookup = require( 'dotty' )

var target = process.cwd()

function render( template, data ) {
  return template.replace(
    /\{\{([^\}]+)\}\}/g,
    function( _, selector ) {
      selector = selector.replace( /^\s+|\s+$/g, '' )
      return lookup.get( data, selector ) || ''
    }
  )
}

function askQuestions( data, callback ) {
  
  prompt([{
    name: 'name',
    message: 'Module name',
    default: data.module.name
  },{
    name: 'prefix',
    type: 'input',
    message: 'Repository prefix',
    default: '',
    filter: function( input ) {
      return input && input.length ?
        input + '-' : ''
    },
  },{
    name: 'version',
    type: 'input',
    message: 'Version',
    default: data.module.version,
  },{
    name: 'description',
    type: 'input',
    message: 'Description',
    default: '',
  },{
    name: 'keywords',
    type: 'input',
    message: 'Keywords',
    default: '',
    filter: function( input ) {
      var words = !input || !input.length ? [] :
        input.replace( /^\s+|\s+$/g, '' ).split( /[,\s]+/g )
      return JSON.stringify( words )
    },
  },{
    name: 'license',
    type: 'list',
    message: 'License',
    default: data.module.licenseType,
    choices: [
      'MIT',
      'BSD-3-Clause',
      'BSD-2-Clause',
      'GPL-3.0',
      'Apache-2.0',
    ],
    filter: function( input ) {
      var filename = __dirname + '/../licenses/' + input + '.md'
      return {
        type: input,
        text: fs.readFileSync( filename, 'utf8' )
      }
    }
  },{
    name: 'main',
    type: 'input',
    message: 'Entry point',
    default: 'lib/'+data.module.name,
  },{
    name: 'test',
    type: 'list',
    message: 'Test utility',
    default: 'none',
    choices: [
      'none',
      'mocha',
    ],
    filter: function( input ) {
      switch( input ) {
        case 'mocha':
          return 'node node_modules/mocha/bin/mocha'
        default:
          return 'echo \\"Error: no test specified\\" && exit 1'
      }
    },
  }], function( results ) {
    
    data.module.name = results.name
    data.repo.prefix = results.prefix
    data.module.version = results.version
    data.module.description = results.description
    data.module.keywords = results.keywords
    data.module.licenseType = results.license.type
    data.module.main = results.main
    data.module.test = results.test
    
    data.module.license = render( results.license.text, data )
    
    callback( data )
    
  })
  
}

function writePackage( data, callback ) {
  
  var dirstream = readdir({
    root: __dirname + '/../templates',
  })
  
  dirstream.on( 'data', function( file ) {
    
    var dest = path.resolve( target, file.path )
    
    if( fs.existsSync( dest ) )
      return console.log( 'IGNORING', file.path )
    
    fs.readFile( file.fullPath, 'utf8', function( error, content ) {
      
      if( error != null )
        throw error
      
      content = render( content, data )
      
      if( /\.json$/i.test( file.name ) ) {
        content = JSON.stringify( JSON.parse( content ), null, 2 )
      }
      
      fs.writeFile( dest, content, function( error ) {
        if( error != null )
          throw error
      })
      
    })
    
  })
  
  
}

config.load( {}, function( error, npm ) {
  
  if( error != null )
    throw error
  
  var data = {
    date: {
      year: new Date().getFullYear()
    },
    author: {
      name: npm.get( 'init.author.name' ),
      url: npm.get( 'init.author.url' ),
      email: npm.get( 'init.author.email' ),
      github: npm.get( 'init.author.github' ),
    },
    module: {
      name: path.basename( target ),
      version: npm.get( 'init.version' ),
      licenseType: npm.get( 'init.license' ),
      license: '',
    },
    repo: {
      prefix: '',
    }
  }
  
  console.log( '' )
  askQuestions( data, writePackage )
  
})
