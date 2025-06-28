<script setup lang="ts">
type props = {
  error: any
  callback: (() => void) | undefined
}

const { error, callback } = defineProps<props>()
</script>

<template>
  <div class="content-view-settings error-alert box-shadow bg-alt">
    <div class="d-flex align-items-center px-2 py-1 bg-alt2 gap-2">
      <h6 class="fw-bold">Something went wrong!</h6>
    </div>
    <div class="toast-body d-flex flex-column p-2 flex-grow-1 gap-1">
      <p class="text-light-alt">
        {{ error }}
      </p>
      <div class="d-flex justify-content-end">
        <button class="btn btn-danger text-light px-2" @click="callback">Try Again</button>
      </div>
    </div>
  </div>
</template>
