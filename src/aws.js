const AWS = require('aws-sdk')

module.exports = class {
  constructor(region) {
    this.ec2 = new AWS.EC2({ region })
  }

  async list() {
    return (await this.ec2.describeInstances({
        Filters: [{ Name: 'instance-state-name', Values: ['running', ], }, ],
      }).promise())
      .Reservations
      .reduce((acc, cur) => [...acc, ...cur.Instances.map(x => ({
        name: (x.Tags.find(t => t.Key === 'Name') || {}).Value || '',
        instanceId: x.InstanceId,
        privateIpAddress: x.PrivateIpAddress,
        instanceLifecycle: x.InstanceLifecycle,
      }))], [])
  }
}
