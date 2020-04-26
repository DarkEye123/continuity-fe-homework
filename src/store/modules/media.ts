import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators'
import { MediaError } from '@/types/media'
import { Medium } from '@/types/media'
import store from '@/store'
import MediaService, { MediaAPIResponseType } from '@/services/MediaService'
import { NetworkError } from '@/services/NetworkService'

export interface MediaState {
  media: Medium[]
  totalPageCount: number
  mediaPerPage: number
  medium: Medium | {}
  errors: MediaError[]
}

type FetchMedia = {
  perPage: number
  page: number
}

@Module({ dynamic: true, store, name: 'event' })
class Media extends VuexModule implements MediaState {
  media: Medium[] = []
  totalPageCount = 1
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
  setTotalPageCount(cnt: number) {
    this.totalPageCount = cnt
  }

  @Mutation
  setMedia(media: Medium[]) {
    this.media = media
  }

  @Mutation
  setErrors(errors: MediaError[]) {
    this.errors = errors
  }

  @Action
  async fetchMedia({ page, perPage }: FetchMedia): Promise<Medium[]> {
    const res = await MediaService.getMedia(page, perPage)
    if (res.type == MediaAPIResponseType.DATA) {
      const data = res.data as Medium[]
      this.setMedia(data)
      this.setTotalPageCount(res.totalCount!)
      return data
    }
    if (res.type == MediaAPIResponseType.MEDIA_ERROR) {
      const data = res.data as MediaError[]
      this.setErrors(data)
      throw data
    }
    throw res.data as NetworkError
  }

  get mediumByID() {
    return function (this: Media, id: string) {
      return this.media.find((e: Medium) => e.guid == id)
    }
  }
}

export const MediaModule = getModule(Media)
