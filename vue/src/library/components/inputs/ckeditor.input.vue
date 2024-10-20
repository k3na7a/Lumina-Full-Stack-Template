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

<style lang="scss">
@import '@/library/sass/variables/index';

:root {
  --ck-border-radius: none !important;
  --ck-color-base-foreground: transparent !important;
  --ck-color-base-error: var(--danger) !important;
  --ck-color-button-cancel: var(--danger) !important;
  --ck-color-button-save: var(--success) !important;
  --ck-color-base-text: var(--light) !important;
  --ck-color-link-default: var(--primary) !important;
}

.text-small {
  font-size: $font-size-8 !important;
}

.text-big {
  font-size: $font-size-4 !important;
}

.ck-editor {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  * {
    border-radius: 0px !important;
  }
}

.ck-powered-by-balloon {
  display: none !important;
}

.ck-sticky-panel__content {
  pointer-events: none;
}

.ck.ck-toolbar.ck-toolbar_grouping {
  display: flex;
  gap: 0.5rem;
}

.ck-toolbar__items > *,
.ck-toolbar__grouped-dropdown > * {
  pointer-events: all;
}

.ck-balloon-panel {
  border-radius: 0rem !important;
  background-color: $backgroundAlt !important;
  box-shadow: $boxShadow !important;
  border: 0.1rem rgba(0, 0, 0, 0.176) solid !important;
  border-top: 0.2rem $info solid !important;
  padding: 1rem !important;

  * {
    font-family: $inter !important;
  }

  &:before,
  &:after {
    content: none !important;
  }

  .ck-responsive-form {
    margin: 0px !important;
    padding: 0px !important;

    * {
      font-size: $font-size-7 !important;
      line-height: $line-height-base !important;
    }

    .ck-labeled-field-view,
    .ck-link-actions__preview {
      margin: 0px !important;
      padding: 0px !important;
    }

    a.ck.ck-button {
      min-height: auto !important;
      display: flex !important;
      align-items: center;
      justify-content: center;
      border: none !important;
      box-shadow: none !important;
    }

    input {
      background-color: $backgroundAlt !important;
      color: $light !important;
      border-radius: 0px !important;
      box-shadow: none !important;
      border: 0.1rem $muted solid !important;
      padding: 0.5rem 1rem !important;
      font-size: $font-size-7 !important;
      font-weight: 400 !important;
      height: 3rem !important;
      transition: all 0.15s ease-in-out !important;

      &:hover {
        box-shadow: 0 0 0 0.1rem $muted !important;
      }

      &:focus {
        box-shadow: 0 0 0 0.1rem $info !important;
        border: 0.1rem solid $info !important;
      }

      &.ck-error {
        border: 0.1rem solid $danger !important;

        &:focus,
        &:hover {
          box-shadow: 0 0 0 0.1rem $danger !important;
        }
      }
    }

    .ck-labeled-field-view__status {
      font-size: $font-size-8 !important;
      line-height: $line-height-base !important;
    }

    label {
      display: none !important;
    }

    button {
      border: none !important;
      box-shadow: none !important;
      transition: background-color 0.15s ease-in-out !important;
      height: 3rem;

      &:hover {
        background-color: rgba(255, 255, 255, 0.05) !important;
        cursor: pointer;
      }

      &::after {
        content: none !important;
      }
    }
  }

  * {
    background-color: transparent !important;
  }
}

.ck-toolbar__items > .ck-button,
.ck-splitbutton > .ck-button,
.ck-dropdown > .ck-button {
  color: $light !important;
  min-width: 3rem !important;
  height: 3rem !important;
  margin: 0px !important;
  padding: 0px !important;

  transition: all 0.15s ease-in-out !important;
  box-shadow: none !important;
  border: none !important;
  background-color: transparent !important;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05) !important;
    cursor: pointer;
  }

  &.ck-on {
    background-color: rgba(255, 255, 255, 0.15) !important;
  }
}

.ck-toolbar__items {
  margin: 0px !important;

  .ck-dropdown > .ck-button {
    padding: 0.234rem 0.78rem !important;
  }
}

.ck-content {
  min-height: 15rem;
  border: none !important;
  background-color: $backgroundAlt !important;
  border: 0.1rem solid $muted !important;
  padding: 0.5rem 1rem !important;
  transition: all 0.15s ease-in-out !important;
  border-radius: 0px !important;

  &:hover {
    box-shadow: 0 0 0 0.1rem $muted !important;
  }

  &.ck-focused {
    box-shadow: 0 0 0 0.1rem $primary !important;
    border: 0.1rem solid $primary !important;
  }

  * {
    margin-block-start: 0.5rem !important;
    margin-block-end: 0.5rem !important;
  }

  pre {
    border-radius: 0px !important;
    color: $light;
    font-size: $font-size-7;
    padding: 0.5rem;
  }

  code {
    color: $light;
    font-family: monospace;
    font-size: 1em;
  }
}

.ck-toolbar__separator {
  margin: 0px !important;
  background-color: $secondary !important;
}

.ck-sticky-panel__content {
  border: none !important;
}
.ck-toolbar {
  background-color: transparent !important;
  padding: 0px !important;
}
.ck-toolbar__items {
  display: flex;
  gap: 0.5rem;
}
.ck-disabled {
  pointer-events: none !important;
}
.ck-dropdown {
  margin: 0px !important;
}
.ck-splitbutton {
  :after {
    content: none !important;
  }
}
.ck-tooltip {
  display: none !important;
}

.ck-dropdown:not(.ck-toolbar__grouped-dropdown) {
  .ck-toolbar__items {
    gap: 0rem !important;
  }
}

.ck-dropdown__panel {
  background-color: $backgroundAlt !important;
  border: 0.1rem solid $muted !important;
  box-shadow: $boxShadow !important;
  border-radius: 0rem !important;

  ul {
    padding: 0px !important;
  }

  .ck-list-item-button {
    background-color: inherit !important;
    box-shadow: none !important;
    border: none !important;
    font-size: $font-size-7 !important;
    padding: 0.5rem 1rem !important;
    color: $light !important;

    &:hover {
      background-color: $bg-hover !important;
      cursor: pointer;
    }

    &.ck-on {
      background-color: $bg-active !important;
      pointer-events: none;
    }
  }

  .ck-list-item-button__check-holder {
    display: none !important;
  }

  ul {
    background-color: inherit !important;
  }
}
</style>
