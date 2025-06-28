<script setup lang="ts">
import { Form } from 'vee-validate'

import TextInput from '@/shared/components/inputs/text.input.vue'
import ModalTitleComponent from '@/shared/components/modal/base/modal-title.component.vue'

import { proptype, usePermanentlyDeleteModal } from './composables/permanently-delete.composable'

const { callback, title, action } = defineProps<proptype>()
const { loading, onSubmit, validationSchema, $string } = usePermanentlyDeleteModal(callback)
</script>

<template>
  <Form @submit="onSubmit" :validation-schema="validationSchema" v-slot="{ meta }">
    <div class="d-flex flex-column gap-3">
      <ModalTitleComponent :title="title" />
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
          <div v-if="!loading" class="containter">{{ action }}</div>
          <div v-else class="containter">{{ $t('actions.loading') }}</div>
        </button>
      </div>
    </div>
  </Form>
</template>
