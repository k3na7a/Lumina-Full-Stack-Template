<script setup lang="ts">
import { reactive, toRef } from 'vue'
import { Form } from 'vee-validate'
import * as Yup from 'yup'

import TextInput from '@/app/components/inputs/text.input.component.vue'

import { useFormUtil } from '@/helpers/utils/vee-validate.util'
import { UpdateProfile, UpdateProfileDto, UserDto } from '@/library/dto/user.dto'
import { AuthStore, useAuthStore } from '@/app/store/authentication.store'

type PropType = {
  authenticatedUser: UserDto | undefined
}

const validateUtil = useFormUtil()
const { updateProfile }: AuthStore = useAuthStore()

const props = defineProps<PropType>()

const user = toRef(props, 'authenticatedUser')

const state = reactive<{ loading: boolean }>({ loading: false })

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required(),
  lastname: Yup.string().required()
})

const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: UpdateProfile) => {
  state.loading = true
  updateProfile(new UpdateProfileDto(values)).finally(() => (state.loading = false))
  //   .catch((error: AxiosError) => addToast({ title: error.response?.statusText || 'ERROR', body: error.message }))
})
</script>

<template>
  <div class="d-flex flex-column mb-2">
    <h4 class="text-light fw-semibold">Profile Settings</h4>
    <p class="text-muted fw-normal">Change identifying details for your account</p>
  </div>

  <div class="card d-flex flex-column mb-3">
    <Form v-on:submit="onSubmit" :validation-schema v-slot="{ meta }" :key="JSON.stringify(user?.profile)">
      <div class="section d-flex flex-row p-3">
        <div class="row-header pe-3">
          <h6 class="fw-bold">Name</h6>
        </div>
        <div class="row align-items-start flex-grow-1">
          <div class="col">
            <TextInput
              class="mb-1"
              :value="user?.profile.name.first"
              autocomplete="given-name"
              name="firstname"
              type="text"
            />
            <small class="text-muted">Given Name</small>
          </div>
          <div class="col">
            <TextInput
              class="mb-1"
              :value="user?.profile.name.last"
              autocomplete="family-name"
              name="lastname"
              type="text"
            />
            <small class="text-muted">Family Name</small>
          </div>
        </div>
      </div>
      <div class="section bg-alt d-flex flex-row p-3 justify-content-end">
        <button :disabled="!meta.valid || state.loading || !meta.dirty" class="btn btn-primary px-2" type="submit">
          {{ $t('Save Changes') }}
        </button>
      </div>
    </Form>
  </div>
</template>
