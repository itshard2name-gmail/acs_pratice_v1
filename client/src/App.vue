```html
<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useRouter, useRoute } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-[#1A1A1A] flex flex-col font-sans text-gray-100">
    <nav 
      class="transition-colors duration-300 w-full z-50 border-b border-white/10"
      :class="[
        route.path === '/' 
          ? 'absolute top-0 left-0 bg-transparent border-transparent' 
          : 'bg-[#1A1A1A] shadow-sm'
      ]"
      v-show="!route.path.startsWith('/exam')"
    >
      <div :class="[
        (route.path.startsWith('/problem/') && route.path.length > 9) 
          ? 'w-full' 
          : 'max-w-7xl mx-auto',
        'px-4 sm:px-6 lg:px-8'
      ]">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="flex items-center group mr-8">
                <span 
                  class="font-bold text-xl tracking-tight text-white group-hover:text-teal-400 transition-colors"
                >APCS Practice</span>
              </router-link>
              <div class="hidden md:flex ml-2 space-x-8">
                <router-link to="/concept" 
                  class="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-300 hover:text-white hover:bg-white/10"
                  active-class="bg-white/10 text-white"
                >Concept Quiz</router-link>
                <router-link to="/problem" 
                  class="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-300 hover:text-white hover:bg-white/10"
                  active-class="bg-white/10 text-white"
                >Coding Problems</router-link>
                <router-link to="/exam" class="bg-indigo-600 hover:bg-indigo-700 text-white ml-4 px-3 py-2 rounded-md text-sm font-medium shadow-sm">Start Mock Exam</router-link>
                <router-link v-if="auth.user && auth.user.role === 'admin'" to="/admin" 
                  class="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-300 hover:text-white hover:bg-white/10"
                  active-class="bg-white/10 text-white"
                >Admin Portal</router-link>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-4">
             <template v-if="auth.user">
                <router-link to="/profile" 
                  class="text-sm mr-2 text-gray-300 hover:text-white"
                >Hi, {{ auth.user.email }}</router-link>
                <button @click="logout" 
                  class="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-400 hover:text-red-400"
                >Logout</button>
             </template>
             <template v-else>
                <router-link to="/login" 
                  class="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-300 hover:text-white hover:bg-white/10"
                >Login</router-link>
                <router-link to="/register" class="bg-[#00B8A3] hover:bg-[#00a08e] text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Sign Up</router-link>
             </template>
          </div>
        </div>
      </div>
    </nav>
    <main :class="(route.path === '/' || route.path.startsWith('/problem/') || route.path.startsWith('/exam') || route.path === '/login' || route.path === '/register') ? 'p-0 w-full' : 'py-10'">
      <RouterView />
    </main>
  </div>
</template>
