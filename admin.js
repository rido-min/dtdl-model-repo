const inquirer = require('inquirer')
const PluginManager = require('live-plugin-manager').PluginManager
const manager = new PluginManager()

inquirer
  .prompt(['pkg to search'])
  .then(answer => {
    manager.queryPackageFromNpm(answer)
      .then(pi => {
        console.log('package found %s %s', pi.name, pi.version)
      })
      .catch(e => console.error(e))
  })
