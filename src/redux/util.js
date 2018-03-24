export const insertAt = (x, idx, xs) =>
  xs
    .slice(0, idx)
    .concat(x)
    .concat(xs.slice(idx))
