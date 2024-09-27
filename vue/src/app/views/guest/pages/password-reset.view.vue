<script setup lang="ts">
import { reactive } from 'vue'
import { Form } from 'vee-validate'

import * as Yup from 'yup'
import { LocationQuery, RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from 'vue-router'

import { ROUTE_NAMES } from '@/app/router/routes.enum'
import { ResetPassword } from '@/library/dto/user.dto'
import { PasswordValidation } from '@/library/regex/validation.regex'
import { useFormUtil } from '@/library/helpers/forms.util'

import TextInput from '@/app/components/inputs/input.text.component.vue'
import PasswordValidationList from '@/app/components/labels/password-validation-list.component.vue'
import { GuestService } from '../services/guest.service'

enum PAGES {
  FORM,
  CONFIRMATION
}

type LocalState = { loading: boolean; page: PAGES }
const state = reactive<LocalState>({ loading: false, page: PAGES.FORM })

const { resetPassword } = GuestService

const route: RouteLocationNormalizedLoaded = useRoute()
const router: Router = useRouter()

const queryParams: LocationQuery = route.query

const { getSubmitFn } = useFormUtil()
const validationSchema = Yup.object().shape({
  new_password: Yup.string().required().matches(PasswordValidation.regex),
  confirm_password: Yup.string()
    .required()
    .oneOf([Yup.ref('new_password')])
})

function callback(): void {
  state.page = PAGES.CONFIRMATION
}

function done(): void {
  router.push({ name: ROUTE_NAMES.HOME })
}

const onSubmit = getSubmitFn(validationSchema, async (values: ResetPassword): Promise<void> => {
  if (!(queryParams.hasOwnProperty('reset_token') && typeof queryParams['reset_token'] === 'string')) return

  state.loading = true
  await resetPassword(values, queryParams['reset_token'], callback).finally(() => (state.loading = false))
})
</script>

<template>
  <div class="d-flex flex-grow-1 justify-content-center p-3">
    <div style="max-width: 50rem" class="d-flex flex-column">
      <template v-if="state.page == PAGES.FORM">
        <h3 class="display-font fw-bold mb-1">{{ $t('authentication.password-reset.title') }}</h3>
        <h5 class="fw-normal text-muted">
          {{ $t('authentication.password-reset.subtitle') }}
        </h5>
        <Form v-on:submit="onSubmit" :validationSchema v-slot="{ meta }">
          <div class="mt-3">
            <TextInput
              class="pb-1"
              autocomplete="new-password"
              name="new_password"
              type="password"
              label="forms.new-password"
            />
            <PasswordValidationList />
            <TextInput
              class="mt-3 pb-1"
              autocomplete="new-password"
              name="confirm_password"
              type="password"
              label="actions.confirm-new-password"
            />
          </div>
          <div class="d-grid mt-3">
            <button :disabled="!meta.valid || state.loading || !meta.dirty" class="btn btn-primary px-0" type="submit">
              <div v-if="!state.loading" class="containter">{{ $t('actions.continue') }}</div>
              <div v-else class="containter">
                {{ $t('actions.loading') }}
              </div>
            </button>
          </div>
        </Form>
      </template>
      <template v-else-if="state.page == PAGES.CONFIRMATION">
        <h3 class="display-font fw-bold mb-1">{{ $t('authentication.password-reset.confirm-title') }}</h3>
        <h5 class="fw-normal text-muted">
          {{ $t('authentication.password-reset.confirm-body') }}
        </h5>
        <div class="d-flex flex-row justify-content-end mt-3">
          <button class="btn btn-primary px-2" type="button" v-on:click="done">
            {{ $t('actions.done') }}
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
