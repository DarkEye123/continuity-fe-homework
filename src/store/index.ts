import Vue from 'vue'
import Vuex from 'vuex'
import { MediaState } from '@/store/modules/media'
import { NetworkState } from './modules/network'

Vue.use(Vuex)

export interface RootState {
  media: MediaState
  network: NetworkState
}

export default new Vuex.Store<RootState>({})
