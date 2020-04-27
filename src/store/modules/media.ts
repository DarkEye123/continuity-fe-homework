import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators'
import { MediaError, FetchMedia } from '@/types/media'
import { Medium } from '@/types/media'
import store from '@/store'
import MediaService, { MediaAPIResponseType } from '@/services/MediaService'
import { NetworkError } from '@/services/NetworkService'

interface FetchOptions {
  totalPageCount: number
  mediaPerPage: number
  totalMediaCount: number
}

export interface MediaState {
  media: Medium[]
  options: FetchOptions
  medium: Medium | {}
  errors: MediaError[]
}

@Module({ dynamic: true, store, name: 'event' })
class Media extends VuexModule implements MediaState {
  options: FetchOptions = {
    totalPageCount: 1,
    mediaPerPage: 5,
    totalMediaCount: 0,
  }
  media: Medium[] = []
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
  setMedia(media: Medium[]) {
    this.media = media
  }

  @Mutation
  setErrors(errors: MediaError[]) {
    this.errors = errors
  }

  @Mutation
  setOptions(options: FetchOptions) {
    this.options = options
  }

  @Action
  async fetchMedia({
    page,
    perPage,
    sortBy,
    orderDesc,
  }: FetchMedia): Promise<Medium[]> {
    const res = await MediaService.getMedia({
      page,
      perPage,
      sortBy,
      orderDesc,
    })
    if (res.type == MediaAPIResponseType.DATA) {
      const data = res.data as Medium[]
      this.setMedia(data)
      const options: FetchOptions = {
        mediaPerPage: perPage,
        totalMediaCount: res.totalCount!,
        totalPageCount: Math.ceil(res.totalCount! / perPage),
      }
      this.setOptions(options)
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
