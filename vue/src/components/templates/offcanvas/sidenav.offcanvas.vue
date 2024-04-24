<script setup lang="ts">
import { Router, useRouter } from 'vue-router'

const router: Router = useRouter()

const props = defineProps<{
  close: () => void
}>()

const push = (name: string): void => {
  router.push({ name })
  props.close()
}
</script>

<template>
  <div class="offcanvas-header d-flex justify-content-between align-items-center">
    <div class="p-0 hover-cursor-pointer" @click="(_$event: MouseEvent) => push('home')">
      <img src="/media/logo-header.svg" style="height: 28px" />
    </div>
    <button type="button" class="btn btn-link link-light link-opacity-75-hover p-0 ms-3" @click="props.close">
      <font-awesome-icon :icon="['fas', 'close']" />
    </button>
  </div>
  <div class="offcanvas-body"></div>
</template>
