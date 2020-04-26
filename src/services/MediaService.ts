import * as HttpStatus from 'http-status-codes'
import snakeCase from 'lodash.snakecase'
import camelCase from 'lodash.camelcase'
import mapKeys from 'lodash.mapkeys'

import { client, NetworkError } from './NetworkService'
import { Medium, BaseMedium, MediaError } from '@/types/media'

const convertFromDAO = (m: MediumDAO): Medium =>
  (mapKeys(m, (v, k) => camelCase(k)) as unknown) as Medium

const convertToDAO = (m: Medium): MediumDAO =>
  (mapKeys(m, (v, k) => snakeCase(k)) as unknown) as MediumDAO

interface MediumDAO extends BaseMedium {
  number_of_discs: number
  release_year: number
}

interface MediaAPIResponse {
  data: MediumDAO[]
  errors: MediaError[]
}

export enum MediaAPIResponseType {
  DATA,
  MEDIA_ERROR,
  NETWORK_ERROR,
}

export interface MediaResponse {
  type: MediaAPIResponseType
  data: Medium[] | MediaError[] | NetworkError
  totalCount?: number
}

export default {
  async getMedia(page: number, perPage: number): Promise<MediaResponse> {
    try {
      const response = await client.get<MediaAPIResponse>(
        `/media?_limit=${perPage}&_page=${page}`
      )
      const data = response.data.data.map(convertFromDAO)
      const totalCount = Number(response.headers['x-total-count'])
      return { data, type: MediaAPIResponseType.DATA, totalCount }
    } catch (err) {
      if (err.response?.status == HttpStatus.NOT_FOUND) {
        return {
          data: err.response.data.errors,
          type: MediaAPIResponseType.MEDIA_ERROR,
        }
      }
      return {
        data: {
          message: `server error: ${err.message || err.response?.status}`,
        },
        type: MediaAPIResponseType.NETWORK_ERROR,
      }
    }
  },
}
