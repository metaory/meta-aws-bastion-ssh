// const { resolve, } = require('path')
const AWS = require('aws-sdk')
// const axios = require('axios')
// const FS = require('./fs')
// const exec = require('./exec')

module.exports = class {
  constructor (region) {
    this.ec2 = new AWS.EC2({ region })
  }

  async configure (roleName) {
    console.log('CF()')
  }
  async list () {
    return (await this.ec2.describeInstances({
      Filters: [{ Name: 'instance-state-name', Values: ['running', ], }, ],
    }).promise())
      .Reservations
      .reduce((acc, cur) => {
        acc.push(...cur.Instances.map(x => {
          return {
            name: x.Tags.find(t => t.Key === 'Name').Value,
            instanceId: x.InstanceId,
            privateIpAddress: x.PrivateIpAddress,
            instanceLifecycle: x.InstanceLifecycle,
          }
        }))
        return acc
      }, [])
  }
}
