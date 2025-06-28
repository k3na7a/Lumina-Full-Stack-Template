<script setup lang="ts">
import { reactive } from 'vue'
import { Form } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { LocationQuery, RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from 'vue-router'

import { useFormUtil } from '@/core/utils/forms.util'
import { ResetPassword } from '@/library/dto/user.dto'
import { useAuthHandler } from '@/core/handlers/authentication.handler'

import { ROUTE_NAMES } from '@/library/enums/route-names.enum'
import TextInput from '@/shared/components/inputs/text.input.vue'
import PasswordValidationList from '@/shared/components/labels/password-validation-list.component.vue'

import { validationSchema } from './password-reset.form'

enum PAGES {
  FORM,
  CONFIRMATION
}

const { t } = useI18n()
const handler = useAuthHandler(t)
const { getSubmitFn } = useFormUtil()

const $route: RouteLocationNormalizedLoaded = useRoute()
const $router: Router = useRouter()

const queryParams: LocationQuery = $route.query

const state = reactive<{ loading: boolean; page: PAGES }>({ loading: false, page: PAGES.FORM })

function callback(): void {
  state.page = PAGES.CONFIRMATION
}

function done(): void {
  $router.push({ name: ROUTE_NAMES.HOME })
}

const onSubmit = getSubmitFn(validationSchema, async (values: ResetPassword): Promise<void> => {
  if (!(queryParams.hasOwnProperty('reset_token') && typeof queryParams['reset_token'] === 'string')) return

  state.loading = true
  await handler.resetPassword(values, queryParams['reset_token'], callback).finally(() => (state.loading = false))
})
</script>

<template>
  <div class="d-flex flex-grow-1 justify-content-center p-3">
    <template v-if="state.page == PAGES.FORM">
      <div style="max-width: 50rem" class="d-flex flex-column gap-3">
        <div class="d-flex flex-column gap-1">
          <h3 class="display-font fw-bold">{{ $t('authentication.password-reset.title') }}</h3>
          <h5 class="fw-normal text-muted">
            {{ $t('authentication.password-reset.subtitle') }}
          </h5>
        </div>
        <Form @submit="onSubmit" :validationSchema v-slot="{ meta }" class="d-flex flex-column gap-3">
          <div class="d-flex flex-column gap-1">
            <TextInput autocomplete="new-password" name="new_password" type="password" label="forms.new-password" />
            <PasswordValidationList />
          </div>
          <TextInput
            autocomplete="new-password"
            name="confirm_password"
            type="password"
            label="actions.confirm-new-password"
          />
          <div class="d-grid">
            <button :disabled="!meta.valid || state.loading || !meta.dirty" class="btn btn-primary px-0" type="submit">
              <div v-if="!state.loading" class="containter">{{ $t('actions.continue') }}</div>
              <div v-else class="containter">
                {{ $t('actions.loading') }}
              </div>
            </button>
          </div>
        </Form>
      </div>
    </template>
    <template v-else-if="state.page == PAGES.CONFIRMATION">
      <div style="max-width: 50rem" class="d-flex flex-column gap-3">
        <h3 class="display-font fw-bold">
          {{ $t('authentication.password-reset.confirm-title') }}
        </h3>
        <h5 class="fw-normal text-muted">
          {{ $t('authentication.password-reset.confirm-body') }}
        </h5>
        <div class="d-flex flex-row justify-content-end">
          <button class="btn btn-primary px-2" type="button" @click="done">
            {{ $t('actions.done') }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
