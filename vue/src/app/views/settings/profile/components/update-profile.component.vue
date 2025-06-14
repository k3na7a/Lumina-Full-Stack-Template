<script setup lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { Form } from 'vee-validate'
import { useI18n } from 'vue-i18n'

import TextInput from '@/app/components/inputs/text.input.vue'

import { validationSchema } from '../schema/update-profile-validation.schema.ts'
import { useFormUtil } from '@/library/utilities/forms.util.ts'
import { UpdateProfile, UserDto } from '@/library/apis/localhost/dto/user.dto.ts'
import { SettingsController } from '@/app/layouts/settings/controllers/settings.controller.ts'
import { AuthStore, useAuthStore } from '@/app/store/authentication.store.ts'

const { t } = useI18n()
const controller = new SettingsController(t)

const validateUtil = useFormUtil()
const authStore: AuthStore = useAuthStore()

const user: ComputedRef<UserDto | undefined> = computed(() => authStore.authenticatedUser)
const loading = ref<boolean>(false)

const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: UpdateProfile) => {
  loading.value = true
  controller.updateProfile(values).finally(() => (loading.value = false))
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
            <TextInput :value="user?.profile.name.first" autocomplete="given-name" name="firstname" type="text" />
            <small class="text-light-alt">{{ $t('forms.given-name') }}</small>
          </div>
          <div class="col-12 col-md-6 d-flex flex-column gap-1">
            <TextInput :value="user?.profile.name.last" autocomplete="family-name" name="lastname" type="text" />
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
