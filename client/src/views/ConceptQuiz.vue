<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const question = ref(null)
const selectedOption = ref(null)
const submitted = ref(false)

const isCorrect = computed(() => {
  if (!question.value) return false
  return selectedOption.value === question.value.answer_index
})

onMounted(async () => {
  const id = route.params.id
  try {
    const res = await fetch(`/api/questions/concept/${id}`)
    question.value = await res.json()
  } catch (e) {
    console.error(e)
  }
})

const submit = () => {
  submitted.value = true
}
</script>

<template>
  <div v-if="question" class="p-8 max-w-3xl mx-auto">
    <div class="bg-white p-8 rounded-xl shadow-lg">
      <h1 class="text-2xl font-bold mb-4">{{ question.title }}</h1>
      <p class="text-lg mb-4">{{ question.content }}</p>

      <pre v-if="question.code_snippet" 
        class="bg-gray-900 text-gray-100 p-4 rounded mb-6 overflow-x-auto font-mono text-sm">
{{ question.code_snippet }}
      </pre>

      <div class="space-y-3 mb-6">
        <button v-for="(opt, idx) in question.options" :key="idx"
          @click="!submitted && (selectedOption = idx)"
          :class="[
            'w-full text-left p-4 rounded border transition',
            selectedOption === idx ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50',
            submitted && idx === question.answer_index ? 'bg-green-100 border-green-500' : '',
            submitted && selectedOption === idx && idx !== question.answer_index ? 'bg-red-100 border-red-500' : ''
          ]"
          :disabled="submitted">
          <span class="font-bold mr-2">{{ String.fromCharCode(65 + idx) }}.</span> {{ opt }}
        </button>
      </div>

      <div v-if="!submitted">
        <button 
          @click="submit" 
          class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          :disabled="selectedOption === null">
          Submit Answer
        </button>
      </div>

      <div v-else class="mt-6 p-4 rounded bg-gray-50 border border-gray-200">
        <h3 class="font-bold text-lg mb-2" :class="isCorrect ? 'text-green-600' : 'text-red-600'">
          {{ isCorrect ? 'Correct!' : 'Incorrect' }}
        </h3>
        <p class="text-gray-700">{{ question.explanation }}</p>
        <router-link to="/concept" class="inline-block mt-4 text-blue-600 hover:underline">Back to List</router-link>
      </div>
    </div>
  </div>
  <div v-else class="text-center p-8">Loading...</div>
</template>
