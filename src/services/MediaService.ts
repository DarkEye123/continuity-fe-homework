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
  data: Medium | Medium[] | MediaError[] | NetworkError
  totalCount?: number
}

function makeNetworkError(err: any): MediaResponse {
  return {
    data: {
      message: `server error: ${err.message || err.response?.status}`,
    },
    type: MediaAPIResponseType.NETWORK_ERROR,
  }
}

function makeMediaError(err: any) {
  if (err.response?.status == HttpStatus.NOT_FOUND) {
    return {
      data: err.response.data.errors,
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
      return { data, type: MediaAPIResponseType.DATA, totalCount }
    } catch (err) {
      return makeMediaError(err) || makeNetworkError(err)
    }
  },
  async createMedium(medium: Medium): Promise<MediaResponse> {
    const postData = convertToDAO(medium)
    try {
      const response = await client.post<MediaAPIResponse>('/media', postData)
      const data = convertFromDAO(response.data.data as MediumDAO)
      return { data, type: MediaAPIResponseType.DATA }
    } catch (err) {
      // simplification - I assume create will be always successful or server problem
      return makeNetworkError(err)
    }
  },
}
