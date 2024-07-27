<script setup lang="ts">
import { ComputedRef, computed } from 'vue'
import { Toast, ToastStore, useToastStore } from '@/app/store/toast.store'

import { useStringUtil } from '@/helpers/utils/string.util'

const store: ToastStore = useToastStore()
const { capitalize } = useStringUtil()

const toasts: ComputedRef<Toast[]> = computed<Toast[]>(() => store.getToasts)
</script>

<template>
  <div id="toast" class="toast-container position-fixed bottom-0 end-0 p-3">
    <TransitionGroup>
      <div
        v-for="(toast, _index) of toasts"
        :id="`${toast.id}`"
        :key="toast.id"
        class="toast d-block align-items-center rounded-0"
        role="alert"
      >
        <div class="d-flex">
          <div class="toast-body flex-grow-1">
            <span class="text-light">
              <strong class="text-primary"> {{ `${capitalize(toast.title)}!` }} </strong>
              {{ `${capitalize(toast.body)}.` }}
            </span>
          </div>

          <button
            type="button"
            class="btn btn-link link-light link-opacity-75-hover p-0 px-2"
            v-on:click="(_$event: MouseEvent) => store.removeToast(toast.id)"
          >
            <font-awesome-icon :icon="['fas', 'close']" />
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style lang="scss">
@import '@/app/sass/utils/utils';

#toast {
  & .toast-container {
    backface-visibility: hidden;
  }

  & .toast {
    box-shadow: $boxShadow;
    background-color: $backgroundAlt;
    border: 1px $primary solid;
  }
}
</style>
