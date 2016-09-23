# node-sunsetwx :sunrise:

node-sunsetwx is a Node.js wrapper for [SunsetWx](https://sunsetwx.com)'s [Sunburst API](https://sunburst.sunsetwx.com/v1/docs/), which provides sunset and sunrise quality forecasts.

Currently, the API is in beta. To get started you need to email [team@sunsetwx.com](mailto:team@sunsetwx.com) to get a registration key.

You'll want to reference the [Sunburst API docs](https://sunburst.sunsetwx.com/v1/docs/) for more detailed info on parameters and responses.

## Installation

```shell
$ npm install node-sunsetwx
```

## Registering

Before you interact with the API, you need to register your email address and password using the registration key you received. This is a one-time task. An email confirmation will be sent, which you need to acknowledge before you'll be able to log in.

Since you'll only be doing this once, you might as well do it in the interactive Node.js REPL:

```shell
$ node
```

Load the library:

```javascript
var SunsetWx = require('node-sunsetwx');
```

Create the API object, including your email, a password (longer than six characters, at least one uppercase, one lowercase, and one number), and your registration key:

```javascript
var sunsetwx = new SunsetWx({
  email: 'you@example.com',
  password: '12345Ab',
  key: 'fOd2dUpB3L5oq42CKOq7NPsX'
});
```

Call the `.register` method, with a callback to print the response:

```javascript
sunsetwx.register(function(err, response, body){
  console.log(body);
});
```

You should see this:

```json
{
  "message": "Verification email sent"
}
```

Click the link in the verification email before continuing.


## Usage

**Note:** all callbacks are passed directly to the [`requests` library](https://github.com/request/request), which handles the actual https request. Thus, callbacks will receive the following as described by `requests`:

1. An `error`, if applicable
2. An [`http.IncomingMessage`](https://nodejs.org/api/http.html#http_class_http_incomingmessage) object
3. The `response` body, as a JSON object

For much more detail on API parameters and responses, please read [the Sunburst API Docs](https://sunburst.sunsetwx.com/v1/docs/).


### Constructor

Creates a new API object with (minimally) your email and password. Automatically handles login, authentication, and auth token refresh.

```javascript
var sunsetwx = new SunsetWx({
  email: 'you@example.com',
  password: '12345Ab'
});
```

#### Parameters
* `email`: _(required)_ the email you signed up with
* `password`: _(required)_ the password you chose when registering
* `key`: _(optional)_ your registration key, only required for registration
* `base_url`: _(optional)_ an alternate base URL for the API. _(default: https://sunburst.sunsetwx.com/v1/)_


### .register(callback)

Registers the `email` and `password` using the `key` provided to the constructor.

```javascript
sunsetwx.register(callback)
```


### .login(callback)

Logs in using the `email` and `password` provided to the constructor, storing the auth token for use during subsequent API calls. This is handled automatically, so you should actually never have to call `.login()` manually.

```javascript
sunsetwx.login(callback)
```


### .logout(callback)

Logs out the current auth token and destroys it.

```javascript
sunsetwx.logout(callback)
```


### .passwordReset(callback)

Triggers a password reset request. You will receive an email with a link to complete the process.

```javascript
sunsetwx.passwordReset(callback)
```


### .deleteAccount(callback)

Deletes the current account. **Note: this cannot be undone.**

```javascript
sunsetwx.deleteAccount(callback)
```


### .coordinates(params, callback)

Returns longitude and latitude coordinates for the given `location` string.

```javascript
sunsetwx.coordinates({
  location: 'Rochester, NY'
}, callback)
```

#### Parameters

* `location`: _(required)_ a string that contains a location name


### .location(params, callback)

Returns a location name for the coordinates in `coords`

```javascript
sunsetwx.location({
  coords: '-77.331536,43.271152'
}, callback)
```

#### Parameters

* `coords`: _(required)_ a string that contains valid longitude and latitude, separated by only a comma.


### .quality(params, callback)
```javascript
sunsetwx.quality({
  coords: '-77.331536,43.271152',
  type: 'sunset',
  location: 'northamerica',
  radius: '24.02',
  limit: '42',
  timestamp: '2016-07-07T16:26:08Z'
}, callback)
```

#### Parameters

* `coords`: _(required)_ a string that contains valid longitude and latitude, separated by only a comma.
* `type`: _(required)_ a string to indicate 'sunrise' or 'sunset'
* `location`: _(optional)_ a string containing a valid model location of 'global' or 'northamerica'
* `radius`: _(optional)_ a number that limits the returned points to the indicated radius in kilometers.
* `limit`: _(optional)_ an integer that limits the number of returned points
* `timestamp`: _(optional)_ [a valid RFC3339 timestamp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) within the next three days, for prediction of future sunrises and sunsets.


## Contributing

Sure.

## License

This software is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
