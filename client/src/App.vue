```html
<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <span class="font-bold text-xl tracking-tight text-blue-600 mr-8">APCS Practice</span>
              <div class="hidden md:flex ml-10 space-x-8">
                <router-link to="/concept" class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Concept Quiz</router-link>
                <router-link to="/problem" class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Coding Problems</router-link>
                <router-link to="/exam" class="bg-indigo-600 hover:bg-indigo-700 text-white ml-4 px-3 py-2 rounded-md text-sm font-medium shadow-sm">Start Mock Exam</router-link>
                <router-link v-if="auth.user && auth.user.role === 'admin'" to="/admin/concept" class="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Admin</router-link>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-4">
             <template v-if="auth.user">
                <router-link to="/profile" class="text-sm text-gray-700 hover:text-blue-600 mr-2">Hi, {{ auth.user.email }}</router-link>
                <button @click="logout" class="text-gray-500 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium">Logout</button>
             </template>
             <template v-else>
                <router-link to="/login" class="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium">Login</router-link>
                <router-link to="/register" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium">Sign Up</router-link>
             </template>
          </div>
        </div>
      </div>
    </nav>
    <main class="py-10">
      <RouterView />
    </main>
  </div>
</template>
