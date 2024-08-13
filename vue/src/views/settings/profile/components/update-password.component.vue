<script setup lang="ts">
import { reactive, toRef } from 'vue'
import { Form } from 'vee-validate'
import * as Yup from 'yup'

import TextInput from '@/components/inputs/text.input.component.vue'

import { PasswordValidation } from '@/library/regex/validation.regex'
import { useFormUtil } from '@/helpers/vee-validate.util'
import { UserDto, UpdatePassword } from '@/library/dto/user.dto'

type PropType = {
  authenticatedUser: UserDto | undefined
  callback: (props: UpdatePassword) => Promise<void>
}

const validateUtil = useFormUtil()

const props = defineProps<PropType>()
const state = reactive<{ loading: boolean; open: boolean }>({ loading: false, open: false })

const user = toRef(props, 'authenticatedUser')

const validationSchema = Yup.object().shape({
  current_password: Yup.string().required(),
  password: Yup.string().required().matches(PasswordValidation.regex),
  confirm_password: Yup.string()
    .required()
    .oneOf([Yup.ref('password')])
})

const toggle = (): void => {
  state.open = !state.open
}

const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: UpdatePassword) => {
  state.loading = true
  props.callback(values).finally(() => (state.loading = false))
})
</script>

<template>
  <Form v-on:submit="onSubmit" :validation-schema v-slot="{ meta }" :key="JSON.stringify(user?.$updatedAt)">
    <div class="d-flex flex-column flex-sm-row p-3">
      <div class="row-header pe-3 mb-2 mb-sm-0">
        <h6 class="fw-bold">Password</h6>
      </div>

      <template v-if="!state.open">
        <div class="d-flex flex-grow-1">
          <p class="fw-normal text-muted">
            <button v-on:click="toggle" class="btn btn-link fw-normal">Change password.</button>
            Improve your security with a strong password.
          </p>
        </div>
      </template>

      <template v-else>
        <div class="d-flex flex-column flex-grow-1">
          <div class="row align-items-start flex-grow-1 mb-2">
            <div class="col-12 col-md-6">
              <TextInput class="mb-1" autocomplete="current-password" name="current_password" type="password" />
              <small class="text-muted">Current Password</small>
            </div>
          </div>
          <div class="row gy-2 align-items-start flex-grow-1 mb-2">
            <div class="col-12 col-md-6">
              <TextInput class="mb-1" autocomplete="new-password" name="password" type="password" />
              <small class="text-muted">New Password</small>
            </div>
            <div class="col-12 col-md-6">
              <TextInput class="mb-1" autocomplete="new-password" name="confirm_password" type="password" />
              <small class="text-muted">Confirm New Password</small>
            </div>
          </div>

          <div class="d-flex flex-row justify-content-end">
            <button class="btn btn-secondary px-2" type="button" v-on:click="toggle">
              {{ $t('actions.cancel') }}
            </button>
            <button
              :disabled="!meta.valid || state.loading || !meta.dirty"
              class="btn btn-primary px-2 ms-2"
              type="submit"
            >
              {{ $t('general.save-changes') }}
            </button>
          </div>
        </div>
      </template>
    </div>
  </Form>
</template>
