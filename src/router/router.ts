import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import CategoryPage from '../views/CategoryPage.vue'
import RecipePage from '../views/RecipePage.vue'
import AddCategoryPage from '../views/AddCategoryPage.vue'
import AddRecipePage from '../views/AddRecipePage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home',
  },
  { path: '/home', name: 'Home', component: HomePage },
  {
    path: '/category/:id/:categoryName',
    name: 'CategoryDetails',
    component: CategoryPage,
    props: true,
  },
  { path: '/recipe/:id', name: 'RecipeDetails', component: RecipePage, props: true },
  { path: '/category', name: 'AddCategory', component: AddCategoryPage },
  { path: '/recipe', name: 'AddRecipe', component: AddRecipePage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
