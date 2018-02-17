const url = require('url');

export const getUrlString = (host, pathname, params) => {
  const newUrl = require('url');
  const hostUrl = url.parse(host);
  return newUrl.format({
    ...hostUrl,
    pathname,
    query: params
  });
};

export const getHostname = (value) => {
  return new url.URL(value).host;
};

export const replaceHostInString = (value, newHost) => {
  const newUrl = new url.URL(value);
  newUrl.host = newHost;
  return newUrl.toString();
};
