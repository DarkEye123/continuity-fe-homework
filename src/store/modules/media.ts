enum MediaType {
  CD = 'CD',
  DVD = 'DVD',
  BluRay = 'BluRay',
}

enum MediaKind {
  Movie = 'Movie',
  Music = 'Music',
  Software = 'Software',
  Game = 'Game',
}

export interface MediaState {
  guid: string
  title: string
  type: MediaType
  kind: MediaKind
  numberOfDiscs: number
  releaseYear: number
}
