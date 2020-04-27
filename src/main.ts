import 'reflect-metadata'
import 'vue-class-component/hooks'
import Vue from 'vue'
import vuetify from './plugins/vuetify'
import vueDebounce from 'vue-debounce'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import i18n from './i18n'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.use(vueDebounce)

Vue.config.productionTip = false

const requireComponent = require.context(
  './components',
  // Whether or not to look in subfolders
  false,
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach((fileName) => {
  // Get component config
  const componentConfig = requireComponent(fileName)

  // Get PascalCase name of component
  const componentName = upperFirst(
    camelCase(
      // Gets the file name regardless of folder depth
      fileName
        .split('/')
        .pop()
        ?.replace(/\.\w+$/, '')
    )
  )

  // Register component globally
  Vue.component(componentName, componentConfig.default || componentConfig)
})

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount('#app')
