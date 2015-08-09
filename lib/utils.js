'use strict';

/**
 * Expose `utils`
 */

var utils = module.exports;

/**
 * Add a non-enumerable property to `receiver`
 *
 * @param  {Object} `obj`
 * @param  {String} `name`
 * @param  {Function} `val`
 */

utils.defineProp = function defineProp(receiver, key, value) {
  return Object.defineProperty(receiver, key, {
    configurable: true,
    enumerable: false,
    writable: true,
    value: value
  });
};

/**
 * Delegate non-enumerable properties from `provider` to `receiver`.
 *
 * @param  {Object} `receiver`
 * @param  {Object} `provider`
 */

utils.delegate = function delegate(receiver, provider) {
  for (var method in provider) {
    utils.defineProp(receiver, method, provider[method]);
  }
};

/**
 * Default settings to use for GitHub API requests.
 *
 * @param  {Object} `config`
 * @return {Object}
 */

utils.defaults = function (config) {
  return function defaults(method, path, data) {
    var opts = config || {};
    opts.path = createURL(path, config.apiurl);
    opts.method = method || 'GET';
    opts.headers = {
      'authorization': createAuth(opts)
    };

    opts.method = opts.method || method;
    opts.headers = opts.headers || {};
    if (data && !opts.headers['content-type']) {
      opts.headers['content-type'] = 'application/json';
    }
    if (!opts.headers['accept']) {
      opts.headers['accept'] = 'application/json';
    }
    if (!opts.body && opts.method.toLowerCase() === 'put') {
      opts.headers['content-length'] = 0;
    }

    opts['user-agent'] = opts['user-agent'] || 'github-base-nodejs';
    opts.apiurl = opts.apiurl || 'https://api.github.com';

    opts.headers['authorization'] = createAuth(opts);
    delete opts.PASSWORD;
    delete opts.USERNAME;
    delete opts.TOKEN;

    return opts;
  };
};

function createURL(url, base) {
  if (url.indexOf('//') === -1) {
    url = base + url;
  }
  url += (/\?/.test(url) ? '&' : '?');
  url += (new Date()).getTime();
  return url;
}

function createAuth(opts) {
  opts = lowercase(opts || {});
  if (opts.token) return 'token ' + opts.token;
  var creds = opts.username + ':' + opts.password;
  return 'Basic ' + toBase64(creds);
}

/**
 * Lowercase the keys in the given object.
 */

function lowercase(obj) {
  var res = {};
  for (var key in obj) {
    res[key.toLowerCase()] = obj[key];
  }
  return res;
}

/**
 * Convert a string to base64
 */

function toBase64(str) {
  return new Buffer(str).toString('base64');
}