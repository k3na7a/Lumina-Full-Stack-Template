<script setup lang="ts">
import { reactive, toRef } from 'vue'
import { Form } from 'vee-validate'
import * as Yup from 'yup'

import TextInput from '@/components/inputs/text.input.component.vue'

import { useFormUtil } from '@/library/helpers/vee-validate.util'
import { UpdateEmail, UserDto } from '@/library/dto/user.dto'

type PropType = { authenticatedUser: UserDto | undefined; callback: (props: UpdateEmail) => Promise<void> }

const validateUtil = useFormUtil()

const props = defineProps<PropType>()
const state = reactive<{ loading: boolean; open: boolean }>({ loading: false, open: false })

const user = toRef(props, 'authenticatedUser')

const validationSchema = Yup.object().shape({
  password: Yup.string().required(),
  email: Yup.string().email().required(),
  confirm_email: Yup.string()
    .required()
    .oneOf([Yup.ref('email')])
})

const toggle = (): void => {
  state.open = !state.open
}

const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: UpdateEmail): Promise<void> => {
  state.loading = true
  props.callback(values).finally(() => (state.loading = false))
})
</script>

<template>
  <Form v-on:submit="onSubmit" :validation-schema v-slot="{ meta }" :key="JSON.stringify(user?.$updatedAt)">
    <div class="d-flex flex-column flex-sm-row p-3">
      <div class="row-header pe-3 mb-2 mb-sm-0">
        <h6 class="fw-bold">{{ $t('forms.email') }}</h6>
      </div>

      <template v-if="!state.open">
        <div class="d-flex flex-grow-1">
          <div class="d-flex flex-column flex-grow-1 pe-2 overflow-hidden">
            <h4 style="max-width: 240px" class="fw-semibold mb-1 text-truncate">{{ user?.email }}</h4>
            <p class="fw-normal text-muted">{{ $t('administration.settings.security-privacy.contact.email-linked') }}</p>
          </div>
          <div class="flex-shrink-1">
            <button class="btn btn-dark btn-icon-sm border-0 px-0" type="button" v-on:click="toggle">
              <font-awesome-icon :icon="['fas', 'pen']" />
            </button>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="d-flex flex-column flex-grow-1">
          <div class="row gy-2 align-items-start flex-grow-1 mb-2">
            <div class="col-12 col-md-6">
              <TextInput class="mb-1" autocomplete="email" name="email" type="email" />
              <small>{{ $t('forms.new-email') }}</small>
            </div>
            <div class="col-12 col-md-6">
              <TextInput class="mb-1" name="confirm_email" type="text" />
              <small>{{ $t('forms.confirm-new-email') }}</small>
            </div>
          </div>

          <div class="row align-items-start flex-grow-1 mb-2">
            <div class="col-12 col-md-6">
              <TextInput class="mb-1" autocomplete="current-password" name="password" type="password" />
              <small>{{ $t('forms.current-password') }}</small>
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
              {{ $t('actions.save-changes') }}
            </button>
          </div>
        </div>
      </template>
    </div>
  </Form>
</template>
