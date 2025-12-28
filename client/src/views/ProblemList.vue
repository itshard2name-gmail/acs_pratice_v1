<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const questions = ref([])
const searchQuery = ref('')
const router = useRouter()
const isLoading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch('/api/questions/implementation')
    questions.value = await res.json()
  } catch (e) {
    console.error(e)
  } finally {
      isLoading.value = false
  }
})

const filteredQuestions = computed(() => {
    if (!searchQuery.value) return questions.value
    const q = searchQuery.value.toLowerCase()
    return questions.value.filter(item => 
        item.title.toLowerCase().includes(q)
    )
})

const startProblem = (id) => {
  router.push(`/problem/${id}`)
}

const getDifficultyColor = (level) => {
    // 1-4 scale
    switch(level) {
        case 1: return 'bg-green-100 text-green-700'
        case 2: return 'bg-blue-100 text-blue-700'
        case 3: return 'bg-orange-100 text-orange-700'
        case 4: return 'bg-red-100 text-red-700'
        default: return 'bg-gray-100 text-gray-700'
    }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <div>
             <h1 class="text-3xl font-bold text-white tracking-tight">Coding Problems</h1>
             <p class="text-gray-400 mt-1">Practice algorithms and data structures with real-time feedback.</p>
        </div>
        <div class="relative w-full md:w-96">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
                </svg>
            </div>
            <input 
                v-model="searchQuery" 
                type="text" 
                class="block w-full pl-10 pr-3 py-2 border border-[#333] rounded-lg leading-5 bg-[#252526] text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm shadow-sm transition-shadow duration-200" 
                placeholder="Search problems..."
            />
        </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-[#252526] rounded-xl p-6 shadow-sm border border-[#333] animate-pulse h-40">
            <div class="h-4 bg-[#333] rounded w-1/3 mb-4"></div>
            <div class="h-2 bg-[#1e1e1e] rounded w-full mb-2"></div>
            <div class="h-2 bg-[#1e1e1e] rounded w-5/6"></div>
        </div>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="q in filteredQuestions" :key="q.id" 
        class="group bg-[#252526] rounded-xl p-6 shadow-sm border border-[#333] hover:shadow-md hover:border-teal-500/30 transition-all duration-200 cursor-pointer flex flex-col h-full relative"
        @click="startProblem(q.id)">
        
        <div class="flex items-start justify-between mb-4">
             <div class="w-10 h-10 rounded-lg bg-indigo-900/30 text-indigo-400 flex items-center justify-center font-bold text-lg">
                {{ q.id }}
             </div>
             <span class="px-2 py-1 rounded text-xs font-semibold" :class="getDifficultyColor(q.difficulty || 1)">
                Level {{ q.difficulty || 1 }}
             </span>
        </div>

        <h2 class="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{{ q.title }}</h2>
        
        <div class="mt-auto space-y-3">
             <div class="flex items-center space-x-4 text-sm text-gray-400">
                <div class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {{ q.time_limit }}ms
                </div>
                 <div class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    {{ q.memory_limit }}MB
                 </div>
             </div>

             <div class="pt-4 border-t border-[#333] flex items-center justify-between text-sm">
                <span class="text-gray-400">Implementation</span>
                <span class="text-indigo-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                    Solve 
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                </span>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
