<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'

import { useFormUtil } from '@/library/helpers/forms.util'
import { imageUpload as validationSchema, imageUploadValues as FormValues } from '../schema/validation.schema'

import ModalTitleComponent from '../base/modal-title.component.vue'
import FileInputComponent from '../../inputs/input.file.component.vue'

type PropType = {
  close: () => void
  callback: (values: FormValues) => Promise<void>
  title: string
  action: string
}

const props = defineProps<PropType>()
const loading = ref<boolean>(false)

const { getSubmitFn } = useFormUtil()
const onSubmit = getSubmitFn(validationSchema, (values: FormValues) => {
  loading.value = true
  props.callback(values).finally(() => (loading.value = false))
})
</script>

<template>
  <Form v-on:submit="onSubmit" :validation-schema v-slot="{ meta }">
    <div class="d-flex flex-column gap-3">
      <ModalTitleComponent :title="props.title" />
      <div class="d-flex flex-column">
        <FileInputComponent name="image" />
      </div>
      <div class="d-grid">
        <button :disabled="!meta.valid || loading || !meta.dirty" class="btn btn-primary px-0" type="submit">
          <div v-if="!loading" class="containter">{{ $t(props.action) }}</div>
          <div v-else class="containter">{{ $t('actions.loading') }}</div>
        </button>
      </div>
    </div>
  </Form>
</template>
