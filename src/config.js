const { resolve, } = require('path')
const c = require('chalk')
const pkg = require('../package')
const FS = require('./fs')
const Prompt = require('./prompt')
const CONFIG_DIR = resolve(process.env.HOME, '.config', pkg.name)
const CONFIG_PATH = resolve(CONFIG_DIR, 'config.json')

const { log, } = console

module.exports = class {
  constructor() {
    this.values = null
  }

  async init() {
    log('No Config Found!')
    if (!FS.exists(CONFIG_DIR)) FS.mkdir(CONFIG_DIR)
    FS.writeJson(CONFIG_PATH, {})
    await this.collect()
  }

  async load() {
    try {
      this.values = require(CONFIG_PATH)
      if (!Object.values(this.values).length) throw new Error()
    } catch (err) {
      await this.init()
    }
  }

  async collect() {
    // const awsCredentials = await this.prompt.aws()
    const pemFilePath = await Prompt.input('pemFilePath')
    // const roleName = await Prompt.input('roleName')
    const region = await Prompt.input('region')
    this.values = { ...this.values, ...pemFilePath, ...region, }
    FS.writeJson(CONFIG_PATH, this.values)
    console.log('config saved in', c.bold(CONFIG_PATH))
  }
}
