const { execSync, spawn, } = require('child_process')

module.exports = class {
  constructor() {}

  static run(cmd) {
    return execSync(cmd, { encoding: 'utf8', })
  }

  static connect({ pemFilePath, user, privateIpAddress, }) {
    return new Promise((resolve, reject) => {
      const ps = spawn('ssh', [`-i`, `${pemFilePath}`, `${user}@${privateIpAddress}`, ], {
        stdio: [process.stdin, process.stdout, process.stderr, ],
      })

      ps.on('close', (code) => code === 0 ? resolve() : reject())
    })
  }
}
