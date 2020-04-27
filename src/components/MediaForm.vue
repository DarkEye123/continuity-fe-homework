<template>
  <v-form ref="form" v-on:submit.prevent="submit" v-model="formValidity">
    <v-card>
      <v-card-title>
        <span class="headline">{{
          medium ? $t('updateMedium') : $t('createMedium')
        }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row cols="12">
            <v-col>
              <v-text-field
                label="Title*"
                required
                autofocus
                v-model="innerMedium.title"
                :rules="rules.title"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row cols="12">
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                label="Number Of Discs*"
                required
                type="number"
                v-model="innerMedium.numberOfDiscs"
                :rules="rules.discs"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                label="Release Year*"
                required
                type="number"
                v-model="innerMedium.releaseYear"
                :rules="rules.year"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row cols="12">
            <v-col cols="12" sm="6">
              <v-autocomplete
                :items="mediaTypes"
                label="Type*"
                required
                v-model="innerMedium.type"
                :rules="rules.type"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6">
              <v-autocomplete
                :items="mediaKinds"
                label="Kind*"
                required
                :rules="rules.kind"
                v-model="innerMedium.kind"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
        <small>{{ $t('indicates') }}</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="handleClose">Close</v-btn>
        <v-btn
          color="blue darken-1"
          :disabled="!formValidity"
          type="submit"
          text
          :loading="isLoading"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script lang="ts">
import { Vue, Component, Model, Prop, Ref, Watch } from 'vue-property-decorator'
import { MediaKind, MediaType, Medium } from '@/types/media'
import { MediaModule } from '../store/modules/media'

@Component
export default class Home extends Vue {
  @Model('update:isOpen') readonly isOpen!: boolean
  @Prop() medium!: string
  @Ref() readonly form!: HTMLFormElement

  get isLoading() {
    return MediaModule.isLoading
  }

  formValidity = false
  innerMedium: Medium | {} = {}
  mediaKinds = Object.values(MediaKind)
  mediaTypes = Object.values(MediaType)
  rules: Record<string, any> = {}

  @Watch('$i18n.locale')
  onLocaleChange() {
    this.rules = {
      title: [(v: string) => !!v || this.$t('titleErr')],
      discs: [(v: string) => !!v || this.$t('discsErr')],
      year: [(v: string) => !!v || this.$t('yearErr')],
      type: [(v: string) => !!v || this.$t('typeErr')],
      kind: [(v: string) => !!v || this.$t('kindErr')],
    }
  }
  beforeMount() {
    this.onLocaleChange()
  }

  handleClose() {
    this.form.reset()
    this.$emit('update:isOpen')
  }

  submit() {
    this.$emit('save', this.innerMedium)
    this.form.reset()
  }
}
</script>

<style scoped></style>
