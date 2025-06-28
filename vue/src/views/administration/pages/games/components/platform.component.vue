<script setup lang="ts">
import { Form } from 'vee-validate'

import TextInput from '@/shared/components/inputs/text.input.vue'
import DateInput from '@/shared/components/inputs/date.input.vue'

import Layout from '../layouts/platform.layout.vue'
import { usePlatformComposable, proptype } from '../composables/platform.composable'

const props = defineProps<proptype>()

const { loading, initialValues, onSubmit, validationSchema } = usePlatformComposable(props)
</script>

<template>
  <Form
    @submit="onSubmit"
    :validation-schema="validationSchema"
    :initial-values="initialValues"
    v-slot="{ meta, values }"
  >
    <Layout>
      <template #name>
        <TextInput name="name" type="text" :placeholder="$t('Nintendo Entertainment System')" />
      </template>

      <template #release_date>
        <DateInput name="release_date" />
      </template>

      <template #slug>
        <TextInput
          :value="
            values.name
              ?.replace(/[^a-zA-Z0-9 ]/g, ' ')
              .trim()
              .replace(/\W+/g, '-')
              .toLowerCase()
          "
          name="slug"
          label="forms.slug"
          type="text"
          :placeholder="$t('nintendo-entertainment-system')"
        />
      </template>

      <template #submit>
        <button :disabled="!meta.valid || loading" class="btn btn-primary px-0" type="submit">
          <div class="containter">
            {{ $t('administration.games-and-software.games.create.action') }}
          </div>
        </button>
      </template>
    </Layout>
  </Form>
</template>
