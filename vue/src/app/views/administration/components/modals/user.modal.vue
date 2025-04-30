<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'

import { Role, UpdateUser, UserDto } from '@/library/data/dto/user.dto'
import { useFormUtil } from '@/library/helpers/forms.util'

import TextInput from '@/app/components/inputs/text.input.vue'
import ModalTitleComponent from '@/app/components/modal/base/modal-title.component.vue'
import InputSelectComponent from '@/app/components/inputs/select.input.vue'
import InputFileComponent from '@/app/components/inputs/file.input.vue'
import CheckboxInput from '@/app/components/inputs/checkbox.input.vue'

import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  firstname: Yup.string().required(),
  lastname: Yup.string().required(),
  role: Yup.mixed<Role>().oneOf(Object.values(Role)).required(),
  avatar: Yup.mixed<File>().notRequired(),
  'remove-avatar': Yup.boolean().required()
})

const props = defineProps<{
  user: UserDto
  callback: (values: any) => Promise<void>
}>()

const loading = ref<boolean>(false)

const validateUtil = useFormUtil()
const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: UpdateUser) => {
  loading.value = true
  await props.callback(values).finally(() => {
    loading.value = false
  })
})
</script>

<template>
  <Form @submit="onSubmit" :validation-schema="validationSchema" v-slot="{ meta }">
    <div class="d-flex flex-column gap-3">
      <ModalTitleComponent :title="`Update ${user.getFullName()}`" />

      <div class="d-flex flex-column gap-1">
        <h6 class="fw-semibold">{{ $t('forms.name') }}</h6>
        <div class="row gy-3 align-items-start flex-grow-1">
          <div class="col-12 col-sm-6 d-flex flex-column gap-1">
            <TextInput :value="props.user.profile.name.first" autocomplete="given-name" name="firstname" type="text" />
            <small class="text-light-alt">{{ $t('forms.given-name') }}</small>
          </div>
          <div class="col-12 col-sm-6 d-flex flex-column gap-1">
            <TextInput :value="props.user.profile.name.last" autocomplete="family-name" name="lastname" type="text" />
            <small class="text-light-alt">{{ $t('forms.family-name') }}</small>
          </div>
        </div>
      </div>

      <div class="d-flex flex-column">
        <TextInput label="forms.email" :value="props.user.email" autocomplete="email" name="email" type="email" />
      </div>

      <div class="d-flex flex-column gap-1">
        <h6 class="d-block fw-semibold">{{ $t('forms.role') }}</h6>
        <InputSelectComponent name="role" :value="user.role" :options="Object.values(Role)">
          <template #option="{ option }">
            {{ option }}
          </template>
        </InputSelectComponent>
      </div>

      <div class="d-flex flex-column gap-1">
        <h6 class="d-block fw-semibold">{{ $t('forms.profile-picture') }}</h6>
        <InputFileComponent name="avatar" />
      </div>

      <CheckboxInput
        name="remove-avatar"
        :value="false"
        label="administration.users.update-modal.remove-profile-picture"
      />

      <div class="d-grid">
        <button :disabled="!meta.valid || !meta.dirty || loading" class="btn btn-primary px-0" type="submit">
          <div v-if="true" class="containter">{{ $t('administration.users.update-modal.action') }}</div>
          <div v-else class="containter">{{ $t('actions.loading') }}</div>
        </button>
      </div>
    </div>
  </Form>
</template>
