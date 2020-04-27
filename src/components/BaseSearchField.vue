<template>
  <v-text-field
    :value="value"
    v-debounce="handleInput"
    hide-details
    label="Search ..."
    clearable
    @click:clear="handleInput()"
    append-icon="mdi-magnify"
  ></v-text-field>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  methods: {
    handleInput(e: any) {
      this.$emit('input', e)
    },
  },
})
</script>

<style scoped></style>
