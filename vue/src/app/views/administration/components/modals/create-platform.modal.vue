<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'

import { UpdateUser } from '@/apis/localhost/dto/user.dto'
import { useFormUtil } from '@/utilities/forms.util'
import { updateUser as validationSchema } from '../../config/schema/validation.schema'

import TextInput from '@/app/components/inputs/text.input.vue'
import ModalTitleComponent from '@/app/components/modal/base/modal-title.component.vue'
import InputDateComponent from '@/app/components/inputs/date.input.vue'

const props = defineProps<{
  callback: (values: any) => Promise<void>
}>()

const loading = ref<boolean>(false)

const validateUtil = useFormUtil()
const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: UpdateUser) => {
  loading.value = true
  props.callback(values).finally(() => {
    loading.value = false
  })
})
</script>

<template>
  <Form @submit="onSubmit" :validation-schema v-slot="{ meta }">
    <div class="d-flex flex-column gap-3">
      <ModalTitleComponent :title="$t('Create new platform')" />

      <div class="d-flex flex-column gap-1">
        <TextInput name="name" label="Platform Name" type="text" />
      </div>

      <div class="d-flex flex-column gap-1">
        <div class="row gy-3 align-items-start flex-grow-1">
          <div class="col-12 col-sm-6 d-flex flex-column gap-1">
            <h6 class="fw-semibold">{{ $t('Release Date') }}</h6>
            <InputDateComponent name="release" style="max-width: 20rem" />
          </div>
          <div class="col-12 col-sm-6 d-flex flex-column gap-1">
            <TextInput label="Abbreviation" name="abbreviation" type="text" />
          </div>
        </div>
      </div>

      <div class="d-grid">
        <button :disabled="!meta.valid || !meta.dirty" class="btn btn-primary px-0" type="submit">
          <div v-if="true" class="containter">{{ $t('Create Platform') }}</div>
          <div v-else class="containter">{{ $t('actions.loading') }}</div>
        </button>
      </div>
    </div>
  </Form>
</template>
