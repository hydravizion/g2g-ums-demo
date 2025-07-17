import { createWebHistory } from 'vue-router'
import { createRouter } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import EditUser from '../views/EditUser.vue'
import AddUser from '../views/AddUser.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      component: Dashboard,
      name: 'DashBoard',
    },
    {
      path: '/add-user',
      component: AddUser,
      name: 'AddUser',
    },
    {
      path: '/edit-user/:id',
      component: EditUser,
      name: 'EditUser',
    },
  ],
  linkActiveClass: 'active-link',
  linkExactActiveClass: 'exact-active-link',

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

export default router
