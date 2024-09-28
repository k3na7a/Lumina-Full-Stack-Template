<script setup lang="ts">
import { reactive, toRef } from 'vue'
import { Form } from 'vee-validate'

import TextInput from '@/app/components/inputs/input.text.component.vue'

import { useFormUtil } from '@/library/helpers/forms.util'
import { UpdateProfile, UserDto } from '@/library/dto/user.dto'
import { updateProfile as validationSchema } from '../../../schema/validation.schema.ts'

const validateUtil = useFormUtil()
const props = defineProps<{
  authenticatedUser: UserDto | undefined
  callback: (props: UpdateProfile) => Promise<void>
}>()

const user = toRef(props, 'authenticatedUser')
const state = reactive<{ loading: boolean }>({ loading: false })

const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: UpdateProfile) => {
  state.loading = true
  props.callback(values).finally(() => (state.loading = false))
})
</script>

<template>
  <Form v-on:submit="onSubmit" :validation-schema v-slot="{ meta }" :key="JSON.stringify(user?.updatedAt)">
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
      <button :disabled="!meta.valid || state.loading || !meta.dirty" class="btn btn-primary px-2" type="submit">
        {{ $t('actions.save-changes') }}
      </button>
    </div>
  </Form>
</template>
