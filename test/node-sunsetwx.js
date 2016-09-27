/* global describe it before */
'use strict'

var assert = require('assert')
// var nock = require('nock')
var SunsetWx = require('../index.js')

// var VERSION = require('../package.json').version

describe('SunsetWx', function () {
  describe('Constructor', function () {
    var defaults = {}

    before(function () {
      defaults = {
        email: null,
        password: null,
        key: null,
        request_options: null
      }
    })

    it('creates a new instance', function () {
      var client = new SunsetWx()
      assert(client instanceof SunsetWx)
    })

    it('has default options', function () {
      var client = new SunsetWx()
      assert.deepEqual(
        Object.keys(defaults),
        Object.keys(client.options)
      )
    })

    it('overrides default options', function () {
      var options = {
        email: 'test@example.com',
        password: '12345',
        request_options: {
          base_url: 'https://example.com',
          headers: {
            bar: 'baz'
          }
        }
      }

      var client = new SunsetWx(options)

      assert.equal(client.options.email, options.email)
      assert.equal(client.options.password, options.password)
      assert.equal(
        client.options.request_options.base_url,
        options.request_options.base_url
      )
      assert.equal(
        client.options.request_options.headers.bar,
        options.request_options.headers.bar
      )
    })

    it('accepts new options', function () {
      var options = {
        ping: 'pong'
      }

      var client = new SunsetWx(options)

      assert(client.options.hasOwnProperty('ping'))
      assert.equal(client.options.ping, options.ping)
    })
  })
})
