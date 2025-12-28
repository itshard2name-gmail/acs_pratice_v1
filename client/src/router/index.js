import { createRouter, createWebHistory } from 'vue-router'
import ConceptList from '../views/ConceptList.vue'
import ConceptQuiz from '../views/ConceptQuiz.vue'
import AdminConcept from '../views/AdminConcept.vue'
import AdminProblem from '../views/AdminProblem.vue'
import ProblemList from '../views/ProblemList.vue'
import ProblemView from '../views/ProblemView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import UserProfile from '../views/UserProfile.vue'
import MockExamView from '../views/MockExamView.vue'



import LandingView from '../views/LandingView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Landing',
            component: LandingView
        },
        {
            path: '/concept',
            name: 'ConceptList',
            component: ConceptList
        },
        {
            path: '/concept/:id',
            name: 'ConceptQuiz',
            component: ConceptQuiz
        },
        {
            path: '/admin/concept',
            name: 'AdminConcept',
            component: AdminConcept
        },
        {
            path: '/problem',
            name: 'ProblemList',
            component: ProblemList
        },
        {
            path: '/problem/:id',
            name: 'ProblemView',
            component: ProblemView
        },
        {
            path: '/login',
            name: 'Login',
            component: LoginView
        },
        {
            path: '/register',
            name: 'Register',
            component: RegisterView
        },
        {
            path: '/profile',
            name: 'UserProfile',
            component: UserProfile
        },
        {
            path: '/exam',
            name: 'MockExam',
            component: MockExamView
        },

        {
            path: '/admin/problem',
            name: 'AdminProblem',
            component: AdminProblem
        },
    ]
})

export default router
