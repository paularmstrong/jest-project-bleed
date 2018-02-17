import { stringify } from 'querystring';

export const getUrlString = (host, pathname, params) => {
  const url = new window.URL(host);
  url.pathname = pathname;
  url.search = params ? `?${stringify(params)}` : '';
  return url.toString();
};

export const getHostname = (url) => {
  return new window.URL(url).hostname;
};

export const replaceHostInString = (value, newHost) => {
  const url = new window.URL(value);
  url.hostname = newHost;
  return url.toString();
};
