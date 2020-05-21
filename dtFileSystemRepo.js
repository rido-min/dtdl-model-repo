'use strict'

/** @typedef {import('./_types/modelTypes').modelInfo } modelInfo */
/** @typedef {import('./_types/modelTypes').packagejson } packagejson */

const fs = require('fs')
const glob = require('glob')
const replaceString = require('replace-string')

const PluginManager = require('live-plugin-manager').PluginManager

const npmorg = '@digital-twins'
const dir = './plugin_packages/' + npmorg

/** @type {Array<modelInfo>} */
let models = []
const loadModelsFromFS = () => {
  models = []
  return new Promise((resolve, reject) => {
    glob(dir + '/**/package.json', (err, files) => {
      if (err) reject(err)
      files.forEach(f => {
        /** @type {packagejson} pjson- package.json */
        const pjson = JSON.parse(fs.readFileSync(f, 'utf-8'))

        pjson.models.forEach(/** @param {string} m */m => {
          /** @type {Object.<string, string>} dtdlModel */
          const dtdlModel = JSON.parse(fs.readFileSync(f.replace('package.json', m), 'utf-8'))
          models.push({ id: dtdlModel['@id'], version: pjson.version, pkg: f, dtdlModel })
        })
      })
      resolve(models)
    })
  })
}

/**
 *
 * @param {string} id  - Model Id
 */
const searchModel = async (id) => {
  const normalizedId = replaceString(id.substring(5, id.lastIndexOf(';')), ':', '-')
  const manager = new PluginManager()
  try {
    const pi = await manager.queryPackageFromNpm(npmorg + '/' + normalizedId)
    if (pi) {
      await manager.install(pi.name, pi.version)
    }
    return loadModelsFromFS()
  } catch (e) {
    console.log(id + ' no found')
    return null
  }
}

/**
 *
 * @param {string} id  - Model Id
 */
const getModel = (id) => {
  const m = models.find(e => e.id === id)
  if (m) {
    return m.dtdlModel
  }
}

module.exports = { loadModelsFromFS, searchModel, getModel }
