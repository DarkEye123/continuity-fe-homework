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
import MediaService, {
  MediaAPIResponseType,
  MediaResponse,
} from '@/services/MediaService'
import { NetworkError } from '@/services/NetworkService'
import { NetworkModule } from '@/store/modules/network'

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

@Module({ dynamic: true, store, name: 'media' })
class Media extends VuexModule implements MediaState {
  options: FetchOptions = {
    totalPageCount: 1,
    mediaPerPage: 5,
    totalMediaCount: 0,
  }
  isLoading = false
  media: Medium[] = []
  medium: Medium | {} = {}
  errors: MediaError[] = []

  @Mutation
  addMedium(medium: Medium) {
    this.media.push(medium)
  }

  @Mutation
  removeMedium(id: string) {
    this.media = this.media.filter((m) => m.guid != id)
  }

  @Mutation
  setMedium(medium: Medium | {}) {
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

  @Mutation
  setLoading(loading: boolean) {
    this.isLoading = loading
  }

  @Action
  handleErrors(res: MediaResponse, medium?: Medium) {
    if (res.type == MediaAPIResponseType.MEDIA_ERROR) {
      const data = res.errors as MediaError[]
      this.setErrors(data)
    } else {
      NetworkModule.appendErrors(res.errors as NetworkError[])
    }
    return medium
  }

  @Action
  async fetchMedia({
    page,
    perPage,
    sortBy,
    orderDesc,
    filterBy,
  }: FetchMedia): Promise<Medium[]> {
    this.setLoading(true)
    const res = await MediaService.getMedia({
      page,
      perPage,
      sortBy,
      orderDesc,
      filterBy,
    })
    this.setLoading(false)
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
    this.handleErrors(res)
    return []
  }

  @Action
  async createMedium(medium: Medium): Promise<Medium> {
    this.setLoading(true)
    const res = await MediaService.createMedium(medium)
    this.setLoading(false)
    if (res.type == MediaAPIResponseType.DATA) {
      const medium = res.data as Medium
      this.setMedium(medium)
      this.addMedium(medium) // TODO optimize with sort
      return medium
    }
    return this.handleErrors(res, medium) as Medium
  }

  @Action
  async updateMedium(medium: Medium): Promise<Medium> {
    this.setLoading(true)
    const res = await MediaService.updateMedium(medium)
    this.setLoading(false)
    if (res.type == MediaAPIResponseType.DATA) {
      const medium = res.data as Medium
      this.setMedium(medium)
      return medium
    }
    return this.handleErrors(res, medium) as Medium
  }

  @Action
  async deleteMedium(id: string) {
    this.setLoading(true)
    const res = await MediaService.deleteMedium(id)
    this.setLoading(false)
    if (res.type == MediaAPIResponseType.DATA) {
      this.setMedium({})
      this.removeMedium(id)
      return
    }
    this.handleErrors(res)
  }

  get mediumByID() {
    return function (this: Media, id: string) {
      return this.media.find((e: Medium) => e.guid == id)
    }
  }
}

export const MediaModule = getModule(Media)
