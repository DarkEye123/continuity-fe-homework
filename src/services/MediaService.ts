import * as HttpStatus from 'http-status-codes'
import snakeCase from 'lodash.snakecase'
import camelCase from 'lodash.camelcase'
import mapKeys from 'lodash.mapkeys'

import { client, NetworkError } from './NetworkService'
import { Medium, BaseMedium, MediaError, FetchMedia } from '@/types/media'

const MAX_MEDIA_COUNT = -1

const convertFromDAO = (m: MediumDAO): Medium =>
  (mapKeys(m, (v, k) => camelCase(k)) as unknown) as Medium

const convertToDAO = (m: Medium): MediumDAO =>
  (mapKeys(m, (v, k) => snakeCase(k)) as unknown) as MediumDAO

interface MediumDAO extends BaseMedium {
  number_of_discs: number
  release_year: number
}

interface MediaAPIResponse {
  data: MediumDAO[] | MediumDAO
  errors: MediaError[]
}

export enum MediaAPIResponseType {
  DATA,
  MEDIA_ERROR,
  NETWORK_ERROR,
}

export interface MediaResponse {
  type: MediaAPIResponseType
  data: Medium | Medium[] | null
  errors: MediaError[] | NetworkError[] | null
  totalCount?: number
}

function makeNetworkError(err: any): MediaResponse {
  return {
    data: null,
    errors: [
      {
        message: `server error: ${err.message || err.response?.status}`,
        consumed: false,
        id: Date.now(),
      },
    ],
    type: MediaAPIResponseType.NETWORK_ERROR,
  }
}

function makeMediaError(err: any): MediaResponse | undefined {
  if (err.response?.status == HttpStatus.NOT_FOUND) {
    return {
      data: null,
      errors: err.response.data.errors,
      type: MediaAPIResponseType.MEDIA_ERROR,
    }
  }
}

export default {
  async getMedia({
    page,
    perPage,
    sortBy,
    orderDesc,
    filterBy,
  }: FetchMedia): Promise<MediaResponse> {
    try {
      const pagination =
        perPage !== MAX_MEDIA_COUNT ? `_limit=${perPage}&_page=${page}` : ''
      const _sortBy = sortBy ? `&_sort=${snakeCase(sortBy)}` : ''
      const _orderBy = sortBy && orderDesc ? `&_order=desc` : ''
      const _filter = filterBy?.text
        ? `&${snakeCase(filterBy.column)}_like=${filterBy.text}`
        : ''

      const response = await client.get<MediaAPIResponse>(
        `/media?${pagination}${_filter}${_sortBy}${_orderBy}`
      )
      const data = (response.data.data as MediumDAO[]).map(convertFromDAO)
      const totalCount = Number(response.headers['x-total-count'])
      return { data, type: MediaAPIResponseType.DATA, totalCount, errors: null }
    } catch (err) {
      return makeMediaError(err) || makeNetworkError(err)
    }
  },
  async createMedium(medium: Medium): Promise<MediaResponse> {
    const postData = convertToDAO(medium)
    try {
      const response = await client.post<MediaAPIResponse>('/media', postData)
      const data = convertFromDAO(response.data.data as MediumDAO)
      return { data, type: MediaAPIResponseType.DATA, errors: null }
    } catch (err) {
      // simplification - I assume create will be always successful or server problem
      return makeNetworkError(err)
    }
  },

  async updateMedium(medium: Medium): Promise<MediaResponse> {
    const putData = convertToDAO(medium)
    const id = putData.guid
    delete putData.guid
    try {
      const response = await client.put<MediaAPIResponse>(
        `/media/${id}`,
        putData
      )
      const data = convertFromDAO(response.data.data as MediumDAO)
      return { data, type: MediaAPIResponseType.DATA, errors: null }
    } catch (err) {
      return makeMediaError(err) || makeNetworkError(err)
    }
  },

  async deleteMedium(id: string): Promise<MediaResponse> {
    try {
      const response = await client.delete<MediaAPIResponse>(`/media/${id}`)
      const data = convertFromDAO(response.data.data as MediumDAO)
      return { data, type: MediaAPIResponseType.DATA, errors: null }
    } catch (err) {
      return makeMediaError(err) || makeNetworkError(err)
    }
  },
}
