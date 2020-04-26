import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators'
import store from '@/store'
import { Medium, MediaError } from '@/types/media'

export interface MediaState {
  media: Medium[]
  page: number
  totalPage: number
  mediaPerPage: number
  medium: Medium | {}
  errors: MediaError[]
}

@Module({ dynamic: true, store, name: 'event' })
class Media extends VuexModule implements MediaState {
  media: Medium[] = []
  page = 1
  totalPage = 1
  mediaPerPage = 10
  medium = {}
  errors: MediaError[] = []

  @Mutation
  addMedium(medium: Medium) {
    this.media.push(medium)
  }

  @Mutation
  removeMedium(medium: Medium) {
    this.media = this.media.filter((m) => m.guid != medium.guid)
  }

  @Mutation
  setMedium(medium: Medium) {
    this.medium = medium
  }

  @Mutation
  setErrors(errors: MediaError[]) {
    this.errors = errors
  }

  get mediumByID() {
    return function (this: Media, id: string) {
      return this.media.find((e: Medium) => e.guid == id)
    }
  }
}

export const MediaModule = getModule(Media)
