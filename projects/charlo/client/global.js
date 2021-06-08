declare var global;

if (typeof global.self === 'undefined') {
  global.self = global
}

if (typeof btoa === 'undefined') {
  global.btoa = function(str) {
    return new Buffer(str, 'binary').toString('base64')
  }
}

global.Buffer = require('buffer').Buffer
global.process = require('process')
global.location = {
  protocol: 'https'
}
