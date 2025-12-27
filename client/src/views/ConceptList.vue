<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const questions = ref([])
const router = useRouter()

onMounted(async () => {
  try {
    const res = await fetch('/api/questions/concept')
    questions.value = await res.json()
  } catch (e) {
    console.error(e)
  }
})

const startQuiz = (id) => {
  router.push(`/concept/${id}`)
}
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Concept Practice</h1>
    <div class="grid gap-4">
      <div v-for="q in questions" :key="q.id" 
        class="bg-white p-6 rounded-lg shadow hover:shadow-md transition cursor-pointer border border-gray-100"
        @click="startQuiz(q.id)">
        <h2 class="text-xl font-semibold text-blue-600 mb-2">{{ q.title }}</h2>
        <p class="text-gray-600 truncate">{{ q.content }}</p>
      </div>
    </div>
  </div>
</template>
