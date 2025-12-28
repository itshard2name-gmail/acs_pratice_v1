<script setup>
import { shallowRef } from 'vue'
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'c'
  },
  theme: {
    type: String,
    default: 'vs-dark'
  }
})

const emit = defineEmits(['update:modelValue'])

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
  minimap: {
    enabled: false
  },
  fontSize: 16
}

const handleMount = (editor) => {
  // editor instance available here
}

const handleChange = (val) => {
  emit('update:modelValue', val)
}
</script>

<template>
  <div class="h-full w-full border border-gray-700 rounded overflow-hidden">
    <VueMonacoEditor
      :value="modelValue"
      :language="language"
      :theme="theme"
      :options="MONACO_EDITOR_OPTIONS"
      @mount="handleMount"
      @change="handleChange"
      class="h-full"
    />
  </div>
</template>
