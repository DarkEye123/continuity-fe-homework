<template>
  <v-container>
    <div v-for="item in media" :key="item.guid">
      {{ item.title }}
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { MediaModule } from '@/store/modules/media'

@Component
export default class Home extends Vue {
  get media() {
    return MediaModule.media
  }
  created() {
    const page = 1
    const perPage = 10
    MediaModule.fetchMedia({ page, perPage })
  }
}
</script>
