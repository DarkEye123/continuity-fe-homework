export enum MediaType {
  CD = 'CD',
  DVD = 'DVD',
  BluRay = 'BluRay',
}

export enum MediaKind {
  Movie = 'Movie',
  Music = 'Music',
  Software = 'Software',
  Game = 'Game',
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
