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

interface MediaResponse {
  data: MediumDAO[]
  errors: MediaError[]
}

export default {
  async fetchMedia(
    perPage: number,
    page: number
  ): Promise<Medium[] | MediaError[] | NetworkError> {
    try {
      const response = await client.get<MediaResponse>(
        `/media?_limit=${perPage}&_page=${page}`
      )
      let data = response.data.data.map(convertFromDAO)
      return data
    } catch (err) {
      if (err.response?.status == HttpStatus.NOT_FOUND) {
        return err.response.data.errors as MediaError[]
      }
      return {
        message: `server error: ${err.message || err.response?.status}`,
      } as NetworkError
    }
  },
}
