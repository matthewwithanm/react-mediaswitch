kvPairsAreEqual = (a, b) ->
  for own k, v of a
    return false if b[k] isnt v
  return true

module.exports = (a, b) -> kvPairsAreEqual(a, b) and kvPairsAreEqual(b, a)
