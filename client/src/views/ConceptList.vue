<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const questions = ref([])
const searchQuery = ref('')
const router = useRouter()
const isLoading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch('/api/questions/concept')
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
        item.title.toLowerCase().includes(q) || 
        item.content.toLowerCase().includes(q)
    )
})

const startQuiz = (id) => {
  router.push(`/concept/${id}`)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <div>
             <h1 class="text-3xl font-bold text-white tracking-tight">Concept Practice</h1>
             <p class="text-gray-400 mt-1">Master computer science fundamentals with interactive quizzes.</p>
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
                placeholder="Search concepts..."
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
        class="group bg-[#252526] rounded-xl p-6 shadow-sm border border-[#333] hover:shadow-md hover:border-teal-500/30 transition-all duration-200 cursor-pointer flex flex-col h-full relative overflow-hidden"
        @click="startQuiz(q.id)">
        
        <!-- Hover Decoration -->
        <div class="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 text-teal-500 transition-opacity">
            <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" /></svg>
        </div>

        <div class="flex items-start justify-between mb-4">
             <div class="w-10 h-10 rounded-lg bg-teal-900/30 text-teal-400 flex items-center justify-center font-bold text-lg">
                {{ q.id }}
             </div>
             <!-- Status Badge Placeholder (can be integrated later) -->
             <!-- <span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">Unsolved</span> -->
        </div>

        <h2 class="text-xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">{{ q.title }}</h2>
        <p class="text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">{{ q.content }}</p>
        
        <div class="pt-4 border-t border-[#333] flex items-center justify-between text-sm">
            <span class="text-gray-500">Multiple Choice</span>
            <span class="text-teal-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                Start 
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </span>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-if="!isLoading && filteredQuestions.length === 0" class="text-center py-20">
        <div class="w-16 h-16 bg-[#252526] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#333]">
            <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
         <h3 class="text-lg font-medium text-white">No concepts found</h3>
         <p class="text-gray-500 mt-1">Try adjusting your search query.</p>
    </div>
  </div>
</template>
