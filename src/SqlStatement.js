
class SqlStatement {
  constructor (strings, values = []) {
    this.strings = strings
    this.values = values
  }

  append (statement) {
    if (!(statement instanceof SqlStatement)) {
      throw new Error('append() must build query with `sql`, `q` (Note: renamed to `sql`), or `_unsafe`')
    }
    this.strings = this.strings.slice(0, this.strings.length - 1).concat([this.strings[this.strings.length - 1] + ' ' + statement.strings[0], ...statement.strings.slice(1)])
    this.values = this.values.concat(statement.values)
    return this
  }

  named (name) {
    this.name = name
    return this
  }

  // used by node-postgres
  get text () {
    return this.strings.reduce((prev, curr, i) => prev + '$' + i + curr)
  }
}


SqlStatement.sql = function (strings, ...values) {
  return new SqlStatement(strings, values)
}

SqlStatement._unsafe = function (strings, ...values) {
  const text = strings.reduce((prev, chunk, i) => prev + values[i - 1] + chunk)
  return new SqlStatement([text])
}


module.exports = SqlStatement