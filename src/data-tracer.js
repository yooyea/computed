const wrapData = (data, relatedPathValues, basePath) => {
  if (typeof data !== 'object' || data === null) return data
  if ('__wxValue__' in data) {
    return {}
  }

  const handler = {
    get(obj, key) {
      if (key === '__rawObject__') return data
      let keyWrapper = null
      const keyPath = basePath.concat(key)
      const value = data[key] === undefined ? {__wxValue__: undefined} : data[key]
      relatedPathValues.push({
        path: keyPath,
        value,
      })
      keyWrapper = wrapData(value, relatedPathValues, keyPath)
      return keyWrapper
    },
  }
  const propDef = new Proxy(data, handler)
  return propDef
}

exports.create = (data, relatedPathValues) => wrapData(data, relatedPathValues, [])

exports.unwrap = (wrapped) => {
  if (typeof wrapped !== 'object' || wrapped === null || typeof wrapped.__rawObject__ !== 'object') {
    return wrapped
  }
  return wrapped.__rawObject__
}
