<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'

import TextInput from '@/app/components/inputs/text.input.vue'
import FileInput from '@/app/components/inputs/file.input.vue'
import DateInput from '@/app/components/inputs/date.input.vue'

import Layout from '../layouts/new-game.layout.vue'

import { useFormUtil } from '@/library/utilities/forms.util'
import { validationSchema } from '../schema/create-game.schema'
import TextAreaInput from '@/app/components/inputs/text-area.input.vue'

const props = defineProps<{
  callback: (values: any) => Promise<void>
}>()

const loading = ref<boolean>(false)

const validateUtil = useFormUtil()
const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: object) => {
  loading.value = true
  await props.callback(values).finally(() => {
    loading.value = false
  })
})
</script>

<template>
  <Form @submit="onSubmit" :validation-schema="validationSchema" v-slot="{ meta, values }">
    <Layout>
      <template #name>
        <TextInput name="name" type="text" />
      </template>
      <template #cover>
        <FileInput name="cover" />
      </template>
      <template #release_date>
        <DateInput name="release_date" />
      </template>
      <template #description>
        <TextAreaInput name="description" :rows="7" />
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
