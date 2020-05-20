const loadModels = () => {
  return new Promise((resolve, reject) => {
    fetch('/api/models')
      .then(r => r.json())
      .then(m => resolve(m))
      .catch(e => reject(e))
  })
}

const loadModelById = (id) => {
  return new Promise((resolve, reject) => {
    fetch(`/api/search?id=${id}`)
      .then(r => r.json())
      .then(m => resolve(m))
      .catch(e => reject(e))
  })
}

export {loadModelById, loadModels}
