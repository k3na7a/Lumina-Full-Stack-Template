<script setup lang="ts">
import { ComputedRef, computed } from 'vue'
import { Toast, ToastStore, useToastStore } from '@/store/toast.store'

const store: ToastStore = useToastStore()
const toasts: ComputedRef<Toast[]> = computed<Toast[]>(() => store.getToasts)
</script>

<template>
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <TransitionGroup>
      <div
        v-for="(toast, _index) of toasts"
        :id="`${toast.id}`"
        :key="toast.id"
        class="toast d-block align-items-center text-bg-primary rounded-0 border border-dark"
        role="alert"
      >
        <div class="d-flex">
          <div class="toast-body">
            <strong>{{ toast.title }}!</strong> {{ toast.body }}.
          </div>

          <button
            :key="toast.id"
            type="button"
            class="btn-close btn-close me-2 m-auto"
            v-on:click="(_event: MouseEvent) => store.removeToast(toast.id)"
          />
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style>
.toast-container {
  backface-visibility: hidden;
}
.toast {
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
}
</style>
