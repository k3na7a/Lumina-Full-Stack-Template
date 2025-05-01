<script setup lang="ts">
import { ComputedRef, computed } from 'vue'
import { Toast, ToastStore, useToastStore } from '@/app/store/toast.store'

import { useStringUtil } from '@/library/helpers/string.util'

const store: ToastStore = useToastStore()
const { capitalize } = useStringUtil()

const toasts: ComputedRef<Toast[]> = computed<Toast[]>(() => store.getToasts)
</script>

<template>
  <div class="toast-container d-flex flex-column justify-content-end align-items-end w-100 h-100 p-3">
    <TransitionGroup name="fade">
      <div
        v-for="(toast, _index) of toasts"
        :id="`${toast.id}`"
        :key="toast.id"
        class="toast box-shadow d-block align-items-center rounded-0 bg-alt"
        role="alert"
      >
        <div
          style="height: 0.2rem"
          :class="{
            'text-bg-primary': toast.theme == 'primary',
            'text-bg-secondary': toast.theme == 'secondary',
            'text-bg-success': toast.theme == 'success',
            'text-bg-warning': toast.theme == 'warning',
            'text-bg-danger': toast.theme == 'danger',
            'text-bg-info': toast.theme == 'info'
          }"
        ></div>
        <div class="d-flex flex-align-stretch">
          <div class="toast-body d-flex flex-column p-2 pe-0 flex-grow-1 gap-1">
            <h5 class="text-light display-font fw-bolder">
              {{ capitalize(toast.title) }}
            </h5>
            <p class="text-muted">
              {{ capitalize(toast.body) }}
            </p>
          </div>
          <div class="d-flex align-items-center">
            <button
              type="button"
              class="btn btn-link link-light link-opacity-75-hover p-0 px-3"
              @click="(_$event: MouseEvent) => store.removeToast(toast.id)"
            >
              <font-awesome-icon size="lg" :icon="['fas', 'close']" />
            </button>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>
