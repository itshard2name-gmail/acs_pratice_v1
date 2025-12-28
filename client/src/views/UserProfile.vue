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
        labels: stats.value.statusDistribution_labels || stats.value.statusDistribution.map(s => s.status),
        datasets: [{
            backgroundColor: ['#10b981', '#ef4444', '#f59e0b', '#9ca3af'],
            data: stats.value.statusDistribution_data || stats.value.statusDistribution.map(s => s.count),
            borderWidth: 0
        }]
    }
})

const languageData = computed(() => {
    if (!stats.value) return null
    return {
        labels: stats.value.languageUsage_labels || stats.value.languageUsage.map(s => s.language),
        datasets: [{
            label: 'Submissions',
            backgroundColor: '#00B8A3',
            data: stats.value.languageUsage_data || stats.value.languageUsage.map(s => s.count),
            borderRadius: 6
        }]
    }
})

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: { usePointStyle: true, padding: 20, font: { family: 'Inter' }, color: '#9CA3AF' }
        }
    }
}

const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        y: { beginAtZero: true, grid: { borderDash: [2, 4], color: '#374151' }, ticks: { color: '#9CA3AF' } },
        x: { grid: { display: false }, ticks: { color: '#9CA3AF' } }
    }
}

onMounted(async () => {
    if (auth.token) {
        try {
            // Stats
            const statsRes = await fetch('/api/analytics/stats', {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            })
            stats.value = await statsRes.json()
            
            // Allow mock structure fallback for now if API returns different shape
            if (!stats.value.statusDistribution) {
                 stats.value = {
                     statusDistribution: [{ status: 'Accepted', count: 12 }, { status: 'Wrong Answer', count: 5 }, { status: 'TLE', count: 2 }, { status: 'Compile Error', count: 1 }],
                     languageUsage: [{ language: 'C++', count: 15 }, { language: 'Python', count: 5 }]
                 }
            }
        } catch (e) {
            console.error(e)
            // Mock data for UI dev
            stats.value = {
                 statusDistribution: [{ status: 'Accepted', count: 12 }, { status: 'Wrong Answer', count: 5 }, { status: 'TLE', count: 2 }, { status: 'Compile Error', count: 1 }],
                 languageUsage: [{ language: 'C++', count: 15 }, { language: 'Python', count: 5 }]
            }
            submissions.value = [
                { id: 1, problem: 'Two Sum', language: 'C++', status: 'Accepted', time: '12ms', date: '2023-10-25' },
                { id: 2, problem: 'Quick Sort', language: 'Python', status: 'TLE', time: '2000ms', date: '2023-10-24' },
                { id: 3, problem: 'Binary Search', language: 'C++', status: 'Accepted', time: '8ms', date: '2023-10-23' }
            ]
        }
    }
})
</script>

<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-10 flex items-center gap-6">
        <div class="h-20 w-20 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            {{ auth.user?.email?.[0].toUpperCase() || 'U' }}
        </div>
        <div>
            <h1 class="text-3xl font-bold text-white">{{ auth.user?.email }}</h1>
            <div class="flex items-center gap-3 mt-1 text-sm text-gray-400 font-medium">
                <span class="px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-400 border border-blue-900/50 uppercase tracking-wide text-xs">{{ auth.user?.role || 'STUDENT' }}</span>
                <span>Joined Dec 2023</span>
            </div>
        </div>
    </div>

    <!-- Analytics Charts -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10" v-if="stats">
        <div class="bg-[#252526] rounded-2xl p-8 shadow-sm border border-[#333] hover:shadow-md transition-shadow">
            <h3 class="text-lg font-bold mb-6 text-white flex items-center gap-2">
                <span class="w-2 h-6 bg-teal-500 rounded-full"></span>
                Submission Accuracy
            </h3>
            <div class="h-64 relative">
                <Doughnut :data="statusData" :options="chartOptions" />
            </div>
        </div>
        <div class="bg-[#252526] rounded-2xl p-8 shadow-sm border border-[#333] hover:shadow-md transition-shadow">
            <h3 class="text-lg font-bold mb-6 text-white flex items-center gap-2">
                 <span class="w-2 h-6 bg-blue-500 rounded-full"></span>
                 Language Preference
            </h3>
             <div class="h-64 relative">
                <Bar :data="languageData" :options="barOptions" />
            </div>
        </div>
    </div>

    <!-- Submission History -->
    <div class="bg-[#252526] shadow-sm border border-[#333] rounded-2xl overflow-hidden">
      <div class="px-6 py-5 border-b border-[#333] bg-[#2d2d2d] flex justify-between items-center">
        <h3 class="text-lg font-bold text-white">Recent Activity</h3>
        <button class="text-sm text-teal-400 font-medium hover:text-teal-300">View All</button>
      </div>
      
      <div v-if="submissions.length === 0" class="p-8 text-center text-gray-500">
          No submission history available.
      </div>
      
      <ul v-else role="list" class="divide-y divide-[#333]">
        <li v-for="sub in submissions" :key="sub.id" class="px-6 py-4 hover:bg-[#2d2d2d] transition-colors group">
           <div class="flex items-center justify-between">
              <div class="flex flex-col">
                 <span class="text-sm font-bold text-gray-200 group-hover:text-teal-400 transition-colors">{{ sub.problem }}</span>
                 <span class="text-xs text-gray-500 mt-1">{{ sub.language }} • {{ sub.date }}</span>
              </div>
              <div class="flex items-center gap-4">
                 <div class="text-right">
                     <span 
                       class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full"
                       :class="sub.status === 'Accepted' ? 'bg-green-900/30 text-green-400 border border-green-900/50' : 'bg-red-900/30 text-red-400 border border-red-900/50'">
                       {{ sub.status }}
                     </span>
                     <div class="text-xs text-gray-500 mt-1 text-right">{{ sub.time }}</div>
                 </div>
                 <svg class="w-4 h-4 text-gray-300 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </div>
           </div>
        </li>
      </ul>
    </div>
  </div>
</template>
