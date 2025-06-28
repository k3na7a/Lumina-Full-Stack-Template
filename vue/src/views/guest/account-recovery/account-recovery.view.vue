<script setup lang="ts">
import { reactive } from 'vue'
import { Form } from 'vee-validate'
import { Router, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useFormUtil } from '@/core/utils/forms.util.ts'
import { ForgotPassword } from '@/library/dto/user.dto.ts'
import { useAuthHandler } from '@/core/handlers/authentication.handler.ts'

import { validationSchema } from './account-recovery.form.ts'

import TextInput from '@/shared/components/inputs/text.input.vue'
import { ROUTE_NAMES } from '@/library/enums/route-names.enum.ts'

enum PAGES {
  FORM,
  CONFIRMATION
}

const { t } = useI18n()
const handler = useAuthHandler(t)
const { push }: Router = useRouter()
const { getSubmitFn } = useFormUtil()

const state = reactive<{ loading: boolean; page: PAGES; email: string | undefined }>({
  loading: false,
  page: PAGES.FORM,
  email: undefined
})

const startOver = (): void => {
  state.email = undefined
  state.page = PAGES.FORM
}

const done = (): void => {
  push({ name: ROUTE_NAMES.HOME })
}

const onSubmit = getSubmitFn(validationSchema, async (values: { email: string }): Promise<void> => {
  state.loading = true
  await handler
    .forgotPassword({ email: values.email, redirect: process.env.BASE_URL } as ForgotPassword, () => {
      state.email = values.email
      state.page = PAGES.CONFIRMATION
    })
    .finally(() => (state.loading = false))
})
</script>

<template>
  <div class="d-flex flex-grow-1 justify-content-center p-3">
    <template v-if="state.page == PAGES.FORM">
      <div style="max-width: 50rem" class="d-flex flex-column gap-3">
        <div class="d-flex flex-column gap-1">
          <h3 class="display-font fw-bold">{{ $t('authentication.account-recovery.title') }}</h3>
          <h5 class="fw-normal text-muted">{{ $t('authentication.account-recovery.subtitle') }}</h5>
        </div>
        <Form
          @submit="onSubmit"
          :validation-schema="validationSchema"
          v-slot="{ meta }"
          class="d-flex flex-column gap-3"
        >
          <div class="d-flex flex-column gap-1">
            <TextInput autocomplete="email" name="email" type="email" label="forms.email" />
            <small>{{ $t('authentication.account-recovery.label') }}</small>
          </div>
          <div class="d-grid">
            <button :disabled="!meta.valid || state.loading || !meta.dirty" class="btn btn-primary px-0" type="submit">
              <div v-if="!state.loading" class="containter">{{ $t('actions.continue') }}</div>
              <div v-else class="containter">{{ $t('actions.loading') }}</div>
            </button>
          </div>
        </Form>
      </div>
    </template>

    <template v-else-if="state.page == PAGES.CONFIRMATION">
      <div style="max-width: 50rem" class="d-flex flex-column gap-3">
        <h3 class="display-font fw-bold">{{ $t('authentication.account-recovery.confirm-title') }}</h3>
        <h5 class="fw-normal text-muted">
          <i18n-t
            keypath="authentication.account-recovery.confirm-body-sent-link"
            tag="h5"
            class="fw-normal text-muted"
            scope="global"
          >
            <span class="text-light fw-bold">{{ state.email }}</span>
          </i18n-t>
        </h5>
        <h5 class="fw-normal text-muted">
          {{ $t('authentication.account-recovery.confirm-body-check-spam') }}
        </h5>
        <div class="d-flex flex-row gap-2 justify-content-end">
          <button class="btn btn-secondary px-2" type="button" @click="startOver">
            {{ $t('actions.start-over') }}
          </button>
          <button class="btn btn-primary px-2" type="button" @click="done">
            {{ $t('actions.done') }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
