import * as api from './app.api.js'

/** @typedef {import('./../_types/modelTypes').modelInfo } modelInfo */

/** @type {Array<modelInfo>} models */
let models = []

/**
 * @param {string} id - element id
 * @returns {HTMLElement}
 */
const gbid = (id) => {
  const el = document.getElementById(id)
  if (el === null) {
    throw new Error('element not found: ' + id)
  }
  return el
}

/**
 * @param {string} template
 * @param {*} model
 * @param {string} target
 */
const bindTemplate = (template, model, target) => {
  // @ts-ignore
  gbid(target).innerHTML = Mustache.render(gbid(template).innerHTML, model)
}

/** @type {HTMLElement} */
let lastLi
const search = async () => {
  if (lastLi) lastLi.className = ''
  gbid('search-results').innerHTML = ''
  const searchBox = /** @type {HTMLInputElement} */ (gbid('in-search'))
  const searchTerm = searchBox.value
  if (searchTerm.startsWith('dtmi')) {
    const mod = models.find(m => m.id === searchTerm)
    if (mod) {
      lastLi = gbid(searchTerm)
      lastLi.className = 'found'
      return
    }
  }
  const pi = await api.search(searchTerm)
  bindTemplate('search-result-template', { id: pi.name, version: pi.version }, 'search-results')
}

const init = async () => {
  models = await api.loadModels()
  bindTemplate('models-list-template', models, 'rendered')
}

(async () => {
  const searchBtn = gbid('btn-search')
  searchBtn.onclick = search
  await init()
})()
