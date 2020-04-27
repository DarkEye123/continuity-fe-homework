export enum MediaType {
  CD = 'CD',
  DVD = 'DVD',
  BLURAY = 'BluRay',
}

export enum MediaKind {
  MOVIE = 'Movie',
  MUSIC = 'Music',
  SOFTWARE = 'Software',
  GAME = 'Game',
}

export interface BaseMedium {
  guid: string
  title: string
  type: MediaType
  kind: MediaKind
}

export interface Medium extends BaseMedium {
  numberOfDiscs: number
  releaseYear: number
}

export interface MediaError {
  message: string
  code: MediaErrorCode
  details: string
}

export enum MediaErrorCode {
  MEDIA_NOT_FOUND = 'media-not-found',
}

type Filter = {
  column: string
  text: string
}

export type FetchMedia = {
  perPage: number
  page: number
  sortBy?: string
  orderDesc?: boolean
  filterBy?: Filter
}
