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
  if (isCorrect.value) {
     // Optional: Trigger confetti or sound
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-64px)] bg-[#1A1A1A] py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
    <div v-if="question" class="w-full max-w-3xl">
      <!-- Breadcrumb / Back -->
      <router-link to="/concept" class="inline-flex items-center text-sm text-gray-500 hover:text-teal-600 mb-6 transition-colors">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Concepts
      </router-link>

      <div class="bg-[#252526] rounded-2xl shadow-xl overflow-hidden border border-[#333]">
        <!-- Progress / Header -->
        <div class="bg-[#1e1e1e] px-8 py-6 flex justify-between items-center border-b border-[#333]">
             <span class="text-gray-400 font-mono text-sm uppercase tracking-wider">Question #{{ question.id }}</span>
             <span class="bg-[#2d2d2d] text-teal-400 text-xs px-2 py-1 rounded font-bold uppercase border border-[#333]">Concept Quiz</span>
        </div>

        <div class="p-8 sm:p-10">
           <!-- Question Title -->
           <h1 class="text-2xl sm:text-3xl font-bold text-white mb-6 leading-tight">{{ question.title }}</h1>
           
           <!-- Main Content -->
           <div class="prose max-w-none text-gray-300 mb-8 text-lg">{{ question.content }}</div>

           <!-- Code Snippet -->
           <div v-if="question.code_snippet" class="relative group mb-10">
               <div class="absolute -inset-2 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-lg opacity-20 blur group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
               <pre class="relative bg-[#1e1e1e] text-gray-100 p-6 rounded-lg overflow-x-auto font-mono text-sm leading-relaxed shadow-inner border border-gray-800">{{ question.code_snippet }}</pre>
           </div>
           
           <!-- Options -->
           <div class="space-y-4 mb-10">
              <button v-for="(opt, idx) in question.options" :key="idx"
                @click="!submitted && (selectedOption = idx)"
                :class="[
                  'w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-center group',
                  selectedOption === idx && !submitted ? 'border-teal-500 bg-teal-900/20 ring-2 ring-teal-500/20' : 'border-[#333] hover:border-teal-500/50 hover:bg-[#2d2d2d]',
                  submitted && idx === question.answer_index ? 'bg-green-900/20 border-green-500 ring-2 ring-green-500/20' : '',
                  submitted && selectedOption === idx && idx !== question.answer_index ? 'bg-red-900/20 border-red-500 ring-2 ring-red-500/20' : '',
                  submitted && idx !== question.answer_index && selectedOption !== idx ? 'opacity-50 grayscale' : ''
                ]"
                :disabled="submitted">
                
                <span :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 transition-colors',
                    selectedOption === idx || (submitted && idx === question.answer_index) ? 'bg-white text-gray-900 shadow-sm' : 'bg-[#333] text-gray-400 group-hover:bg-teal-900/50 group-hover:text-teal-400'
                ]">{{ String.fromCharCode(65 + idx) }}</span>
                
                <span :class="['text-lg font-medium', selectedOption === idx ? 'text-white' : 'text-gray-300']">{{ opt }}</span>

                <!-- Status Icons -->
                <div v-if="submitted" class="ml-auto">
                    <svg v-if="idx === question.answer_index" class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    <svg v-if="selectedOption === idx && idx !== question.answer_index" class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </div>
              </button>
           </div>

           <!-- Actions -->
           <div v-if="!submitted" class="flex justify-end">
              <button 
                @click="submit" 
                class="px-10 py-4 bg-teal-600 text-white rounded-full font-bold text-lg hover:bg-teal-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="selectedOption === null">
                Check Answer
              </button>
           </div>

           <!-- Explanation Card -->
           <div v-else class="rounded-xl overflow-hidden border border-[#333]">
               <div :class="['px-6 py-4 font-bold text-lg flex items-center', isCorrect ? 'bg-green-900/30 text-green-400 border-b border-green-900/50' : 'bg-red-900/30 text-red-400 border-b border-red-900/50']">
                   <span class="text-2xl mr-2">{{ isCorrect ? '🎉' : '🤔' }}</span>
                   {{ isCorrect ? 'Excellent! That is correct.' : 'Not quite right.' }}
               </div>
               <div class="p-6 bg-[#2d2d2d] text-gray-300 leading-relaxed border-t border-[#333]">
                   <h4 class="font-bold text-white mb-2 uppercase text-xs tracking-wider">Explanation</h4>
                   {{ question.explanation }}
               </div>
               <div class="px-6 py-4 bg-[#1e1e1e] border-t border-[#333] flex justify-between items-center">
                   <span class="text-sm text-gray-500">Practice makes perfect!</span>
                   <router-link to="/concept" class="text-teal-400 font-bold hover:underline">Try another question &rarr;</router-link>
               </div>
           </div>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-else class="flex flex-col items-center justify-center h-64">
        <div class="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
        <span class="text-gray-500">Loading Question...</span>
    </div>
  </div>
</template>

<style scoped>
.text-shadow {
    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
</style>
