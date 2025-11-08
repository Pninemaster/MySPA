import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useRecipeStore = defineStore('recipe', () => {
  const recipes = ref([])
  const loading = ref(false)
  const error = ref(null)

  const searchRecipes = async (query) => {
    if (!query) return
    loading.value = true
    error.value = null
    try {
      const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
      recipes.value = res.data.meals || []
    } catch (err) {
      error.value = 'Failed to fetch recipes'
      recipes.value = []
    } finally {
      loading.value = false
    }
  }

  return { recipes, loading, error, searchRecipes }
})
