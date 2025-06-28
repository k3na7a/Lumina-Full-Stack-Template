<script setup lang="ts">
import { Form } from 'vee-validate'

import ModalTitleComponent from '@/shared/components/modal/base/modal-title.component.vue'
import FileInputComponent from '@/shared/components/inputs/file.input.vue'

import { useImageUploadModal, proptype } from './composables/image-upload.composable'

const { title, action, callback } = defineProps<proptype>()
const { loading, validationSchema, onSubmit } = useImageUploadModal(callback)
</script>

<template>
  <Form @submit="onSubmit" :validation-schema="validationSchema" v-slot="{ meta }">
    <div class="d-flex flex-column gap-3">
      <ModalTitleComponent :title="title" />
      <div class="d-flex flex-column">
        <FileInputComponent name="image" />
      </div>
      <div class="d-grid">
        <button :disabled="!meta.valid || loading || !meta.dirty" class="btn btn-primary px-0" type="submit">
          <div v-if="!loading" class="containter">{{ action }}</div>
          <div v-else class="containter">{{ $t('actions.loading') }}</div>
        </button>
      </div>
    </div>
  </Form>
</template>
