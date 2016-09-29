/* global describe it before */
'use strict'

var assert = require('assert')
var nock = require('nock')
var SunsetWx = require('../index.js')

var VERSION = require('../package.json').version

describe('SunsetWx', function () {
  describe('Constructor', function () {
    var defaults = {}

    before(function () {
      defaults = {
        email: null,
        password: null,
        key: null,
        request_options: {
          base_url: 'https://sunburst.sunsetwx.com/v1/'
        }
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

    it('has a default request object', function () {
      var client = new SunsetWx(defaults)

      assert(client.hasOwnProperty('request'))
      assert(typeof client.request === 'function')
    })

    describe('Request Object', function () {
      it('overrides default options', function (done) {
        var client = new SunsetWx({
          request_options: {
            headers: {'User-Agent': 'foo'}
          }
        })

        nock('http://test').get('/').reply(200)

        client.request('http://test/', function (err, response) {
          assert.ifError(err)

          var headers = response.request.headers

          assert(headers.hasOwnProperty('User-Agent'))
          assert.equal(headers['User-Agent'], 'foo')

          done()
        })
      })

      it('accepts new options', function (done) {
        var client = new SunsetWx({
          request_options: {
            headers: {foo: 'bar'}
          }
        })

        nock('http://test').get('/').reply(200)

        client.request('http://test/', function (err, response) {
          assert.ifError(err)

          var headers = response.request.headers

          assert(headers.hasOwnProperty('foo'))
          assert.equal(headers.foo, 'bar')

          done()
        })
      })

      it('expects json responses', function (done) {
        var client = new SunsetWx()

        nock('http://test').get('/').reply(200)

        client.request('http://test/', function (err, response) {
          assert.ifError(err)

          var headers = response.request.headers

          assert(headers.hasOwnProperty('accept'))
          assert.equal(headers.accept, 'application/json')

          done()
        })
      })

      it('has the correct default User-Agent header', function (done) {
        var client = new SunsetWx()

        nock('http://test').get('/').reply(200)

        client.request('http://test/', function (err, response) {
          assert.ifError(err)

          var headers = response.request.headers

          assert(headers.hasOwnProperty('User-Agent'))
          assert.equal(headers['User-Agent'], 'node-sunsetwx/' + VERSION)

          done()
        })
      })

      it('does not allow json settings to be changed', function (done) {
        var client = new SunsetWx({
          request_options: {
            json: false
          }
        })

        nock('http://test').get('/').reply(200)

        client.request('http://test/', function (err, response) {
          assert.ifError(err)

          var headers = response.request.headers

          assert(headers.hasOwnProperty('accept'))
          assert.equal(headers.accept, 'application/json')

          done()
        })
      })
    })
  })
})
