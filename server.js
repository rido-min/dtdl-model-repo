'use strict'

const path = require('path')
const express = require('express')
const repo = require('./dtFileSystemRepo')

const app = express()
const router = express.Router()

const port = process.env.PORT || 3000

app.use(express.static('ui'))
router.get('/', (req, res, next) => res.sendFile('index.html', { root: path.join(__dirname, 'ui/index.html') }))
app.use('/api', router)

router.get('/models', async (req, res) => {
  const models = await repo.loadModelsFromFS()
  res.json(models.map(m => { return { id: m.id, version: m.version, pkg: m.pkg } }))
})

router.get('/search', async (req, res) => {
  if (req.query.id) {
    const pi = await repo.searchModel(req.query.id)
    res.json(pi)
  }
})

router.get('/viewModel', (req, res) => {
  const m = repo.getModel(req.query.id)
  res.json(m)
})

app.listen(port, () => console.log('Example app listening %s', port))
