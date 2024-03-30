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
        class="toast d-block align-items-center rounded-0 border border-dark"
        role="alert"
      >
        <div class="d-flex">
          <div class="toast-body flex-grow-1">
            <span class="text-dark"
              ><strong>{{ toast.title }}!</strong> {{ toast.body }}.</span
            >
          </div>

          <button
            type="button"
            class="btn btn-link link-dark link-opacity-75-hover p-0 px-2"
            @click="(_event: MouseEvent) => store.removeToast(toast.id)"
          >
            <font-awesome-icon :icon="['fas', 'close']" />
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>
