function parseQuery<T extends Record<string, any>>(query: Record<string, any>, defaults: T): T {
  const result: any = {}

  for (const key in defaults) {
    const value = query[key]

    if (typeof defaults[key] === 'number') {
      result[key] = Number(value) || defaults[key]
    } else if (typeof defaults[key] === 'boolean') {
      result[key] = value === 'true'
    } else {
      result[key] = value ?? defaults[key]
    }
  }

  return result as T
}

export { parseQuery }
