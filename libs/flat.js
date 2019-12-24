function myFlat(arr, d = 1) {
  return d > 0 ? arr.reduce((acc, val) => {
    acc.concat(Array.isArray(val) ? myFlat(val, d-1) : val)
  }, []) : arr.slice()
}


function* flat (arr) {
  for (const item of arr) {
    if (Array.isArray(item)) {
      yield* flat(item)
    } else {
      yield item
    }
  }
}
[...flat(arr)]