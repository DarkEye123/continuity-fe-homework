<template>
  <div>
    <v-snackbar :value="error" v-for="error in errors" :key="error.id">
      {{ error.message }}
      <v-btn color="pink" text @click="consumeError(error.id)">
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { NetworkModule } from '@/store/modules/network'

export default Vue.extend({
  computed: {
    errors() {
      return NetworkModule.rawErrors
    },
  },
  methods: {
    consumeError(id: number) {
      NetworkModule.consumeError(id)
    },
  },
})
</script>

<style scoped></style>
