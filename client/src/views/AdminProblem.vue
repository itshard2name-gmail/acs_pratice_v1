<script setup>
import { ref } from 'vue'

const form = ref({
  title: '',
  description: '',
  time_limit: 1000,
  memory_limit: 256,
  test_cases: [
    { input: '', output: '', is_sample: true },
    { input: '', output: '', is_sample: false }
  ]
})

const submitting = ref(false)
const generating = ref(false)
const message = ref('')
const generateTopic = ref('')
const showGenModal = ref(false)

const addTestCase = () => {
  form.value.test_cases.push({ input: '', output: '', is_sample: false })
}

const removeTestCase = (index) => {
  form.value.test_cases.splice(index, 1)
}

const openGenModal = () => {
  showGenModal.value = true
  generateTopic.value = ''
}

const generateProblem = async () => {
    if (!generateTopic.value) return
    generating.value = true
    try {
        const res = await fetch('/api/ai/generate-implementation', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}` 
            },
            body: JSON.stringify({ topic: generateTopic.value })
        })
        
        if (!res.ok) {
           const errData = await res.json().catch(() => ({}))
           throw new Error(errData.error || res.statusText)
        }

        const data = await res.json()
        
        // Auto-fill form
        form.value.title = data.title
        form.value.description = data.description
        if (data.test_cases) {
            form.value.test_cases = data.test_cases
        }
        showGenModal.value = false
        message.value = 'AI generated a coding problem for you!'
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
    const res = await fetch('/api/questions/implementation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    if (res.ok) {
      message.value = 'Problem created successfully!'
      // Reset form but keep defaults
      form.value = {
        title: '',
        description: '',
        time_limit: 1000,
        memory_limit: 256,
        test_cases: [
            { input: '', output: '', is_sample: true }
        ]
      }
    } else {
      message.value = 'Error creating problem'
    }
  } catch (e) {
    message.value = 'Network error'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto bg-white rounded-lg shadow relative">
    <div class="flex justify-between items-center mb-6">
       <h1 class="text-2xl font-bold">Create Coding Problem</h1>
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
            <h3 class="font-bold text-lg mb-2">Generate Problem with AI</h3>
            <p class="text-sm text-gray-600 mb-4">Enter a topic (e.g. "Dynamic Programming", "Graph DFS") and AI will draft a problem.</p>
            <input v-model="generateTopic" placeholder="e.g. Fibonacci Sequence" class="w-full border p-2 rounded mb-4" @keyup.enter="generateProblem" />
            <div class="flex justify-end gap-2">
                <button @click="showGenModal = false" class="text-gray-500 px-3 py-1 hover:bg-gray-100 rounded">Cancel</button>
                <button 
                  @click="generateProblem" 
                  :disabled="generating"
                  class="bg-purple-600 text-white px-4 py-1 rounded font-bold hover:bg-purple-700 disabled:opacity-50">
                  {{ generating ? 'Generating...' : 'Generate' }}
                </button>
            </div>
        </div>
    </div>
    
    <div class="space-y-6">
      <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Title</label>
            <input v-model="form.title" class="w-full border p-2 rounded" type="text" placeholder="e.g. Sum of Array">
          </div>
          <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-sm font-medium mb-1">Time (ms)</label>
                <input v-model="form.time_limit" class="w-full border p-2 rounded" type="number">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Memory (MB)</label>
                <input v-model="form.memory_limit" class="w-full border p-2 rounded" type="number">
              </div>
          </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-1">Description (Markdown)</label>
        <textarea v-model="form.description" class="w-full border p-2 rounded font-mono text-sm" rows="10" placeholder="# Problem Description..."></textarea>
      </div>
      
      <div>
        <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium">Test Cases</label>
            <button @click="addTestCase" class="text-sm text-blue-600 hover:underline">+ Add Case</button>
        </div>
        
        <div v-for="(tc, idx) in form.test_cases" :key="idx" class="border p-4 rounded mb-2 bg-gray-50 relative">
          <button @click="removeTestCase(idx)" class="absolute top-2 right-2 text-red-500 text-xs hover:underline" v-if="form.test_cases.length > 1">Remove</button>
          
          <div class="flex items-center gap-2 mb-2">
              <span class="font-bold text-gray-400">#{{ idx + 1 }}</span>
              <label class="flex items-center gap-1 text-sm cursor-pointer">
                  <input type="checkbox" v-model="tc.is_sample">
                  <span>Is Sample Case?</span>
              </label>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
              <div>
                  <label class="text-xs text-gray-500 uppercase">Input</label>
                  <textarea v-model="tc.input" class="w-full border p-1 rounded font-mono text-xs" rows="3"></textarea>
              </div>
              <div>
                  <label class="text-xs text-gray-500 uppercase">Output</label>
                  <textarea v-model="tc.output" class="w-full border p-1 rounded font-mono text-xs" rows="3"></textarea>
              </div>
          </div>
        </div>
      </div>
      
      <div v-if="message" :class="message.includes('Error') ? 'text-red-600' : 'text-green-600'">
        {{ message }}
      </div>
      
      <div class="flex gap-4">
          <button 
            @click="submit" 
            :disabled="submitting"
            class="bg-blue-600 text-white px-8 py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50">
            {{ submitting ? 'Saving...' : 'Create Problem' }}
          </button>
           <router-link to="/problem" class="text-gray-600 py-2">Cancel</router-link>
      </div>
    </div>
  </div>
</template>
