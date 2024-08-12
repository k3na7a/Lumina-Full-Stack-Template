<script setup lang="ts">
import { reactive } from 'vue'
import { Form } from 'vee-validate'
import * as Yup from 'yup'

import { credentials } from '@/library/dto/JWT.dto'
import { useFormUtil } from '@/library/helpers/vee-validate.util'

import TextInput from '@/app/components/inputs/text.input.component.vue'
import { PasswordValidation } from '@/library/regex/validation.regex'

type LocalState = { loading: boolean }
type PropType = {
  close: () => void
  callback: (values: credentials) => Promise<void>
}

const props = defineProps<PropType>()
const state = reactive<LocalState>({ loading: false })

const validateUtil = useFormUtil()

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required(),
  lastname: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required().matches(PasswordValidation.regex)
})

const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: credentials) => {
  state.loading = true
  props.callback(values).finally(() => (state.loading = false))
})
</script>

<template>
  <Form v-on:submit="onSubmit" :validation-schema v-slot="{ meta }">
    <div class="d-flex justify-content-center pb-3">
      <div class="d-flex align-items-center">
        <div class="flex-shrink-0">
          <img id="logo" src="/media/logo.svg" style="width: 30px" />
        </div>
        <div class="flex-grow-1 ms-2">
          <h4 class="text-light fw-bold display-font">Join Testhub today</h4>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column">
      <h6 class="mb-1 fw-semibold">Name</h6>
      <div class="row gy-3 align-items-start flex-grow-1">
        <div class="col-12 col-sm-6">
          <TextInput class="mb-1" autocomplete="given-name" name="firstname" type="text" />
          <small>Given Name</small>
        </div>
        <div class="col-12 col-sm-6">
          <TextInput class="mb-1" autocomplete="family-name" name="lastname" type="text" />
          <small>Family Name</small>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column mt-3">
      <TextInput autocomplete="email" class="pb-3" name="email" type="email" label="general.email" />
      <TextInput autocomplete="new-password" class="pb-1" name="password" type="password" label="general.password" />
      <small>Passwords must be 8 to 16 characters long and contain the following:</small>
      <ul class="mb-0" style="list-style-type: circle">
        <li><small>At least one digit from 1 to 9 (including 0)</small></li>
        <li><small>At least one lowercase letter</small></li>
        <li><small>At least one uppercase letter</small></li>
        <li><small>At least one special character</small></li>
      </ul>
    </div>
    <div class="d-flex flex-column mt-3">
      <p class="text-muted">
        By clicking Sign Up, you are agreeing to Testhub’s
        <RouterLink
          target="_blank"
          :to="{ name: 'home' }"
          class="link-underline link-underline-opacity-0 link-underline-opacity-100-hover"
        >
          Terms of Service
        </RouterLink>
        and are acknowledging our
        <RouterLink
          target="_blank"
          :to="{ name: 'home' }"
          class="link-underline link-underline-opacity-0 link-underline-opacity-100-hover"
        >
          Privacy Notice
        </RouterLink>
        applies.
      </p>
    </div>
    <div class="d-grid mt-3">
      <button :disabled="!meta.valid || state.loading" class="btn btn-primary px-0" type="submit">
        <div v-if="!state.loading" class="containter">{{ $t('actions.sign-up') }}</div>
        <div v-else class="containter">{{ $t('actions.loading') }}</div>
      </button>
    </div>
  </Form>
</template>
