'use strict';

const fs  = require('fs')
const glob = require('glob')
const PluginManager = require('live-plugin-manager').PluginManager

const npmorg = '@digital-twins'
const dir = './plugin_packages/' + npmorg;

let models = []
const loadModelsFromFS = () => {
  models = []
  return new Promise((resolve,reject) => {
      glob(dir + '/**/package.json', function(err, files) {
        files.forEach(f => {
            const pjson =  JSON.parse(fs.readFileSync(f, 'utf-8'))
            pjson.models.forEach(m=>{
                const dtdlModel = JSON.parse(fs.readFileSync(f.replace('package.json',m),'utf-8'))
                models.push({id: dtdlModel['@id'], version: pjson.version, pkg: f, dtdlModel })
            })
        })
        resolve(models)
    })
  })
}

function escapeRegExp (string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

function replaceAll (str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace)
}

const normalizeID = (id) => {
    return replaceAll(id.substring(5, id.lastIndexOf(';')), ':', '-').toLowerCase()
}

const searchModel = async (id) => {
    const normalizedId = normalizeID(id)
    const manager = new PluginManager()
    try
    {
      const pi = await manager.queryPackageFromNpm(npmorg + '/' + normalizedId)
      if (pi) {
        await manager.install(pi.name, pi.version)
      }
      return loadModelsFromFS()
    } catch (e) {
      console.log(id + ' no found' )
      return null
    }
}

const getModel = (id) => {
  const m = models.find(e => e.id===id)
  if (m) {
    return m.dtdlModel
  }
}

module.exports= {loadModelsFromFS, searchModel, getModel}