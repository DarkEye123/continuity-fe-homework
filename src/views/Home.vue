<template>
  <v-container>
    <v-row>
      <v-col>
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

              <base-search-field
                v-model="search"
                @input="handleSearch"
              ></base-search-field>

              <v-spacer></v-spacer>

              <v-dialog v-model="dialog" max-width="500px" persistent>
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" dark class="mb-2" v-on="on">{{
                    $t('addMedium')
                  }}</v-btn>
                </template>
                <media-form
                  v-model="dialog"
                  :isUpdate="editRequested"
                  :medium="mediumToEdit"
                  @save="handleSaveForm"
                  @update="handleUpdateForm"
                  @close="mediumToEdit = {}"
                ></media-form>
              </v-dialog>
            </v-toolbar>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="mediumToEdit = item">
              mdi-pencil
            </v-icon>
            <v-icon smal @click="deleteMedium(item)">
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data>
            <div class="uppercase" color="primary">
              {{ $t('noData') }} (ノಠ益ಠ)ノ彡┻━┻
            </div>
          </template>
        </v-data-table>
        <media-error
          v-for="error in errors"
          :id="String(error.details)"
          :message="error.message"
          :key="String(error.details)"
          v-on:errorRemove="handleErrorRemove"
        ></media-error>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { MediaModule } from '@/store/modules/media'
import MediaForm from '@/components/MediaForm.vue'
import { Medium } from '../types/media'
import MediaError from '@/components/MediaError.vue'

@Component({
  components: {
    MediaForm,
    MediaError,
  },
})
export default class Home extends Vue {
  get loading() {
    return MediaModule.isLoading
  }

  options: Record<string, any> = {}

  dialog = false

  get errors() {
    return MediaModule.errors
  }

  search = ''

  _filter = ''

  editRequested = false

  _medium: Medium | {} = {}

  get mediumToEdit() {
    return this.$data._medium
  }

  set mediumToEdit(medium: Medium | {}) {
    this.$data._medium = medium
    this.editRequested = !!medium
    if (medium) {
      this.dialog = true
    }
  }

  get filters() {
    const filtered = [...this.headers]
    filtered.pop() //actions
    return filtered
  }

  get filterBy() {
    return this.$data._filter || this.filters[0]
  }

  set filterBy(val: any) {
    this.$data._filter = val
  }

  async deleteMedium(medium: Medium) {
    await MediaModule.deleteMedium(medium.guid)
  }

  handleSearch() {
    const filterBy = this.search
      ? { column: this.filterBy.value, text: this.search }
      : {}
    this.options = {
      ...this.options,
      filterBy,
    }
  }

  handleErrorRemove(id: string) {
    MediaModule.removeError(id)
  }

  async handleSaveForm(medium: Medium) {
    const state = await MediaModule.createMedium(medium)
    this.dialog = false
  }

  async handleUpdateForm(medium: Medium) {
    await MediaModule.updateMedium(medium)
    this.dialog = false
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
    const {
      page,
      itemsPerPage: perPage,
      sortBy: _sortBy,
      sortDesc,
      filterBy,
    } = val
    const sortBy = _sortBy[0]
    const orderDesc = !!sortDesc[0]
    MediaModule.fetchMedia({ page, perPage, sortBy, orderDesc, filterBy })
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
