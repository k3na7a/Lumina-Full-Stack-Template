<script setup lang="ts">
import { ref, toRef } from 'vue'
import { Form, GenericObject, SubmissionContext } from 'vee-validate'
import { useI18n } from 'vue-i18n'

import { useFormUtil } from '@/core/utils/forms.v2.util'
import { UserDto, UpdateUser, Role } from '@/core/apis/dto/user.dto'
import { validationSchema } from '../schema/update-user-validation.schema'

import TextInput from '@/shared/components/inputs/text.input.vue'
import SelectInput from '@/shared/components/inputs/select.input.vue'
import FileInput from '@/shared/components/inputs/file.input.vue'
import CheckboxInput from '@/shared/components/inputs/checkbox.input.vue'

import Layout from '../layouts/update-user.layout.vue'

const { messages, locale } = useI18n()

const validateUtil = useFormUtil()
const loading = ref<boolean>(false)

const props = defineProps<{ user: UserDto; callback: (values: UpdateUser) => Promise<void> }>()
const user = toRef(props, 'user')

const currentMessages = messages.value[locale.value] as Record<string, any>
const emailPlaceholder = currentMessages.administration.users['user-table'].update.placeholders.email as string

const onSubmit = validateUtil.getSubmitFn<UpdateUser>(validationSchema, async (values: UpdateUser) => {
  loading.value = true
  await props.callback(values).finally(() => {
    loading.value = false
  })
})
</script>

<template>
  <Form
    @submit="(values: GenericObject, ctx: SubmissionContext<GenericObject>) => onSubmit(values as UpdateUser, ctx)"
    :validation-schema="validationSchema"
    v-slot="{ meta }"
  >
    <Layout>
      <template #firstname>
        <TextInput
          :value="user.profile.name.first"
          autocomplete="given-name"
          name="firstname"
          type="text"
          :placeholder="$t('forms.placeholders.first-name')"
        />
      </template>
      <template #lastname>
        <TextInput
          :value="user.profile.name.last"
          autocomplete="family-name"
          name="lastname"
          type="text"
          :placeholder="$t('forms.placeholders.last-name')"
        />
      </template>
      <template #email>
        <TextInput :value="user.email" autocomplete="email" name="email" type="email" :placeholder="emailPlaceholder" />
      </template>
      <template #role>
        <SelectInput name="role" :value="user.role" :options="Object.values(Role)">
          <template #option="{ option }">
            {{ option }}
          </template>
        </SelectInput>
      </template>
      <template #profile-picture>
        <FileInput name="avatar" />
      </template>
      <template #checkbox>
        <CheckboxInput
          name="remove-avatar"
          :value="false"
          label="administration.users.user-table.update.remove-profile-picture"
        />
      </template>
      <template #submit>
        <button :disabled="!meta.valid || !meta.dirty || loading" class="btn btn-primary px-2" type="submit">
          <p class="containter">{{ $t('actions.save-changes') }}</p>
        </button>
      </template>
    </Layout>
  </Form>
</template>
