<script setup lang="ts">
import { Form } from 'vee-validate'
import TextInput from '@/shared/components/inputs/text.input.vue'
import Layout from './layouts/register.layout.vue'
import { useRegisterModal, proptype } from './composables/registration.composable'

const { callback } = defineProps<proptype>()
const { loading, onSubmit, validationSchema, emailPlaceholder } = useRegisterModal(callback)
</script>

<template>
  <Form @submit="onSubmit" :validation-schema="validationSchema" v-slot="{ meta }">
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
        <TextInput autocomplete="email" name="email" type="email" label="forms.email" :placeholder="emailPlaceholder" />
      </template>
      <template #new-password>
        <TextInput
          autocomplete="new-password"
          name="password"
          type="password"
          label="forms.password"
          :placeholder="$t('actions.enter-new-password')"
        />
      </template>
      <template #submit>
        <button :disabled="!meta.valid || loading || !meta.dirty" class="btn btn-primary px-0" type="submit">
          <div v-if="!loading" class="containter">{{ $t('actions.sign-up') }}</div>
          <div v-else class="containter">{{ $t('actions.loading') }}</div>
        </button>
      </template>
    </Layout>
  </Form>
</template>
