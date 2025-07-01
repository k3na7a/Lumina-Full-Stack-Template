<script setup lang="ts">
import { ref } from 'vue'
import {
  ClassicEditor,
  Bold,
  Code,
  CodeBlock,
  Italic,
  Underline,
  BlockQuote,
  Essentials,
  Indent,
  IndentBlock,
  List,
  Mention,
  Paragraph,
  Undo,
  ShowBlocks,
  Strikethrough,
  Subscript,
  Superscript,
  EditorConfig,
  RemoveFormat,
  AutoLink,
  Link,
  SelectAll,
  Autoformat,
  Alignment
} from 'ckeditor5'

const config: EditorConfig = {
  plugins: [
    RemoveFormat,
    SelectAll,
    Underline,
    Code,
    CodeBlock,
    Bold,
    Essentials,
    Italic,
    Mention,
    Paragraph,
    Undo,
    List,
    BlockQuote,
    Indent,
    IndentBlock,
    ShowBlocks,
    Strikethrough,
    Subscript,
    Superscript,
    AutoLink,
    Link,
    Autoformat,
    Alignment
  ],
  placeholder: 'start typing here...',
  fontSize: {
    options: ['small', 'default', 'big', 'huge']
  },
  toolbar: {
    shouldNotGroupWhenFull: true,
    items: [
      'undo',
      'redo',
      '|',
      'showBlocks',
      'selectAll',
      '|',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'subscript',
      'superscript',
      '|',
      'link',
      'code',
      'codeBlock',
      '|',
      'alignment',
      '|',
      'bulletedList',
      'numberedList',
      '|',
      'outdent',
      'indent',
      'blockquote',
      '|',
      'removeFormat'
    ]
  }
}

const value = ref<string>('')
</script>

<template>
  <ckeditor v-model="value" :editor="ClassicEditor" :config />
</template>
