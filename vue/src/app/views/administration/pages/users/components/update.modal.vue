<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'
import * as Yup from 'yup'

import { credentials } from '@/library/dto/JWT.dto'
import { Role, UserDto } from '@/library/dto/user.dto'
import { useFormUtil } from '@/library/helpers/forms.util'

import TextInput from '@/app/components/inputs/input.text.component.vue'
import ModalTitleComponent from '@/app/components/modal/base/modal-title.component.vue'
import InputSelectComponent from '@/app/components/inputs/input.select.component.vue'

const props = defineProps<{
  user: UserDto
  callback: (values: credentials) => Promise<void>
}>()

const loading = ref<boolean>(false)

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  firstname: Yup.string().required(),
  lastname: Yup.string().required(),
  role: Yup.mixed<Role>().oneOf(Object.values(Role))
})

const validateUtil = useFormUtil()
const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: any) => {
  loading.value = true
  props.callback(values).finally(() => {
    loading.value = false
  })
})
</script>

<template>
  <Form v-on:submit="onSubmit" :validation-schema v-slot="{ meta }">
    <div class="d-flex flex-column gap-3">
      <ModalTitleComponent :title="`Update ${user.getFullName()}`" />
      <div class="d-flex flex-column">
        <TextInput
          :label="$t('forms.email')"
          :value="props.user.email"
          autocomplete="email"
          name="email"
          type="email"
        />
      </div>
      <div class="d-flex flex-column gap-1">
        <h6 class="d-block fw-semibold">{{ $t('forms.role') }}</h6>
        <InputSelectComponent name="role" :default="user.role" :options="Object.values(Role)">
          <template v-slot:option="{ option }">
            {{ option }}
          </template>
        </InputSelectComponent>
      </div>
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
      <div class="d-grid">
        <button
          target="_blank"
          :to="{ name: 'home' }"
          :disabled="!meta.valid || !meta.dirty"
          class="btn btn-primary px-0"
          type="submit"
        >
          <div v-if="true" class="containter">{{ $t('Update User') }}</div>
          <div v-else class="containter">{{ $t('actions.loading') }}</div>
        </button>
      </div>
    </div>
  </Form>
</template>
