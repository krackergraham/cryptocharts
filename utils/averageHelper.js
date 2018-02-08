export const averageProjected = function (point1, point2, toFixed = false) {
  const [time1, bal1] = point1;
  const [time2, bal2] = point2;

  // Time diff in minutes
  const timeDiff = (Date.parse(time2) - Date.parse(time1)) / 60000;
  // console.log(timeDiff)
  const minAvg = (bal2 - bal1) / timeDiff;
  // Project earnings to 24 hrs
  const dayAvg = minAvg * 60 * 24;

  // Return null value if > 0 as we want to span that value in the chart and not go negative
  let res = dayAvg < 0 ? null : dayAvg;

  if (toFixed && res != null) res = res.toFixed(8);

  return res;
};

export const getSummedBalanceArray = function (arrayBal, arrayPen, ind) {
  let f = arrayBal[ind][1];
  let s = arrayPen[ind][1];

  return getSummedBalance(f, s, arrayBal[ind][0]);
};

export const getSummedBalance = function (valOne, valTwo, date) {
  let isZero = (valOne === 0 || valTwo === 0);

  let val = isZero ? null : valOne + valTwo;
  return [date, val];
};

export const lastNonZeroIndex = function (array, offset = 0) {
  let ind = array.length - 1 - offset;

  while (ind >= 0 && array[ind][1] === 0)
    ind--;

  return ind;
};

export const firstNonZeroIndex = function (array, offset = 0) {
  let ind = offset;

  while (ind < array.length && array[ind][1] === 0)
    ind++;

  return ind;
};


