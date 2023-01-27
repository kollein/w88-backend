function currentTime() { return new Date().getTime(); }

// Ref: https://www.geeksforgeeks.org/print-all-possible-combinations-of-r-elements-in-a-given-array-of-size-n/amp/
function combineRInN(arr, r) {
  const result = [];
  function combinationUtil(n, i, o, t, r, l) {
    if (r === l) {
      const item = [];
      for (let n = 0; n < l; n++) {
        item.push(i[n]);
      }
      result.push(item);
    }
    for (let a = o; a <= t && t - a + 1 >= l - r; a++)
      (i[r] = n[a]), combinationUtil(n, i, a + 1, t, r + 1, l);
  }
  const n = arr.length;
  const data = new Array(r);
  combinationUtil(arr, data, 0, n - 1, 0, r);
  console.log('result', result);
}

export {
  currentTime,
  combineRInN,
}