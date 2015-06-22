/*
 * Production steps of ECMA-262, Edition 6, 22.1.2.1
 * Reference : https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
 *
 */
if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
      // 1. Soit C, la valeur this
      var C = this;

      // 2. Soit items le ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError("Array.from doit utiliser un objet semblable à un tableau - null ou undefined ne peuvent pas être utilisés");
      }

      // 4. Si mapfn est undefined, le mapping sera false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. sinon      
        // 5. a. si IsCallable(mapfn) est false, on lève une TypeError.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: lorsqu il est utilisé le deuxième argument doit être une fonction');
        }

        // 5. b. si thisArg a été fourni, T sera thisArg ; sinon T sera undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Soit lenValue pour Get(items, "length").
      // 11. Soit len pour ToLength(lenValue).
      var len = toLength(items.length);

      // 13. Si IsConstructor(C) vaut true, alors
      // 13. a. Soit A le résultat de l'appel à la méthode interne [[Construct]] avec une liste en argument qui contient l'élément len.
      // 14. a. Sinon, soit A le résultat de ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Soit k égal à 0.
      var k = 0;
      // 17. On répète tant que k < len… 
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Soit putStatus égal à Put(A, "length", len, true).
      A.length = len;
      // 20. On renvoie A.
      return A;
    };
  }());
}