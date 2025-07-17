<script setup lang="ts">
import { Form } from 'vee-validate'

import TextInput from '@/shared/components/inputs/text.input.vue'
import FileInput from '@/shared/components/inputs/file.input.vue'
import CheckboxInput from '@/shared/components/inputs/checkbox.input.vue'
import SearchPaginatedInput from '@/shared/components/inputs/search-paginated-input.input.vue'
import ModalTitle from '@/shared/components/modal/base/modal-title.component.vue'

import Layout from '../layouts/update-user.layout.vue'

import { proptype, useUserComposable } from '../composables/user.composable'
import { defaultOptions } from '../composables/role-table.composable'

const props = defineProps<proptype>()
const { loading, onSubmit, validationSchema, initialValues, emailPlaceholder, getRoles } = useUserComposable(props)
</script>

<template>
  <Form @submit="onSubmit" :initial-values="initialValues" :validation-schema="validationSchema" v-slot="{ meta }">
    <Layout>
      <template #title>
        <ModalTitle :title="$t('administration.user-management.users.update.title')" />
      </template>
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

      <template #roles>
        <SearchPaginatedInput name="roles" :callback="getRoles" :options="defaultOptions">
          <template #option="{ option }">
            {{ option.label }}
            <small class="ms-2 text-muted fst-italic">{{ option.id }}</small>
          </template>
        </SearchPaginatedInput>
      </template>

      <template #profile-picture>
        <FileInput name="avatar" />
      </template>
      <template #checkbox>
        <CheckboxInput
          name="remove-avatar"
          label="administration.user-management.users.update.remove-profile-picture"
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
