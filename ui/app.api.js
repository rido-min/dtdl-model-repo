/** @typedef {import('./../_types/modelTypes').modelInfo } modelInfo */
/** @typedef {import('./../_types/modelTypes').packageInfo } packageInfo */

/**
 * @returns {Promise<Array<modelInfo>>}
 */
const loadModels = () => {
  return new Promise((resolve, reject) => {
    window.fetch('/api/models')
      .then(r => r.json())
      .then(m => resolve(m))
      .catch(e => reject(e))
  })
}
/**
 *
 * @param {string} id  - Model Id
 * @returns {Promise<packageInfo>}
 */
const search = (id) => {
  return new Promise((resolve, reject) => {
    window.fetch(`/api/search?id=${id}`)
      .then(r => r.json())
      .then(m => resolve(m))
      .catch(e => reject(e))
  })
}

export { search, loadModels }
