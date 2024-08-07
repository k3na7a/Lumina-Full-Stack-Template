<script setup lang="ts">
import { reactive } from 'vue'

type PropType = {
  close: () => void
  callback: () => Promise<void>
  title: string
  body: string
  action: string
}

const props = defineProps<PropType>()

const state = reactive<{ loading: boolean }>({ loading: false })

const onSubmit = (_event: MouseEvent): void => {
  state.loading = true
  props.callback().finally(() => (state.loading = false))
}
</script>

<template>
  <div id="general-modal">
    <div class="d-flex flex-column">
      <h4 class="fw-bolder display-font mb-1">{{ $t(props.title) }}</h4>
      <h6 class="text-muted fw-normal">{{ $t(props.body) }}</h6>
    </div>
    <div class="d-grid gap-2 pt-3">
      <button v-on:click="close" class="btn btn-secondary px-0" type="button">
        {{ $t('actions.close') }}
      </button>
      <button v-on:click="onSubmit" :disabled="state.loading" class="btn btn-primary px-0" type="button">
        {{ state.loading ? $t('actions.loading') : $t(props.action) }}
      </button>
    </div>
  </div>
</template>
