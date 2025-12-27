<script setup>
import { useAuthStore } from '../stores/auth'
import { ref, onMounted, computed } from 'vue'

import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Doughnut, Bar } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const auth = useAuthStore()
const submissions = ref([])
const stats = ref(null)

const statusData = computed(() => {
    if (!stats.value) return null
    return {
        labels: stats.value.statusDistribution.map(s => s.status),
        datasets: [{
            backgroundColor: ['#4ade80', '#f87171', '#fbbf24', '#a8a29e'],
            data: stats.value.statusDistribution.map(s => s.count)
        }]
    }
})

const languageData = computed(() => {
    if (!stats.value) return null
    return {
        labels: stats.value.languageUsage.map(s => s.language),
        datasets: [{
            label: 'Submissions by Language',
            backgroundColor: '#60a5fa',
            data: stats.value.languageUsage.map(s => s.count)
        }]
    }
})

onMounted(async () => {
    if (auth.token) {
        try {
            // Stats
            const statsRes = await fetch('/api/analytics/stats', {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            })
            stats.value = await statsRes.json()

            // Submissions (Real) - We need an endpoint for this, assuming /api/auth/me/history or similar. 
            // For now, let's just stick to the mock or add a quick history endpoint if we want to be thorough.
            // Let's rely on the mock for history list as per Phase 5 status, but Charts will be real.
            // Actually, let's try to fetch real history if we can.
            // I'll add a quick history fetch here if I have the endpoint, otherwise I'll keep the mock logic for list but Real for charts.
        } catch (e) {
            console.error(e)
        }
    }
})
</script>

<template>
  <div class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
    <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">Personal details and progress.</p>
      </div>
      <div class="border-t border-gray-200">
        <dl>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Email address</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ auth.user?.email }}</dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Role</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 uppercase tracking-wide text-xs font-bold text-blue-600">{{ auth.user?.role }}</dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- Analytics Charts -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8" v-if="stats">
        <div class="bg-white shadow rounded-lg p-6 flex flex-col items-center">
            <h3 class="text-lg font-bold mb-4">Submission Status</h3>
            <div class="w-64 h-64 relative">
                <Doughnut :data="statusData" :options="{ responsive: true, maintainAspectRatio: false }" />
            </div>
        </div>
        <div class="bg-white shadow rounded-lg p-6 flex flex-col items-center">
            <h3 class="text-lg font-bold mb-4">Language Usage</h3>
             <div class="w-full h-64 relative">
                <Bar :data="languageData" :options="{ responsive: true, maintainAspectRatio: false }" />
            </div>
        </div>
    </div>

    <!-- Submission History (Mock) -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Recent Submissions</h3>
      </div>
      <ul role="list" class="divide-y divide-gray-200">
        <li v-for="sub in submissions" :key="sub.id" class="px-4 py-4 sm:px-6 hover:bg-gray-50">
           <div class="flex items-center justify-between">
              <div class="flex flex-col">
                 <span class="text-sm font-medium text-blue-600 truncate">{{ sub.problem }}</span>
                 <span class="text-xs text-gray-500">{{ sub.language }} • {{ sub.date }}</span>
              </div>
              <div class="flex items-center">
                 <span 
                   class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                   :class="sub.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                   {{ sub.status }}
                 </span>
                 <span class="ml-4 text-xs text-gray-500">{{ sub.time }}</span>
              </div>
           </div>
        </li>
      </ul>
    </div>
  </div>
</template>
