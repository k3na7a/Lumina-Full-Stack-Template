<script setup lang="ts">
import { reactive } from 'vue'
import { Form } from 'vee-validate'
import * as Yup from 'yup'
import { Router, useRouter } from 'vue-router'

import { useFormUtil } from '@/helpers/vee-validate.util'
import { AuthController } from '@/controllers/authentication.controller'
import { ForgotPassword } from '@/library/dto/user.dto'
import TextInput from '@/components/inputs/text.input.component.vue'
import { ROUTE_NAMES } from '@/router/routes'

enum PAGES {
  FORM,
  CONFIRMATION
}

type LocalState = { loading: boolean; page: PAGES; email: string | undefined }
const state = reactive<LocalState>({ loading: false, page: PAGES.FORM, email: undefined })

const { forgotPassword } = AuthController

const router: Router = useRouter()

const validateUtil = useFormUtil()
const validationSchema = Yup.object().shape({
  email: Yup.string().email().required()
})

function startOver(): void {
  state.email = undefined
  state.page = PAGES.FORM
}

function done(): void {
  router.push({ name: ROUTE_NAMES.HOME })
}

const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: ForgotPassword): Promise<void> => {
  state.loading = true
  await forgotPassword(values, () => {
    state.email = values.email
    state.page = PAGES.CONFIRMATION
  }).finally(() => (state.loading = false))
})
</script>

<template>
  <div class="d-flex flex-grow-1 justify-content-center p-3">
    <div style="max-width: 50rem" class="d-flex flex-column">
      <template v-if="state.page == PAGES.FORM">
        <h3 class="display-font fw-bold mb-1">{{ $t('authentication.account-recovery.title') }}</h3>
        <h5 class="fw-normal text-muted">{{ $t('authentication.account-recovery.subtitle') }}</h5>
        <Form v-on:submit="onSubmit" :validation-schema v-slot="{ meta }">
          <div class="mt-3">
            <TextInput class="mb-1" autocomplete="email" name="email" type="email" label="forms.email" />
            <small>{{ $t('authentication.account-recovery.label') }}</small>
          </div>
          <div class="d-grid mt-3">
            <button :disabled="!meta.valid || state.loading || !meta.dirty" class="btn btn-primary px-0" type="submit">
              <div v-if="!state.loading" class="containter">{{ $t('actions.continue') }}</div>
              <div v-else class="containter">{{ $t('actions.loading') }}</div>
            </button>
          </div>
        </Form>
      </template>
      <template v-else-if="state.page == PAGES.CONFIRMATION">
        <h3 class="display-font fw-bold mb-1">{{ $t('authentication.account-recovery.confirm-title') }}</h3>
        <h5 class="fw-normal text-muted mb-2">
          <i18n-t
            keypath="authentication.account-recovery.confirm-body-sent-link"
            tag="h5"
            class="fw-normal text-muted mb-2"
            scope="global"
          >
            <span class="text-light fw-bold">{{ state.email }}</span>
          </i18n-t>
        </h5>
        <h5 class="fw-normal text-muted">
          {{ $t('authentication.account-recovery.confirm-body-check-spam') }}
        </h5>
        <div class="d-flex flex-row justify-content-end mt-3">
          <button class="btn btn-secondary px-2 me-2" type="button" v-on:click="startOver">
            {{ $t('actions.start-over') }}
          </button>
          <button class="btn btn-primary px-2" type="button" v-on:click="done">
            {{ $t('actions.done') }}
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
