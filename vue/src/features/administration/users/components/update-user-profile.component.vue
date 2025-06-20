<script setup lang="ts">
import { ref, toRef, watch } from 'vue'
import { Form, GenericObject, SubmissionContext } from 'vee-validate'
import { useI18n } from 'vue-i18n'

import { useFormUtil } from '@/core/utilities/forms.v2.util'
import { validationSchema } from '../schema/update-user-validation.schema'
import { useUserAdminHandler } from '../handlers/user.handler'

import TextInput from '@/shared/components/inputs/text.input.vue'
import InputSelectComponent from '@/shared/components/inputs/select.input.vue'
import UpdateUserProfileLayout from '../layouts/update-user-profile.layout.vue'
import { UserDto, UpdateUser, Role } from '@/core/apis/dto/user.dto'

const { t } = useI18n()
const handler = useUserAdminHandler(t)

const validateUtil = useFormUtil()
const loading = ref<boolean>(false)

const props = defineProps<{ user: UserDto; callback?: (user: UserDto) => void }>()
const user = toRef(props, 'user')
const renderKey = ref(Date.now())

watch(user, (_: UserDto) => {
  renderKey.value = Date.now()
})

const onSubmit = validateUtil.getSubmitFn<UpdateUser>(validationSchema, async (values: UpdateUser) => {
  loading.value = true
  await handler.update(user.value, values, props.callback).finally(() => {
    loading.value = false
  })
})
</script>

<template>
  <Form
    @submit="(values: GenericObject, ctx: SubmissionContext<GenericObject>) => onSubmit(values as UpdateUser, ctx)"
    :validation-schema="validationSchema"
    v-slot="{ meta }"
    :key="renderKey"
  >
    <UpdateUserProfileLayout>
      <template #firstname>
        <TextInput :value="user.profile.name.first" autocomplete="given-name" name="firstname" type="text" />
      </template>
      <template #lastname>
        <TextInput :value="user.profile.name.last" autocomplete="family-name" name="lastname" type="text" />
      </template>
      <template #email>
        <TextInput :value="user.email" autocomplete="email" name="email" type="email" />
      </template>
      <template #role>
        <InputSelectComponent name="role" :value="user.role" :options="Object.values(Role)">
          <template #option="{ option }">
            {{ option }}
          </template>
        </InputSelectComponent>
      </template>
      <template #submit>
        <button :disabled="!meta.valid || !meta.dirty || loading" class="btn btn-primary px-2" type="submit">
          <p class="containter">{{ $t('actions.save-changes') }}</p>
        </button>
      </template>
    </UpdateUserProfileLayout>
  </Form>
</template>
