'use strict'

var request = require('request')
var extend = require('extend')

var VERSION = require('./package.json').version

function SunsetWx (options) {
  this.options = extend({
    email: null,
    password: null,
    key: null,
    base_url: 'https://sunburst.sunsetwx.com/v1/'
  }, options)

  this.token = null
  this.expiry = null
  this.authRequest = null

  // default request wrapper w/ user-agent and baseUrl
  this.request = request.defaults({
    headers: {'User-Agent': 'node-sunsetwx v' + VERSION},
    baseUrl: this.options.base_url,
    json: true
  })
}

SunsetWx.prototype.register = function (callback) {
  this.request({
    method: 'POST',
    uri: '/register',
    form: {
      email: this.options.email,
      password: this.options.password,
      key: this.options.key
    }
  }, callback)
}

SunsetWx.prototype.login = function (callback) {
  var that = this
  this.request({
    method: 'POST',
    uri: '/login',
    form: {
      email: this.options.email,
      password: this.options.password
    }
  }, function (err, response, body) {
    if (err) { return callback(err) }
    // on successful login, update token and expiration info,
    // and create new request wrapper with auth header
    that.token = body.token
    that.expiry = Date.now() + (body.token_exp_sec * 1000)
    that.authRequest = that.request.defaults({
      headers: {'Authorization': 'Bearer ' + that.token}
    })
    callback(null, response, body)
  })
}

SunsetWx.prototype.logout = function (callback) {
  var that = this
  this.__autoAuthRequest({
    method: 'POST',
    uri: '/logout'
  }, function (err, response, body) {
    if (err) { return callback(err) }
    // on successful logout, wipe token, expiry, and request wrapper
    that.token = null
    that.expiry = null
    that.authRequest = null
    callback(null, response, body)
  })
}

SunsetWx.prototype.deleteAccount = function (callback) {
  this.__autoAuthRequest({
    method: 'DELETE',
    uri: '/account'
  }, callback)
}

SunsetWx.prototype.passwordReset = function (callback) {
  this.request({
    method: 'POST',
    uri: '/account/password/reset',
    form: {
      email: this.options.email
    }
  }, callback)
}

SunsetWx.prototype.coordinates = function (params, callback) {
  this.__autoAuthRequest({
    method: 'GET',
    uri: '/coordinates',
    qs: params
  }, callback)
}

SunsetWx.prototype.location = function (params, callback) {
  this.__autoAuthRequest({
    method: 'GET',
    uri: '/location',
    qs: params
  }, callback)
}

SunsetWx.prototype.quality = function (params, callback) {
  this.__autoAuthRequest({
    method: 'GET',
    uri: '/quality',
    qs: params
  }, callback)
}

SunsetWx.prototype.__autoAuthRequest = function (params, callback) {
  var that = this
  if (!this.token || (this.expiry - Date.now()) / 1000 / 60 / 60 < 1) {
    this.login(function (err, response, body) {
      if (err) { return callback(err) }
      that.authRequest(params, callback)
    })
  } else {
    this.authRequest(params, callback)
  }
}

module.exports = SunsetWx
