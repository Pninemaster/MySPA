<template>
  <div>
    <h2>Recipe Finder</h2>

    <input v-model="query" @keyup.enter="search" placeholder="Search recipes..." />
    <button @click="search">Search</button>

    <p v-if="store.loading">Loading...</p>
    <p v-if="store.error">{{ store.error }}</p>
    <p v-if="!store.loading && store.recipes.length === 0">No recipes found</p>

    <div class="recipes">
      <div class="card" v-for="recipe in store.recipes" :key="recipe.idMeal">
        <img :src="recipe.strMealThumb" :alt="recipe.strMeal" />
        <h3>{{ recipe.strMeal }}</h3>
        <p>Category: {{ recipe.strCategory }}</p>
        <a :href="recipe.strSource || '#' " target="_blank">View Recipe</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRecipeStore } from '../stores/recipeStore'

const store = useRecipeStore()
const query = ref('')

const search = () => {
  if (query.value.trim()) {
    store.searchRecipes(query.value)
  }
}
</script>

<style>
.recipes {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}
.card {
  width: 200px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.5rem;
  text-align: center;
}
.card img {
  width: 100%;
  border-radius: 8px;
}
</style>
