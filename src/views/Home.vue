<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="media"
      :options.sync="options"
      :server-items-length="mediaCount"
      :loading="loading"
      class="elevation-1"
    ></v-data-table>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { MediaModule } from '@/store/modules/media'

@Component
export default class Home extends Vue {
  loading = false

  options = {}

  headers: Record<string, any>[] = []

  @Watch('options', { deep: true })
  onOptionChanged(val: any) {
    console.log(val)
    const { page, itemsPerPage: perPage, sortBy: _sortBy, sortDesc } = val
    const sortBy = _sortBy[0]
    const orderDesc = !!sortDesc[0]
    MediaModule.fetchMedia({ page, perPage, sortBy, orderDesc })
  }

  @Watch('$i18n.locale')
  onLocaleChange() {
    /**
     * !!This is error prone and not an ideal solution!!
     * I tried to use https://github.com/kimamula/ts-transformer-keys
     * but it was without success - I couldn't make it work via chainWebpack
     */
    this.headers = [
      {
        text: this.$t('title'),
        align: 'start',
        value: 'title',
      },
      {
        text: this.$t('type'),
        value: 'type',
      },
      {
        text: this.$t('kind'),
        value: 'kind',
      },
      {
        text: this.$t('numberOfDiscs'),
        value: 'numberOfDiscs',
      },
      {
        text: this.$t('releaseYear'),
        value: 'releaseYear',
      },
    ]
  }

  get media() {
    return MediaModule.media
  }

  get mediaCount() {
    return MediaModule.options.totalMediaCount
  }

  beforeMount() {
    this.onLocaleChange()
    this.options = { page: 1, itemsPerPage: MediaModule.options.mediaPerPage }
  }
}
</script>
