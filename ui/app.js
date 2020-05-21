import * as api from './app.api.js'

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

const search = async () => {
  const searchBox = /** @type {HTMLInputElement} */ (gbid('in-search'))
  const pi = await api.loadModelById(searchBox.value)
  if (pi === null) {
    window.alert('model not found')
  } else {
    await init()
  }
}

const init = async () => {
  const models = await api.loadModels()
  gbid('rendered').innerHTML = window.Mustache.render(gbid('template').innerHTML, models)
}

(async () => {
  const searchBtn = gbid('btn-search')
  searchBtn.onclick = search
  await init()
})()
