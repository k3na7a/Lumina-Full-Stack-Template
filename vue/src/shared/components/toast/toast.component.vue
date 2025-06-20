<script setup lang="ts">
import { ComputedRef, computed } from 'vue'
import { Toast, ToastStore, useToastStore } from '@/core/store/toast.store'

const store: ToastStore = useToastStore()

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
        <div class="d-flex align-items-stretch gap-2">
          <div class="toast-body d-flex flex-column p-2 flex-grow-1 gap-1">
            <h6 class="fw-bold">{{ toast.title }}</h6>
            <p class="text-light-alt">{{ toast.body }}</p>
          </div>
          <div class="d-flex align-items-center p-2">
            <button
              type="button"
              class="btn btn-link link-light link-opacity-75-hover"
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

<style lang="scss" scoped>
@import '@/shared/sass/variables/index';

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

    * > h6 {
      color: #{$color};
    }
  }
}
</style>
