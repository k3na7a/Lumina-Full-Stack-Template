<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'
import { useFormUtil } from '@/library/utils/forms.util'
import ModalTitleComponent from '@/app/components/modal/modal-title.component.vue'
import FileInputComponent from '@/app/components/inputs/file.input.vue'
import { FormValues, validationSchema } from '../schema/image-upload-validation.schema'

const loading = ref<boolean>(false)
const props = defineProps<{
  callback: (values: FormValues) => Promise<void>
  title: string
  action: string
}>()

const { getSubmitFn } = useFormUtil()
const onSubmit = getSubmitFn(validationSchema, (values: FormValues) => {
  loading.value = true
  props.callback(values).finally(() => (loading.value = false))
})
</script>

<template>
  <Form @submit="onSubmit" :validation-schema="validationSchema" v-slot="{ meta }">
    <div class="d-flex flex-column gap-3">
      <ModalTitleComponent :title="$t(props.title)" />
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
