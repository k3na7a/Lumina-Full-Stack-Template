<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'

import ModalTitleComponent from '@/shared/components/modal/base/modal-title.component.vue'

const props = defineProps<{
  close: () => void
  callback: () => Promise<void>
  title: string
  body: string
  action: string
}>()

const loading = ref<boolean>(false)

const onSubmit = (): void => {
  loading.value = true
  props.callback().finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <Form @submit="onSubmit">
    <div class="d-flex flex-column gap-3">
      <ModalTitleComponent :title />
      <div class="d-flex flex-column">
        <h6 class="text-light-alt fw-normal">{{ body }}</h6>
      </div>
      <div class="d-grid gap-2">
        <button @click="close" class="btn btn-secondary px-0" type="button">
          {{ $t('actions.cancel') }}
        </button>
        <button :disabled="loading" class="btn btn-primary px-0" type="submit">
          {{ loading ? $t('actions.loading') : action }}
        </button>
      </div>
    </div>
  </Form>
</template>
