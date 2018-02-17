import * as url from '../url';

describe(`url${typeof window === 'undefined' ? '.node' : ''}`, () => {
  describe('getUrlString', () => {
    test('returns a URL string from host and pathname', () => {
      expect(url.getUrlString('https://twitter.com', '/')).toEqual('https://twitter.com/');
    });

    test('returns a URL string with query params', () => {
      expect(url.getUrlString('https://twitter.com', '/', { foo: 'bar', baz: 'bop' })).toEqual(
        'https://twitter.com/?foo=bar&baz=bop'
      );
    });
  });

  describe('getHostname', () => {
    test('gets the host name from a string', () => {
      expect(url.getHostname('https://twitter.com')).toEqual('twitter.com');
      expect(url.getHostname('http://t.co')).toEqual('t.co');
    });
  });

  describe('replaceHostInString', () => {
    test('replaces the hostname in a URL string', () => {
      expect(url.replaceHostInString('https://twitter.com/', 't.co')).toEqual('https://t.co/');
      expect(url.replaceHostInString('https://twitter.com/foo/bar/baz', 't.co')).toEqual('https://t.co/foo/bar/baz');
      expect(url.replaceHostInString('https://twitter.com/foo?bar=baz', 't.co')).toEqual('https://t.co/foo?bar=baz');
    });
  });
});
