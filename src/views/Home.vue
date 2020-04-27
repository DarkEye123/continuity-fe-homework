<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="media"
      :options.sync="options"
      :server-items-length="mediaCount"
      :loading="loading"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <!-- <v-toolbar-title text>{{ $t('media') }}</v-toolbar-title> -->
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn text v-on="on">
                {{ filterBy.text }}
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in filters"
                :key="index"
                @click="filterBy = item"
              >
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on"
                >New Item</v-btn
              >
            </template>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="edit(item)">
          mdi-pencil
        </v-icon>
        <v-icon small>
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <div class="uppercase" color="primary">
          {{ $t('no-data') }} (ノಠ益ಠ)ノ彡┻━┻
        </div>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { MediaModule } from '@/store/modules/media'

@Component
export default class Home extends Vue {
  loading = false

  options = {}

  dialog = false

  search = ''

  _filter = ''

  get filters() {
    const filtered = [...this.headers]
    filtered.pop() //actions
    console.log('rendering')
    return filtered
  }

  get filterBy() {
    return this.$data._filter || this.filters[0]
  }

  set filterBy(val: any) {
    this.$data._filter = val
  }

  /**
   * !!This is error prone and not an ideal solution!!
   * I tried to use https://github.com/kimamula/ts-transformer-keys
   * but it was without success - I couldn't make it work via chainWebpack
   * though it would include some 'magic sauce' regarding readability
   */
  headers: Record<string, any>[] = [
    {
      align: 'start',
      value: 'title',
    },
    {
      value: 'type',
    },
    {
      value: 'kind',
    },
    {
      value: 'numberOfDiscs',
    },
    {
      value: 'releaseYear',
    },
    { value: 'actions', sortable: false },
  ]

  @Watch('options', { deep: true })
  onOptionChanged(val: any) {
    const { page, itemsPerPage: perPage, sortBy: _sortBy, sortDesc } = val
    const sortBy = _sortBy[0]
    const orderDesc = !!sortDesc[0]
    MediaModule.fetchMedia({ page, perPage, sortBy, orderDesc })
  }

  @Watch('$i18n.locale')
  onLocaleChange() {
    this.headers.map((e) => (e.text = this.$t(e.value)))
    this.headers = [...this.headers]
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

<style scoped>
.uppercase {
  text-transform: uppercase;
}
</style>
