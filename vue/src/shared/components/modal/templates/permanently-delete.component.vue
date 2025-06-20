<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'

import { useFormUtil } from '@/core/utilities/forms.util'
import { FormValues, validationSchema, $string } from '../schema/permanently-delete-validation.schema'

import TextInput from '@/shared/components/inputs/text.input.vue'
import ModalTitleComponent from '@/shared/components/modal/modal-title.component.vue'

const props = defineProps<{
  close: () => void
  callback: () => Promise<void>
  title: string
  action: string
}>()

const loading = ref<boolean>(false)
const { getSubmitFn } = useFormUtil()

const onSubmit = getSubmitFn(validationSchema, (_: FormValues) => {
  loading.value = true
  props.callback().finally(() => {
    loading.value = false
  })
})
</script>

<template>
  <Form @submit="onSubmit" :validation-schema="validationSchema" v-slot="{ meta }">
    <div class="d-flex flex-column gap-3">
      <ModalTitleComponent :title="props.title" />
      <div class="d-flex flex-column gap-2">
        <div class="d-flex flex-column">
          <i18n-t keypath="forms.confirm-deletion" tag="h6" class="fw-normal text-light-alt" scope="global">
            <span class="text-muted fst-italic">{{ $string }}</span>
          </i18n-t>
        </div>
        <div class="d-flex flex-column">
          <TextInput name="permanently-delete" type="text" :placeholder="$string" />
        </div>
      </div>
      <div class="d-grid">
        <button :disabled="!meta.valid || loading || !meta.dirty" class="btn btn-primary px-0" type="submit">
          <div v-if="!loading" class="containter">{{ props.action }}</div>
          <div v-else class="containter">{{ $t('actions.loading') }}</div>
        </button>
      </div>
    </div>
  </Form>
</template>
