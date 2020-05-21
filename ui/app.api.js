/** @typedef {import('./../_types/modelTypes').modelInfo } modelInfo */

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
 * @returns {Promise<modelInfo>}
 */
const loadModelById = (id) => {
  return new Promise((resolve, reject) => {
    window.fetch(`/api/search?id=${id}`)
      .then(r => r.json())
      .then(m => resolve(m))
      .catch(e => reject(e))
  })
}

export { loadModelById, loadModels }
