const fs = require('fs')
const path = require('path')
const glob = require('glob')
const replaceString = require('replace-string')

const lpm = require('live-plugin-manager')

const manager = new lpm.PluginManager({
  pluginsPath: 'dtdl_models',
  npmInstallMode: 'noCache'
})
const npmorg = '@digital-twins'
const dir = './dtdl_models/'

/** @type {Array<modelInfo>} */
let models = []

/**
 * @returns {Promise<Array<modelInfo>>}
 */
const loadModelsFromFS = () => {
  /** @type {Array<modelInfo>} */
  models = []
  return new Promise((resolve, reject) => {
    glob(dir + '/**/package.json', (err, files) => {
      if (err) reject(err)
      files.forEach(f => {
        /** @type {packagejson} pjson- package.json */
        const pjson = JSON.parse(fs.readFileSync(f, 'utf-8'))
        pjson.models.forEach(/** @param {string} m */m => {
          const modelPath = f.replace('package.json', m)
          const modelFileName = path.basename(modelPath)
          /** @type {Object.<string, string>} dtdlModel */
          const dtdlModel = JSON.parse(fs.readFileSync(modelPath, 'utf-8'))
          models.push({
            id: dtdlModel['@id'],
            version: pjson.version,
            fileName: modelFileName,
            pkg: f,
            dtdlModel
          })
        })
      })
      resolve(models)
    })
  })
}

const cleanCache = () => {
  fs.rmdir('dtdl_models', { recursive: true }, e => console.error(e))
}

const flatCache = async () => {
  const flatFolder = './dtdl_models/flatten'
  fs.mkdir(flatFolder, { recursive: true }, e => console.error(e))
  const models = await loadModelsFromFS()
  models.forEach(m => {
    fs.writeFile(flatFolder + '/' + m.fileName, JSON.stringify(m.dtdlModel), e => { if (e) console.error(e) })
    console.log(m.fileName)
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

module.exports = { loadModelsFromFS, searchModel, getModel, cleanCache, flatCache }
