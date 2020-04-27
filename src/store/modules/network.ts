import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { NetworkError } from '@/services/NetworkService'

export interface NetworkState {
  errors: NetworkError[]
}

@Module({ dynamic: true, store, name: 'network' })
class Network extends VuexModule implements NetworkState {
  errors: NetworkError[] = []

  @Mutation
  addError(error: NetworkError) {
    this.errors.push(error)
  }

  @Mutation
  appendErrors(errors: NetworkError[]) {
    this.errors.push(...errors)
  }

  @Mutation
  removeError(id: number) {
    this.errors = this.errors.filter((e) => e.id != id)
  }

  @Mutation
  consumeError(id: number) {
    const err = this.errors.find((e) => e.id == id)
    if (err) {
      err.consumed = true
    }
  }

  @Mutation
  clearErrors() {
    this.errors = []
  }

  get rawErrors() {
    return this.errors.filter((e: NetworkError) => !e.consumed)
  }
}

export const NetworkModule = getModule(Network)
