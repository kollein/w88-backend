import { ROUND_STATUS } from "@/shared/index";

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
  12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
  24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
  36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
  48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
  60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
  72, 73, 74, 75, 76, 77, 78, 79, 80];

const rate = {
  bigSmall: 1.95,
  oddEven: 1.95,
  upDownDraw: 2.3,
  oddsEvensDraw: 2.3,
  cross: 3.7,
  fiveE: 9.2
};

const fiveEMap = {
  metal: [210, 695],
  wood: [696, 763],
  water: [764, 855],
  fire: [856, 923],
  earth: [924, 1410]
};

function get20Elements() {
  return arr.sort(() => (Math.random() > 0.5) ? 1 : -1).slice(0, 20)
}

function makeResult(type) {
  if (type === ROUND_STATUS.running) {
    return {
      nums: [],
      sum: null,
      bigSmall: null,
      oddEven: null,
      refund: false,
      upDownDraw: null,
      oddsEvensDraw: null,
      cross: null,
      fiveE: null,
      // stone, do later
    };
  }

  const nums = get20Elements();
  const exactPoint = 810;
  let sum = 0;
  let upCount = 0;
  let evensCount = 0;
  nums.forEach((x) => {
    sum += x;
    if (x > 40) upCount += 1;
    if (x % 2 === 0) evensCount += 1;
  });
  const bigSmall = sum > exactPoint ? 'big' : 'small';
  const oddEven = sum % 2 === 0 ? 'even' : 'odd';
  const refund = sum === exactPoint;
  let upDownDraw = 'draw';
  if (upCount !== 10) upDownDraw = upCount > 10 ? 'up' : 'down';
  let oddsEvensDraw = 'draw';
  if (evensCount !== 10) oddsEvensDraw = evensCount > 10 ? 'evens' : 'odds';
  let cross = `${bigSmall}-${oddEven}`;
  let fiveE = Object.keys(fiveEMap).find((x) => (fiveEMap[x][0] <= sum && sum <= fiveEMap[x][1]));

  return {
    nums,
    sum,
    bigSmall,
    oddEven,
    refund,
    upDownDraw,
    oddsEvensDraw,
    cross,
    fiveE,
    // stone, do later
  }
}

export {
  makeResult,
  rate,
}
