<script setup lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { Form } from 'vee-validate'
import { useI18n } from 'vue-i18n'

import { useFormUtil } from '@/core/utils/forms.util.ts'
import { UserDto, UpdateProfile } from '@/core/apis/dto/user.dto.ts'
import { AuthStore, useAuthStore } from '@/core/store/authentication.store.ts'

import TextInput from '@/shared/components/inputs/text.input.vue'

import { validationSchema } from '../composables/forms/update-profile-validation.schema.ts'
import { useSettingsHandler } from '../composables/settings.handler.ts'

const { t } = useI18n()
const handler = useSettingsHandler(t)

const validateUtil = useFormUtil()
const authStore: AuthStore = useAuthStore()

const user: ComputedRef<UserDto | undefined> = computed(() => authStore.authenticatedUser)
const loading = ref<boolean>(false)

const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: UpdateProfile) => {
  loading.value = true
  handler.updateProfile(values).finally(() => (loading.value = false))
})
</script>

<template>
  <Form
    @submit="onSubmit"
    :validation-schema="validationSchema"
    v-slot="{ meta }"
    :key="JSON.stringify(user?.updatedAt)"
  >
    <div class="section d-flex flex-column gap-3 flex-sm-row p-3">
      <div class="row-header">
        <h6 class="fw-bold">{{ $t('forms.name') }}</h6>
      </div>

      <div class="d-flex flex-column flex-grow-1">
        <div class="row gy-2 align-items-start flex-grow-1">
          <div class="col-12 col-md-6 d-flex flex-column gap-1">
            <TextInput
              :value="user?.profile.name.first"
              autocomplete="given-name"
              name="firstname"
              type="text"
              :placeholder="$t('forms.placeholders.first-name')"
            />
            <small class="text-light-alt">{{ $t('forms.given-name') }}</small>
          </div>
          <div class="col-12 col-md-6 d-flex flex-column gap-1">
            <TextInput
              :value="user?.profile.name.last"
              autocomplete="family-name"
              name="lastname"
              type="text"
              :placeholder="$t('forms.placeholders.last-name')"
            />
            <small class="text-light-alt">{{ $t('forms.family-name') }}</small>
          </div>
        </div>
      </div>
    </div>
    <div class="section bg-alt d-flex flex-row p-3 justify-content-end">
      <button :disabled="!meta.valid || loading || !meta.dirty" class="btn btn-primary px-2" type="submit">
        {{ $t('actions.save-changes') }}
      </button>
    </div>
  </Form>
</template>
