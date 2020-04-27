<template>
  <v-snackbar value="true" color="red lighten-2" class="black--text">
    {{ message }}
    <v-btn color="white" text @click="handleClick">
      Close
    </v-btn>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    message: {
      type: String,
    },
    id: {
      type: String,
    },
  },
  methods: {
    handleClick() {
      this.$emit('errorRemove', this.id)
    },
  },
})
</script>

<style scoped></style>
