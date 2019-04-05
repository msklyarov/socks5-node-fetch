const HTTPAgent = require('socks5-http-client/lib/Agent');
const HTTPsAgent = require('socks5-https-client/lib/Agent');
const fetch = require('node-fetch');

module.exports = (options) => {
  options = options || {};

  const setting = {
    socksHost: options.socksHost || process.env.SOCKS5_PROXY_HOST,
    socksPort: options.socksPort || process.env.SOCKS5_PROXY_PORT
  };

  if (!setting.socksHost || !setting.socksPort) {
    return fetch;
  }

  const httpAgent = new HTTPAgent(setting);
  const httpsAgent = new HTTPsAgent(setting);

  const socks5Fetch = (options) => {
    if (options.url.startsWith('http://')) {
      options.agent = httpAgent;
    }
    if (options.url.startsWith('https://')) {
      options.agent = httpsAgent;
    }
    return fetch(options.url, options)
  };

  socks5Fetch.Response = fetch.Response;
  socks5Fetch.Headers = fetch.Headers;
  socks5Fetch.Request = fetch.Request;

  return socks5Fetch;
};
