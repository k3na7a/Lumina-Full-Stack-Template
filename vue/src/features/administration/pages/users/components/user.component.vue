<script setup lang="ts">
import { Form } from 'vee-validate'

import { Role } from '@/library/dto/user.dto'

import TextInput from '@/shared/components/inputs/text.input.vue'
import SelectInput from '@/shared/components/inputs/select.input.vue'
import FileInput from '@/shared/components/inputs/file.input.vue'
import CheckboxInput from '@/shared/components/inputs/checkbox.input.vue'

import Layout from '../layouts/update-user.layout.vue'
import { proptype, useUserComposable } from '../composables/user.composable'

const props = defineProps<proptype>()
const { loading, onSubmit, validationSchema, initialValues, emailPlaceholder } = useUserComposable(props)
</script>

<template>
  <Form @submit="onSubmit" :initial-values="initialValues" :validation-schema="validationSchema" v-slot="{ meta }">
    <Layout>
      <template #firstname>
        <TextInput
          autocomplete="given-name"
          name="firstname"
          type="text"
          :placeholder="$t('forms.placeholders.first-name')"
        />
      </template>
      <template #lastname>
        <TextInput
          autocomplete="family-name"
          name="lastname"
          type="text"
          :placeholder="$t('forms.placeholders.last-name')"
        />
      </template>
      <template #email>
        <TextInput autocomplete="email" name="email" type="email" :placeholder="emailPlaceholder" />
      </template>
      <template #role>
        <SelectInput name="role" :options="Object.values(Role)">
          <template #option="{ option }">
            {{ option }}
          </template>
        </SelectInput>
      </template>
      <template #profile-picture>
        <FileInput name="avatar" />
      </template>
      <template #checkbox>
        <CheckboxInput name="remove-avatar" label="administration.user-management.user-table.update.remove-profile-picture" />
      </template>
      <template #submit>
        <button :disabled="!meta.valid || !meta.dirty || loading" class="btn btn-primary px-2" type="submit">
          <p class="containter">{{ $t('actions.save-changes') }}</p>
        </button>
      </template>
    </Layout>
  </Form>
</template>
