Feature detect: Generators
==========================

This library detects at installation time whether your current environment supports [generators][1].

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*

Usage
-----

```bash
npm install --save feature-detect-generators
```

If generators are supported, nothing happens, but if they aren't the preinstall script will print an error and exit with a non-zero value. This package exports nothing, and is useless as a runtime dependency.

---

License: [MIT](http://mstade.mit-license.org/)