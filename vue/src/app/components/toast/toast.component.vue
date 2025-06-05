<script setup lang="ts">
import { ComputedRef, computed } from 'vue'
import { Toast, ToastStore, useToastStore } from '@/app/components/toast/store/toast.store'

import { useStringUtil } from '@/library/utils/string.util'

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
        :class="`toast-${toast.theme}`"
        role="alert"
      >
        <div class="d-flex flex-column flex-align-stretch">
          <div class="d-flex align-items-center justify-content-between px-2 py-1 bg-alt2">
            <h6 class="fw-bold">{{ capitalize(toast.title) }}</h6>
            <button
              type="button"
              class="btn btn-link link-light link-opacity-75-hover p-0"
              @click="(_$event: MouseEvent) => store.removeToast(toast.id)"
            >
              <font-awesome-icon :icon="['fas', 'close']" />
            </button>
          </div>
          <div class="toast-body d-flex flex-column p-2 pe-0 flex-grow-1 gap-1">
            <p class="text-muted">
              {{ capitalize(toast.body) }}
            </p>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
@import '@/library/sass/variables/index';

$toast-themes: (
  danger: $danger,
  primary: $primary,
  success: $success,
  warning: $warning,
  info: $info
);

@each $name, $color in $toast-themes {
  .toast-#{$name} {
    border: 1px solid #{$color};
    box-shadow: 0 0 8px rgba($color, 0.4);
  }
}
</style>
