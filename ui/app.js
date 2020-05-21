import * as api from './app.api.js'

const app = new Vue({
  el: '#app',
  template: '#app-template',
  data: () => (
    {
      text: '',
      dtdlModels: []
    }
  ),
  methods: {
    async initModels () {
      this.dtdlModels = await api.loadModels()
    },
    async search () {
      const all = await api.loadModelById(this.text)
      for (const m of all) {
        console.log(m)
        if (!this.dtdlModels.find(e => e.id === m.id)) {
          this.dtdlModels.push(m)
        }
      }
    }
  }
})
app.initModels()
