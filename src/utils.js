'use strict';

export const stableSort = function(arr, cmp) {
  cmp = cmp
    ? cmp
    : (a, b) => {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      };
  let stabilizedThis = arr.map((el, index) => [el, index]);
  let stableCmp = (a, b) => {
    let order = cmp(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  };
  stabilizedThis.sort(stableCmp);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = stabilizedThis[i][0];
  }
  return arr;
};

export const pagination = (currentPage, pageCount) => {
  let current = currentPage,
    last = pageCount,
    delta = 2,
    left = current - delta,
    right = current + delta + 1,
    range = [],
    rangeWithDots = [],
    l;

  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || (i >= left && i < right)) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
};
