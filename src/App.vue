<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />
        <v-btn to="/" text>Continuity Media</v-btn>
      </div>

      <v-spacer></v-spacer>

      <v-btn text :outlined="lang == 'en'" @click="lang = 'en'">
        EN
      </v-btn>
      <v-btn text :outlined="lang == 'sk'" @click="lang = 'sk'">
        SK
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class App extends Vue {
  get lang() {
    return this.$i18n.locale
  }

  set lang(lang: string) {
    this.$i18n.locale = lang
  }
}
</script>
