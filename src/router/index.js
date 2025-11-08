import { createRouter, createWebHistory } from 'vue-router'
import TodoView from '../views/TodoView.vue'
import BudgetView from '../views/BudgetView.vue'
import RecipeView from '../views/RecipeView.vue'

const routes = [
  { path: '/', redirect: '/todo' },
  { path: '/todo', component: TodoView },
  { path: '/budget', component: BudgetView },
  { path: '/recipe', component: RecipeView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
