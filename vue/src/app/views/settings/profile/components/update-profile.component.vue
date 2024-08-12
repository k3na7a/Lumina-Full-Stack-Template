<script setup lang="ts">
import { reactive, toRef } from 'vue'
import { Form } from 'vee-validate'
import * as Yup from 'yup'

import TextInput from '@/app/components/inputs/text.input.component.vue'

import { useFormUtil } from '@/library/helpers/vee-validate.util'
import { UpdateProfile, UserDto } from '@/library/dto/user.dto'

type PropType = {
  authenticatedUser: UserDto | undefined
  callback: (props: UpdateProfile) => Promise<void>
}

const validateUtil = useFormUtil()

const props = defineProps<PropType>()

const user = toRef(props, 'authenticatedUser')
const state = reactive<{ loading: boolean }>({ loading: false })

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required(),
  lastname: Yup.string().required()
})

const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: UpdateProfile) => {
  state.loading = true
  props.callback(values).finally(() => (state.loading = false))
})
</script>

<template>
  <Form v-on:submit="onSubmit" :validation-schema v-slot="{ meta }" :key="JSON.stringify(user?.$updatedAt)">
    <div class="section d-flex flex-column flex-sm-row flex-row p-3">
      <div class="row-header pe-3 mb-2 mb-sm-0">
        <h6 class="fw-bold">Name</h6>
      </div>

      <div class="d-flex flex-column flex-grow-1">
        <div class="row gy-2 align-items-start flex-grow-1">
          <div class="col-12 col-md-6">
            <TextInput
              class="mb-1"
              :value="user?.profile.name.first"
              autocomplete="given-name"
              name="firstname"
              type="text"
            />
            <small class="text-muted">Given Name</small>
          </div>
          <div class="col-12 col-md-6">
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
    </div>
    <div class="section bg-alt d-flex flex-row p-3 justify-content-end">
      <button :disabled="!meta.valid || state.loading || !meta.dirty" class="btn btn-primary px-2" type="submit">
        {{ $t('general.save-changes') }}
      </button>
    </div>
  </Form>
</template>
