import * as api from './app.api.js'

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

const init = async () => {
  models = await api.loadModels()
  bindTemplate('models-list-template', models, 'rendered')
}

(async () => {
  // const searchBtn = gbid('btn-search')
  // searchBtn.onclick = search
  await init()
})()
