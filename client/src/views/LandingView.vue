<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="landing-page font-sans text-gray-900 bg-white min-h-screen overflow-x-hidden">
    <!-- Hero Section -->
    <div class="hero-section relative w-full pt-16 pb-32 lg:pt-24 lg:pb-40">
      <!-- Split Background -->
      <div class="absolute inset-0 z-0 bg-[#1A1A1A] hero-bg-clip"></div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
        <!-- Text Content -->
        <div class="w-full lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
                A New Way to <span class="text-teal-400">Master APCS</span>
            </h1>
            <p class="mt-4 text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 mb-10">
                The comprehensive platform to enhance your skills, learn core concepts, and prepare for the APCS exam with confidence.
            </p>
            <div class="flex justify-center lg:justify-start space-x-4">
                <RouterLink to="/register" class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-full text-white bg-[#00B8A3] hover:bg-[#00a08e] md:py-4 md:text-lg transition duration-150 ease-in-out">
                    Create Account
                    <svg class="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                </RouterLink>
                <RouterLink to="/concept" class="inline-flex items-center justify-center px-8 py-3 border border-gray-600 text-base font-semibold rounded-full text-gray-200 hover:bg-white/10 md:py-4 md:text-lg transition duration-150 ease-in-out">
                    Explore Concepts
                </RouterLink>
            </div>
        </div>

        <!-- 3D Hero Visual -->
        <div class="w-full lg:w-1/2 flex justify-center lg:justify-end pers-container relative">
            <div class="isometric-dashboard bg-white w-full max-w-lg rounded-xl shadow-2xl p-4 overflow-hidden transform transition-transform hover:-translate-y-2 duration-500">
                <!-- Fake UI Header -->
                <div class="flex items-center space-x-2 mb-4 border-b border-gray-100 pb-2">
                    <div class="w-3 h-3 rounded-full bg-red-400"></div>
                    <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div class="w-3 h-3 rounded-full bg-green-400"></div>
                    <div class="flex-1"></div>
                    <div class="w-20 h-2 bg-gray-100 rounded-full"></div>
                </div>
                <!-- Fake UI Content -->
                <div class="grid grid-cols-3 gap-3 mb-4">
                    <div class="h-20 bg-blue-50 rounded-lg col-span-1"></div>
                    <div class="h-20 bg-orange-50 rounded-lg col-span-1"></div>
                    <div class="h-20 bg-green-50 rounded-lg col-span-1"></div>
                </div>
                 <div class="space-y-3">
                    <div class="h-8 bg-gray-50 rounded w-3/4"></div>
                    <div class="h-8 bg-gray-50 rounded w-full"></div>
                    <div class="h-8 bg-gray-50 rounded w-5/6"></div>
                    <div class="h-8 bg-gray-50 rounded w-full"></div>
                </div>
                <!-- Floating Elements (Optional decorative) -->
                <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-teal-100 rounded-full blur-2xl opacity-50 z-[-1]"></div>
            </div>
        </div>
      </div>
    </div>

    <!-- Features Section Placeholder -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-20 relative z-20">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900">Everything needed to excel</h2>
            <p class="mt-4 text-gray-500">Structured learning paths to guide your programming journey.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white p-8 rounded-2xl shadow-soft hover:shadow-lg transition-shadow duration-300 border border-gray-50">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                    <span class="text-2xl">📝</span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Concept Quizzes</h3>
                <p class="text-gray-500">Master the fundamentals with our extensive bank of multiple-choice questions.</p>
            </div>
            <div class="bg-white p-8 rounded-2xl shadow-soft hover:shadow-lg transition-shadow duration-300 border border-gray-50">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                    <span class="text-2xl">💻</span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Online Judge</h3>
                <p class="text-gray-500">Practice coding problems in C++, Python, and Java with real-time feedback.</p>
            </div>
            <div class="bg-white p-8 rounded-2xl shadow-soft hover:shadow-lg transition-shadow duration-300 border border-gray-50">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                    <span class="text-2xl">⚡</span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Mock Exams</h3>
                <p class="text-gray-500">Simulate the real exam environment with timed tests and automated scoring.</p>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.hero-bg-clip {
    clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
}

.pers-container {
    perspective: 1000px;
}

.isometric-dashboard {
    transform: rotateY(-10deg) rotateX(5deg);
    box-shadow: 20px 20px 60px -15px rgba(0, 0, 0, 0.3);
}

.shadow-soft {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}
</style>
