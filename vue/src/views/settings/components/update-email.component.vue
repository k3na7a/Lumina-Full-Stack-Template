<script setup lang="ts">
import { Form } from 'vee-validate'
import TextInput from '@/shared/components/inputs/text.input.vue'
import { proptype, useUpdateEmail } from '../composables/update-email.composable'

const props = defineProps<proptype>()
const { onSubmit, user, state, validationSchema } = useUpdateEmail(props)
</script>

<template>
  <Form
    @submit="onSubmit"
    :validation-schema="validationSchema"
    v-slot="{ meta }"
    :key="JSON.stringify(user?.updatedAt)"
    class="w-100"
  >
    <template v-if="!state.open">
      <div class="d-flex flex-grow-1 flex-nowrap gap-2">
        <div class="d-flex flex-column flex-grow-1 gap-1 overflow-hidden">
          <h4 style="max-width: 240px" class="fw-semibold text-truncate">{{ user?.email }}</h4>
          <p class="fw-normal text-light-alt">
            {{ $t('settings.security-privacy.contact.email.linked') }}
          </p>
        </div>
        <div class="flex-shrink-1">
          <button class="btn btn-dark btn-icon-sm px-0" type="button" @click="state.open = !state.open">
            <font-awesome-icon size="sm" :icon="['fas', 'pen']" />
          </button>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="d-flex flex-column flex-grow-1 gap-2">
        <div class="row gy-2 align-items-start flex-grow-1">
          <div class="col-12 col-md-6 d-flex flex-column gap-1">
            <TextInput autocomplete="email" name="email" type="email" :placeholder="$t('actions.enter-email')" />
            <small>{{ $t('forms.new-email') }}</small>
          </div>
          <div class="col-12 col-md-6 d-flex flex-column gap-1">
            <TextInput name="confirm_email" type="text" :placeholder="$t('actions.confirm-email')" />
            <small>{{ $t('actions.confirm-new-email') }}</small>
          </div>
        </div>

        <div class="row align-items-start flex-grow-1">
          <div class="col-12 col-md-6 d-flex flex-column gap-1">
            <TextInput
              autocomplete="current-password"
              name="password"
              type="password"
              :placeholder="$t('actions.enter-password')"
            />
            <small>{{ $t('forms.current-password') }}</small>
          </div>
        </div>

        <div class="d-flex flex-row justify-content-end gap-2">
          <button class="btn btn-secondary px-2" type="button" @click="state.open = !state.open">
            {{ $t('actions.cancel') }}
          </button>
          <button :disabled="!meta.valid || state.loading || !meta.dirty" class="btn btn-primary px-2" type="submit">
            {{ $t('actions.save-changes') }}
          </button>
        </div>
      </div>
    </template>
  </Form>
</template>
