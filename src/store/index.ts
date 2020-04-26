import Vue from 'vue'
import Vuex from 'vuex'
import { MediaState } from '@/store/modules/media'

Vue.use(Vuex)

export interface RootState {
  media: MediaState
}

export default new Vuex.Store<RootState>({})
