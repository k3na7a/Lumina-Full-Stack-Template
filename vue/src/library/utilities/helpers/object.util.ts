const deepEqual = (x: any, y: any): boolean => {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y
  return x && y && tx === 'object' && tx === ty
    ? ok(x).length === ok(y).length && ok(x).every((key) => deepEqual(x[key], y[key]))
    : x === y
}

const checkIds = (x: any, y: any): boolean => {
  const ctx = typeof x
  const ty = typeof y

  return ctx === ty && x['id'] == y['id']
}

export { deepEqual, checkIds }
