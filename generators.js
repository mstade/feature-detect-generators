/* Tests copied from https://github.com/kangax/compat-table

Copyright (c) 2010-2013 Juriy Zaytsev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

exports.feature = 'Generators'

exports.tests =
[ [ 'basic functionality'
  , function() {
      function * generator(){
        yield 5; yield 6;
      };
      var iterator = generator();
      var item = iterator.next();
      var passed = item.value === 5 && item.done === false;
      item = iterator.next();
      passed    &= item.value === 6 && item.done === false;
      item = iterator.next();
      passed    &= item.value === undefined && item.done === true;
      return passed;
    }
  ]
, [ 'correct \"this\" binding'
  , function() {
      function * generator(){
        yield this.x; yield this.y;
      };
      var iterator = { g: generator, x: 5, y: 6 }.g();
      var item = iterator.next();
      var passed = item.value === 5 && item.done === false;
      item = iterator.next();
      passed    &= item.value === 6 && item.done === false;
      item = iterator.next();
      passed    &= item.value === undefined && item.done === true;
      return passed;
    }
  ]
, [ 'sending'
  , function() {
      var sent;
      function * generator(){
        sent = [yield 5, yield 6];
      };
      var iterator = generator();
      iterator.next();
      iterator.next("foo");
      iterator.next("bar");
      return sent[0] === "foo" && sent[1] === "bar";
    }
  ]
, [ '%GeneratorPrototype%'
  , function() {
      function * generatorFn(){}
      var ownProto = Object.getPrototypeOf(generatorFn());
      var passed = ownProto === generatorFn.prototype;
      var sharedProto = Object.getPrototypeOf(ownProto);
      passed &= sharedProto !== Object.prototype &&
        sharedProto === Object.getPrototypeOf(function*(){}.prototype) &&
        sharedProto.hasOwnProperty('next');
      return passed;
    }
  ]
, [ '%GeneratorPrototype%.throw'
  , function() {
      var passed = false;
      function * generator(){
        try {
          yield 5; yield 6;
        } catch(e) {
          passed = (e === "foo");
        }
      };
      var iterator = generator();
      iterator.next();
      iterator.throw("foo");
      return passed;
    }
  ]
// , [ '%GeneratorPrototype%.return'
//   , function() {
//       function * generator(){
//         yield 5; yield 6;
//       };
//       var iterator = generator();
//       var item = iterator.next();
//       var passed = item.value === 5 && item.done === false;
//       item = iterator.return("quxquux");
//       passed    &= item.value === "quxquux" && item.done === true;
//       item = iterator.next();
//       passed    &= item.value === undefined && item.done === true;
//       return passed;
//     }
//   ]
, [ 'yield operator precedence'
  , function() {
      var passed;
      function * generator(){
        passed = yield 0 ? true : false;
      };
      var iterator = generator();
      iterator.next();
      iterator.next(true);
      return passed;
    }
  ]
, [ 'yield *, arrays'
  , function () {
      var iterator = (function * generator() {
        yield * [5, 6];
      }());
      var item = iterator.next();
      var passed = item.value === 5 && item.done === false;
      item = iterator.next();
      passed    &= item.value === 6 && item.done === false;
      item = iterator.next();
      passed    &= item.value === undefined && item.done === true;
      return passed;
    }
  ]
, [ 'yield *, strings'
  , function () {
      var iterator = (function * generator() {
        yield * "56";
      }());
      var item = iterator.next();
      var passed = item.value === "5" && item.done === false;
      item = iterator.next();
      passed    &= item.value === "6" && item.done === false;
      item = iterator.next();
      passed    &= item.value === undefined && item.done === true;
      return passed;
    }
  ]
, [ 'yield *, astral plane strings'
  , function () {
      var iterator = (function * generator() {
        yield * "𠮷";
      }());
      var item = iterator.next();
      var passed = item.value === "𠮷" && item.done === false;
      item = iterator.next();
      passed    &= item.value === undefined && item.done === true;
      return passed;
    }
  ]
// , [ 'yield *, generic iterables'
//   , function () {
//       var iterator = (function * generator() {
//         yield * global.__createIterableObject(5, 6, 7);
//       }());
//       var item = iterator.next();
//       var passed = item.value === 5 && item.done === false;
//       item = iterator.next();
//       passed    &= item.value === 6 && item.done === false;
//       item = iterator.next();
//       passed    &= item.value === 7 && item.done === false;
//       item = iterator.next();
//       passed    &= item.value === undefined && item.done === true;
//       return passed;
//     }
//   ]
// , [ 'yield *, instances of iterables'
//   , function () {
//       var iterator = (function * generator() {
//         yield * Object.create(__createIterableObject(5, 6, 7));
//       }());
//       var item = iterator.next();
//       var passed = item.value === 5 && item.done === false;
//       item = iterator.next();
//       passed    &= item.value === 6 && item.done === false;
//       item = iterator.next();
//       passed    &= item.value === 7 && item.done === false;
//       item = iterator.next();
//       passed    &= item.value === undefined && item.done === true;
//       return passed;
//     }
//   ]
// , [ 'shorthand generator methods'
//   , function() {
//       var o = {
//         * generator() {
//           yield 5; yield 6;
//         },
//       };
//       var iterator = o.generator();
//       var item = iterator.next();
//       var passed = item.value === 5 && item.done === false;
//       item = iterator.next();
//       passed    &= item.value === 6 && item.done === false;
//       item = iterator.next();
//       passed    &= item.value === undefined && item.done === true;
//       return passed;
//     }
//   ]
// , [ 'computed shorthand generators'
//   , function() {
//       var garply = "generator";
//       var o = {
//         * [garply] () {
//           yield 5; yield 6;
//         },
//       };
//       var iterator = o.generator();
//       var item = iterator.next();
//       var passed = item.value === 5 && item.done === false;
//       item = iterator.next();
//       passed    &= item.value === 6 && item.done === false;
//       item = iterator.next();
//       passed    &= item.value === undefined && item.done === true;
//       return passed;
//     }
//   ]
]