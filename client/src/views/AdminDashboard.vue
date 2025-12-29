<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (path) => {
    router.push(path)
}
</script>

<template>
    <div class="min-h-screen bg-[#1A1A1A] py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p class="text-gray-400 mb-10">Manage content, users, and settings from one central hub.</p>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <!-- Concept Bank Card -->
                <div @click="navigateTo('/admin/concept')" 
                     class="group bg-[#252526] p-6 rounded-xl border border-[#333] hover:border-teal-500/50 hover:bg-[#2a2a2b] transition-all cursor-pointer shadow-lg hover:shadow-teal-900/10">
                    <div class="flex items-center gap-4 mb-4">
                        <div class="p-3 bg-teal-900/30 rounded-lg text-teal-400 group-hover:scale-110 transition-transform">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                        </div>
                        <h2 class="text-xl font-bold text-white group-hover:text-teal-400 transition-colors">Concept Bank</h2>
                    </div>
                    <p class="text-gray-400 text-sm mb-4">Manage multiple choice questions, quizzes, and concept explanations.</p>
                    <div class="flex items-center text-teal-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                        <span>Enter Module</span>
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </div>
                </div>

                <!-- Coding Problems Card -->
                <div @click="navigateTo('/admin/problem')" 
                     class="group bg-[#252526] p-6 rounded-xl border border-[#333] hover:border-purple-500/50 hover:bg-[#2a2a2b] transition-all cursor-pointer shadow-lg hover:shadow-purple-900/10">
                    <div class="flex items-center gap-4 mb-4">
                        <div class="p-3 bg-purple-900/30 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                        </div>
                        <h2 class="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">Coding Problems</h2>
                    </div>
                    <p class="text-gray-400 text-sm mb-4">Create and edit programming challenges, test cases, and difficulty levels.</p>
                    <div class="flex items-center text-purple-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                        <span>Enter Module</span>
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </div>
                </div>

                <!-- Mock Exams (Future) -->
                <div class="group bg-[#252526] p-6 rounded-xl border border-[#333] opacity-60 cursor-not-allowed relative overflow-hidden">
                    <div class="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                        <span class="bg-[#333] text-gray-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Coming Soon</span>
                    </div>
                     <div class="flex items-center gap-4 mb-4 blur-[1px]">
                        <div class="p-3 bg-blue-900/30 rounded-lg text-blue-400">
                           <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h2 class="text-xl font-bold text-white">Mock Exams</h2>
                    </div>
                    <p class="text-gray-400 text-sm blur-[1px]">Configure exam simulations, setting time limits and problem sets.</p>
                </div>

                <!-- Users (Future) -->
                 <div class="group bg-[#252526] p-6 rounded-xl border border-[#333] opacity-60 cursor-not-allowed relative overflow-hidden">
                    <div class="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                        <span class="bg-[#333] text-gray-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Coming Soon</span>
                    </div>
                     <div class="flex items-center gap-4 mb-4 blur-[1px]">
                        <div class="p-3 bg-orange-900/30 rounded-lg text-orange-400">
                           <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        </div>
                        <h2 class="text-xl font-bold text-white">User Management</h2>
                    </div>
                    <p class="text-gray-400 text-sm blur-[1px]">Manage students, teachers, and system administrators.</p>
                </div>

            </div>
        </div>
    </div>
</template>
