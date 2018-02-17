# Jest Project Bleed Example

This repo is an example of an issue in the Jest test runner using multiple project configurations that define different `moduleFileExtensions`.

## Explanation

In some cases, we want to have code that is defined differently for a node.js environment than a browser/DOM environment. We do this to avoid needing to polyfill node.js's `url` module in the browser when we already have access to a powerful `window.URL` API in a browser (which is not available in node.js).

To do this, we set up our build environment to build server-side code with `moduleFileExtensions` to resolve `*.node.js` files before `*.js` files.

In Jest, we create two separate project configurations: `config/jest/node.js` and `config/jest/web.js`. These run the tests in the appropriate environment (`node` and `jsdom`, respectively).

This works great when you only include a module once in tests:

**Command:**
```
yarn jest -- src/__tests__/url.test.js --no-cache
```

**Output:**
```
yarn jest v0.27.5
$ "./jest-project-bleed/node_modules/.bin/jest" "src/__tests__/url.test.js"
 PASS   node  src/__tests__/url.test.js
 PASS   web  src/__tests__/url.test.js

Test Suites: 2 passed, 2 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        1.306s
Ran all test suites matching /src\/__tests__\/url.test.js/i in 2 projects.
Done in 2.19s.
```

However, if we have tests that reference the module that is split as `*.js` and `*.node.js` enough times (for this, I've used 3), we will see that Jest resolves the incorrect module once it has resolved it previously:

**Command:**
```
yarn jest -- --no-cache
```

**Output:**

```
yarn jest v0.27.5
$ "/Users/parmstrong/workspace/jest-project-bleed/node_modules/.bin/jest" "--no-cache"
 PASS   web  src/__tests__/foo.test.js
 PASS   web  src/__tests__/bar.test.js
 PASS   web  src/__tests__/url.test.js
 FAIL   node  src/__tests__/bar.test.js
  ● url.node › getUrlString › returns a URL string from host and pathname

    ReferenceError: window is not defined

      2 |
      3 | export const getUrlString = (host, pathname, params) => {
    > 4 |   const url = new window.URL(host);
      5 |   url.pathname = pathname;
      6 |   url.search = params ? `?${stringify(params)}` : '';
      7 |   return url.toString();

      at Object.getUrlString (src/url.js:4:13)
      at Object.<anonymous> (src/__tests__/bar.test.js:6:18)

  ● url.node › getUrlString › returns a URL string with query params

    ReferenceError: window is not defined

      2 |
      3 | export const getUrlString = (host, pathname, params) => {
    > 4 |   const url = new window.URL(host);
      5 |   url.pathname = pathname;
      6 |   url.search = params ? `?${stringify(params)}` : '';
      7 |   return url.toString();

      at Object.getUrlString (src/url.js:4:13)
      at Object.<anonymous> (src/__tests__/bar.test.js:10:18)

  ● url.node › getHostname › gets the host name from a string

    ReferenceError: window is not defined

       9 |
      10 | export const getHostname = (url) => {
    > 11 |   return new window.URL(url).hostname;
      12 | };
      13 |
      14 | export const replaceHostInString = (value, newHost) => {

      at Object.getHostname (src/url.js:11:3)
      at Object.<anonymous> (src/__tests__/bar.test.js:18:18)

  ● url.node › replaceHostInString › replaces the hostname in a URL string

    ReferenceError: window is not defined

      13 |
      14 | export const replaceHostInString = (value, newHost) => {
    > 15 |   const url = new window.URL(value);
      16 |   url.hostname = newHost;
      17 |   return url.toString();
      18 | };

      at Object.replaceHostInString (src/url.js:15:13)
      at Object.<anonymous> (src/__tests__/bar.test.js:25:18)

       FAIL   node  src/__tests__/foo.test.js
  ● url.node › getUrlString › returns a URL string from host and pathname

    ReferenceError: window is not defined

      2 |
      3 | export const getUrlString = (host, pathname, params) => {
    > 4 |   const url = new window.URL(host);
      5 |   url.pathname = pathname;
      6 |   url.search = params ? `?${stringify(params)}` : '';
      7 |   return url.toString();

      at Object.getUrlString (src/url.js:4:13)
      at Object.<anonymous> (src/__tests__/foo.test.js:6:18)

  ● url.node › getUrlString › returns a URL string with query params

    ReferenceError: window is not defined

      2 |
      3 | export const getUrlString = (host, pathname, params) => {
    > 4 |   const url = new window.URL(host);
      5 |   url.pathname = pathname;
      6 |   url.search = params ? `?${stringify(params)}` : '';
      7 |   return url.toString();

      at Object.getUrlString (src/url.js:4:13)
      at Object.<anonymous> (src/__tests__/foo.test.js:10:18)

  ● url.node › getHostname › gets the host name from a string

    ReferenceError: window is not defined

       9 |
      10 | export const getHostname = (url) => {
    > 11 |   return new window.URL(url).hostname;
      12 | };
      13 |
      14 | export const replaceHostInString = (value, newHost) => {

      at Object.getHostname (src/url.js:11:3)
      at Object.<anonymous> (src/__tests__/foo.test.js:18:18)

  ● url.node › replaceHostInString › replaces the hostname in a URL string

    ReferenceError: window is not defined

      13 |
      14 | export const replaceHostInString = (value, newHost) => {
    > 15 |   const url = new window.URL(value);
      16 |   url.hostname = newHost;
      17 |   return url.toString();
      18 | };

      at Object.replaceHostInString (src/url.js:15:13)
      at Object.<anonymous> (src/__tests__/foo.test.js:25:18)

 FAIL   node  src/__tests__/url.test.js
  ● url.node › getUrlString › returns a URL string from host and pathname

    ReferenceError: window is not defined

      2 |
      3 | export const getUrlString = (host, pathname, params) => {
    > 4 |   const url = new window.URL(host);
      5 |   url.pathname = pathname;
      6 |   url.search = params ? `?${stringify(params)}` : '';
      7 |   return url.toString();

      at Object.getUrlString (src/url.js:4:13)
      at Object.<anonymous> (src/__tests__/url.test.js:6:18)

  ● url.node › getUrlString › returns a URL string with query params

    ReferenceError: window is not defined

      2 |
      3 | export const getUrlString = (host, pathname, params) => {
    > 4 |   const url = new window.URL(host);
      5 |   url.pathname = pathname;
      6 |   url.search = params ? `?${stringify(params)}` : '';
      7 |   return url.toString();

      at Object.getUrlString (src/url.js:4:13)
      at Object.<anonymous> (src/__tests__/url.test.js:10:18)

  ● url.node › getHostname › gets the host name from a string

    ReferenceError: window is not defined

       9 |
      10 | export const getHostname = (url) => {
    > 11 |   return new window.URL(url).hostname;
      12 | };
      13 |
      14 | export const replaceHostInString = (value, newHost) => {

      at Object.getHostname (src/url.js:11:3)
      at Object.<anonymous> (src/__tests__/url.test.js:18:18)

  ● url.node › replaceHostInString › replaces the hostname in a URL string

    ReferenceError: window is not defined

      13 |
      14 | export const replaceHostInString = (value, newHost) => {
    > 15 |   const url = new window.URL(value);
      16 |   url.hostname = newHost;
      17 |   return url.toString();
      18 | };

      at Object.replaceHostInString (src/url.js:15:13)
      at Object.<anonymous> (src/__tests__/url.test.js:25:18)

Test Suites: 3 failed, 3 passed, 6 total
Tests:       12 failed, 12 passed, 24 total
Snapshots:   0 total
Time:        2.619s
Ran all test suites in 2 projects.
error Command failed with exit code 1.
```
