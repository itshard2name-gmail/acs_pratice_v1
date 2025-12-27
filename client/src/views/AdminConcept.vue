<script setup>
import { ref } from 'vue'

const form = ref({
  title: '',
  content: '',
  code_snippet: '',
  options: ['', '', '', ''],
  answer_index: 0,
  explanation: ''
})

const submitting = ref(false)
const generating = ref(false)
const message = ref('')
const generateTopic = ref('')
const showGenModal = ref(false)

const openGenModal = () => {
  showGenModal.value = true
  generateTopic.value = ''
}

const generateQuestion = async () => {
    if (!generateTopic.value) return
    generating.value = true
    try {
        const res = await fetch('/api/ai/generate-question', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}` // assuming token is here or use auth store
            },
            body: JSON.stringify({ topic: generateTopic.value })
        })
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        
        // Auto-fill form
        form.value = data
        showGenModal.value = false
        message.value = 'AI generated a question for you!'
    } catch (e) {
        alert('AI Generation Failed: ' + e.message)
    } finally {
        generating.value = false
    }
}

const submit = async () => {
  submitting.value = true
  message.value = ''
  try {
    const res = await fetch('/api/questions/concept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    if (res.ok) {
      message.value = 'Question created successfully!'
      form.value = {
        title: '',
        content: '',
        code_snippet: '',
        options: ['', '', '', ''],
        answer_index: 0,
        explanation: ''
      }
    } else {
      message.value = 'Error creating question'
    }
  } catch (e) {
    message.value = 'Network error'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="p-8 max-w-2xl mx-auto bg-white rounded-lg shadow relative">
    <div class="flex justify-between items-center mb-6">
       <h1 class="text-2xl font-bold">Create Concept Question</h1>
       <button 
         @click="openGenModal"
         type="button"
         class="bg-purple-600 text-white px-3 py-1 rounded text-sm font-bold flex items-center gap-1 hover:bg-purple-700">
         <span>✨ AI Generate</span>
       </button>
    </div>

    <!-- AI Modal -->
    <div v-if="showGenModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded shadow-lg w-96">
            <h3 class="font-bold text-lg mb-2">Generate with AI</h3>
            <p class="text-sm text-gray-600 mb-4">Enter a topic (e.g. "Recursion", "Arrays") and AI will draft a question.</p>
            <input v-model="generateTopic" placeholder="e.g. Binary Search" class="w-full border p-2 rounded mb-4" @keyup.enter="generateQuestion" />
            <div class="flex justify-end gap-2">
                <button @click="showGenModal = false" class="text-gray-500 px-3 py-1 hover:bg-gray-100 rounded">Cancel</button>
                <button 
                  @click="generateQuestion" 
                  :disabled="generating"
                  class="bg-purple-600 text-white px-4 py-1 rounded font-bold hover:bg-purple-700 disabled:opacity-50">
                  {{ generating ? 'Generating...' : 'Generate' }}
                </button>
            </div>
        </div>
    </div>
    
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Title</label>
        <input v-model="form.title" class="w-full border p-2 rounded" type="text" placeholder="e.g. C Pointer Basics">
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-1">Content (Question Text)</label>
        <textarea v-model="form.content" class="w-full border p-2 rounded" rows="3"></textarea>
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-1">Code Snippet (Optional)</label>
        <textarea v-model="form.code_snippet" class="w-full border p-2 rounded font-mono text-sm bg-gray-50" rows="4"></textarea>
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-1">Options</label>
        <div v-for="(opt, idx) in form.options" :key="idx" class="flex gap-2 mb-2">
          <span class="font-bold w-6 pt-2">{{ String.fromCharCode(65 + idx) }}</span>
          <input v-model="form.options[idx]" class="w-full border p-2 rounded" type="text">
          <input type="radio" :value="idx" v-model="form.answer_index" name="answer">
        </div>
        <p class="text-xs text-gray-500">Select the radio button for the correct answer.</p>
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-1">Explanation</label>
        <textarea v-model="form.explanation" class="w-full border p-2 rounded" rows="2"></textarea>
      </div>
      
      <div v-if="message" :class="message.includes('Error') ? 'text-red-600' : 'text-green-600'">
        {{ message }}
      </div>
      
      <button 
        @click="submit" 
        :disabled="submitting"
        class="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50">
        {{ submitting ? 'Saving...' : 'Create Question' }}
      </button>
       <router-link to="/concept" class="ml-4 text-gray-600">Cancel</router-link>
    </div>
  </div>
</template>
