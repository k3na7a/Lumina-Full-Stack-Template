<script setup lang="ts">
import { reactive } from 'vue'
import { Form } from 'vee-validate'
import * as Yup from 'yup'

import { credentials } from '@/library/dto/JWT.dto'
import { useFormUtil } from '@/helpers/vee-validate.util'

import TextInput from '@/components/inputs/text.input.component.vue'
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
        <div class="flex-grow-1 px-2">
          <h4 class="text-light fw-bold display-font">
            {{ $t('authentication.register.title') }}
          </h4>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column">
      <h6 class="mb-1 fw-semibold">{{ $t('general.name') }}</h6>
      <div class="row gy-3 align-items-start flex-grow-1">
        <div class="col-12 col-sm-6">
          <TextInput class="mb-1" autocomplete="given-name" name="firstname" type="text" />
          <small>{{ $t('forms.given-name') }}</small>
        </div>
        <div class="col-12 col-sm-6">
          <TextInput class="mb-1" autocomplete="family-name" name="lastname" type="text" />
          <small>{{ $t('forms.family-name') }}</small>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column mt-3">
      <TextInput autocomplete="email" class="pb-3" name="email" type="email" label="general.email" />
      <TextInput autocomplete="new-password" class="pb-1" name="password" type="password" label="general.password" />
      <div>
        <small>{{ $t('authentication.password-validation.label') }}</small>
        <ul class="mb-0" style="list-style-type: circle">
          <li>
            <small>{{ $t('authentication.password-validation.contains.1') }}</small>
          </li>
          <li>
            <small>{{ $t('authentication.password-validation.contains.2') }}</small>
          </li>
          <li>
            <small>{{ $t('authentication.password-validation.contains.3') }}</small>
          </li>
          <li>
            <small>{{ $t('authentication.password-validation.contains.4') }}</small>
          </li>
        </ul>
      </div>
    </div>
    <div class="d-flex flex-column mt-3">
      <p class="text-muted">
        By clicking Sign Up, you are agreeing to Testhub’s
        <RouterLink target="_blank" :to="{ name: 'home' }" class="btn btn-link fw-normal">
          Terms of Service
        </RouterLink>
        and are acknowledging our
        <RouterLink target="_blank" :to="{ name: 'home' }" class="btn btn-link fw-normal"> Privacy Notice </RouterLink>
        applies.
      </p>
    </div>
    <div class="d-grid mt-3">
      <button :disabled="!meta.valid || state.loading" class="btn btn-primary px-0" type="submit">
        <div v-if="!state.loading" class="containter">{{ $t('actions.sign-up') }}</div>
        <div v-else class="containter">
          {{ $t('actions.loading') }}
        </div>
      </button>
    </div>
  </Form>
</template>
