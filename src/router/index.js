import { createRouter, createWebHistory } from 'vue-router'
import FieldDetail from '@/pages/field/[id].vue'


// Import các trang
import HomePage from '@/pages/HomePage.vue'
import BookingPage from '@/pages/BookingPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import AdminDashboard from '@/pages/admin/AdminDashboard.vue'

const routes = [
  { path: '/', component: HomePage, name: 'home' },
  { path: '/booking', component: BookingPage, name: 'booking' },
  { path: '/login', component: LoginPage, name: 'login' },
  { path: '/admin', component: AdminDashboard, name: 'admin' },
  { path: '/field/:id', component: FieldDetail, name: 'field-detail' },
  { path: ''}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
