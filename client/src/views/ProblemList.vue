<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const questions = ref([])
const router = useRouter()

onMounted(async () => {
  try {
    const res = await fetch('/api/questions/implementation')
    questions.value = await res.json()
  } catch (e) {
    console.error(e)
  }
})

const startProblem = (id) => {
  router.push(`/problem/${id}`)
}
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Coding Problems</h1>
    <div class="grid gap-4">
      <div v-for="q in questions" :key="q.id" 
        class="bg-white p-6 rounded-lg shadow hover:shadow-md transition cursor-pointer border border-gray-100 flex justify-between items-center"
        @click="startProblem(q.id)">
        <div>
          <h2 class="text-xl font-semibold text-blue-600 mb-1">{{ q.title }}</h2>
          <p class="text-gray-500 text-sm">Time: {{ q.time_limit }}ms | Memory: {{ q.memory_limit }}MB</p>
        </div>
        <span class="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm">Solve &rarr;</span>
      </div>
    </div>
  </div>
</template>
