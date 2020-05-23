'use strict'

/** @typedef {import('./_types/modelTypes').modelInfo } modelInfo */
/** @typedef {import('./_types/modelTypes').packagejson } packagejson */

const fs = require('fs')
const glob = require('glob')
const replaceString = require('replace-string')

const lpm = require('live-plugin-manager')

const manager = new lpm.PluginManager({
  pluginsPath: 'dtdl_models',
  npmInstallMode: 'noCache'
})

const npmorg = '@digital-twins/'
const dir = './dtdl_models/' + npmorg

/** @type {Array<modelInfo>} */
let models = []

/**
 * @returns {Promise<Array<modelInfo>>}
 */
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
 * @param {*} id  - Model Id
 * @returns {Promise<lpm.PackageInfo>}
 */
const searchModel = async (id) => {
  /** @type {string} id */
  let normalizedId = id
  if (normalizedId.startsWith('dtmi')) {
    normalizedId = npmorg + replaceString(id.substring(5, id.lastIndexOf(';')), ':', '-').toLowerCase()
  }
  return new Promise((resolve, reject) => {
    manager.queryPackageFromNpm(normalizedId)
      .then(pi => resolve(pi))
      .catch(e => reject(e))
  })
}

/**
 *
 * @param {*} id  - Model Id
 */
const getModel = (id) => {
  const m = models.find(e => e.id === id)
  if (m) {
    return m.dtdlModel
  }
}

module.exports = { loadModelsFromFS, searchModel, getModel }
