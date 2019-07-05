#!/usr/bin/env node
const { log, error, } = console
const c = require('chalk')
const exec = require('../src/exec')
const prompt = require('../src/prompt')
const config = new (require('../src/config'))()
const AWS = require('../src/aws')
const pkg = require('../package.json')

log(c.bold(pkg.name), c.bold.green(pkg.version))

async function init () {
  await config.load()

  const aws = new AWS(config.values.region)
  // await aws.configure(config.values.roleName)

  const list = await aws.list()
  const { instance, } = await prompt.select(list)

  const { user, } = await prompt.input('user', 'Enter User', 'ec2-user')

  const { privateIpAddress, } = list.find(x => x.instanceId === instance.instanceId)

  await exec.connect({ pemFilePath: config.values.pemFilePath, user, privateIpAddress, })

  await init()
}

init()
  .then(log)
  .catch(error)
