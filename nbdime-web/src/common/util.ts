// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';

/**
 * Check whether a value is in an array.
 */
export
function valueIn(value: any, array: Array<any>) {
  return array.indexOf(value) >= 0;
}


/**
 * Deepcopy routine for JSON-able data types
 */
export
function deepCopy(obj) {
  if (typeof obj === 'object') {
    if (obj === null) {
      return null;
    } else if (obj instanceof Array) {
      let l = obj.length;
      let o = new Array(l);
      for (let i = 0; i < l; i++) {
        o[i] = deepCopy(obj[i]);
      }
      return o;
    } else {
      let r: any = {};
      if (obj.prototype !== undefined) {
        r.prototype = obj.prototype;
      }
      for (let k in obj) {
        r[k] = deepCopy(obj[k]);
      }
      return r;
    }
  }
  return obj;
}

/**
 * Shallow copy routine for objects
 */
export
function shallowCopy<T>(original: T): T {
  // First create an empty object with
  // same prototype of our original source
  let clone = Object.create(Object.getPrototypeOf(original));

  for (let k in original) {
    // Don't copy function
    if (original[k] !== null &&
        original[k].hasOwnProperty('constructor') &&
        original[k].constructor === Function) {
      continue;
    }
    let pDesc = Object.getOwnPropertyDescriptor(original, k);
    // Don't copy properties with getter
    if (!pDesc || pDesc.get) {
      continue;
    }
    // copy each property into the clone
    Object.defineProperty(clone, k, pDesc);
  }
  return clone;
}

/**
 * Do a shallow, element-wise equality comparison on two arrays.
 */
export
function arraysEqual(a: any[], b: any[]) {
  if (a === b) {
    return true;
  }
  if (a === null || b === null) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}


/**
 * Find the shared common starting sequence in two arrays
 */
export
function findSharedPrefix(a: any[], b: any[]): any[] {
  if (a === null || b === null) {
    return null;
  }
  if (a === b) {  // Only checking for instance equality
    return a.slice();
  }
  let i = 0;
  for (; i < Math.min(a.length, b.length); ++i) {
    if (a[i] !== b[i]) {
      break;
    }
  }
  return a.slice(0, i);
}

/**
 * Check whether `parent` is contained within the start of `child`
 *
 * Note on terminology: Parent is here the shortest array, as it will
 * be the parent in a tree-view of values, e.g. a path. In other words, parent
 * is a subsequence of child.
 */
export
function isPrefixArray(parent: any[], child: any[]): boolean {
  if (parent === child) {
    return true;
  }
  if (parent === null || parent.length === 0) {
    return true;
  }
  if (child === null || parent.length > child.length) {
    return false;
  }
  for (let i = 0; i < parent.length; ++i) {
    if (parent[i] !== child[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Sort array by attribute `key` (i.e. compare by array[0][key] < array[1][key])
 */
export
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        let x = a[key]; let y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}


/**
 * Utility function to repeat a string
 */
export
function repeatString(str: string, count: number): string {
  if (count < 1) {
    return '';
  }
  let result = '';
  let pattern = str.valueOf();
  while (count > 1) {
    if (count & 1) {
      result += pattern;
    }
    count >>= 1, pattern += pattern;
  }
  return result + pattern;
}

/**
 * Calculate the cumulative sum of string lengths for an array of strings
 *
 * Example:
 *   For the arary ['ab', '123', 'y', '\t\nfoo'], the output would be
 *   [2, 5, 6, 11]
 */
export
function accumulateLengths(arr: string[]) {
  let ret: number[] = [];
  arr.reduce<number>(function(a: number, b: string, i: number): number {
    return ret[i] = a + b.length;
  }, 0);
  return ret;
}
