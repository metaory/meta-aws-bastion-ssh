const { prompt, Input, BooleanPrompt, } = require('enquirer')

module.exports = class {
  constructor() {}

  static input(name, msg, initial = '') {
    const message = msg || `Enter ${name}`
    return prompt({
      type: 'input',
      name,
      message,
      initial,
    })
  }

  static select(list) {
    const longest = list
      .reduce((acc, cur) => cur.name.length > acc ? cur.name.length : acc, 0)
    const choices = list
      .map(({ name, instanceId, }) => `${name.padEnd(longest + 1)}:${instanceId}`)
      .sort()
    return prompt({
      type: 'autocomplete',
      name: 'instance',
      message: 'Select an Instance',
      limit: 10,
      suggest(input, choices) {
        return choices.filter(choice => choice.message.includes(input))
      },
      choices,
      result(value) {
        const values = value.split(':')
        const name = values[0].trim()
        const instanceId = values[1]
        return { name, instanceId }
      },
    })
  }

  static aws() {
    const input = (name, message, initial) => {
      return prompt => {
        let p = new Input({ name, message, initial, })
        return p.run().then(value => ({ name, message, initial: value, value, }))
      }
    }
    return prompt({
      type: 'form',
      name: 'aws',
      message: 'Please review AWS credentials:',
      choices: [
        input('accessKeyId'),
        input('secretAccessKey'),
        input('region', 'region', 'ap-southeast-1'),
      ],
    })
  }

  static confirm(message = 'Are you sure?', initial = true) {
    return new BooleanPrompt({
      name: 'confirm',
      message,
      initial,
    }).run()
  }
}
