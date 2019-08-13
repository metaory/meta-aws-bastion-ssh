const { unlinkSync, writeFileSync, existsSync, mkdirSync, } = require('fs')

module.exports = class {
  constructor() {}

  static exists(path) {
    return existsSync(path)
  }

  static mkdir(path, recursive = true) {
    return mkdirSync(path, { recursive, })
  }

  static remove(path) {
    return unlinkSync(path)
  }

  static writeJson(path, obj) {
    this.write(path, JSON.stringify(obj, null, 2))
  }

  static writeFile(path, data) {
    this.write(path, data)
  }

  static write(path, data) {
    const opts = { encoding: 'utf8', }
    writeFileSync(path, data, opts)
  }
}
