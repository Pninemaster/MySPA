<template>
  <div class="recipe-view">
    <h2>🍽 Recipe Finder</h2>

    <div class="search-box">
      <input
        v-model="search"
        @keyup.enter="fetchRecipes"
        placeholder="Search for a meal..."
      />
      <button @click="fetchRecipes">Search</button>
      <button class="favorites-btn" @click="showFavoritesPanel = true">
        Favorited Recipes ❤️
      </button>
    </div>

    <!-- Favorites Panel -->
    <div
        v-if="showFavoritesPanel"
        class="favorites-panel-overlay"
        @click.self="showFavoritesPanel = false"
    >
        <div class="favorites-panel">
            <!-- Header -->
            <div class="favorites-header">
                <h3>Your Favorited Recipes ❤️</h3>
                <input
                    v-model="favoriteSearch"
                    placeholder="Search favorites..."
                    class="favorite-search"
                />
                <button class="close-panel" @click="showFavoritesPanel = false">✖</button>
            </div>

            <!-- Favorites Grid -->
            <div v-if="filteredFavorites.length === 0" class="empty">
                No recipes found.
            </div>
            <div class="recipe-grid">
                <div
                    v-for="meal in filteredFavorites"
                    :key="meal.idMeal"
                    class="recipe-card"
                >
                    <img :src="meal.strMealThumb" :alt="meal.strMeal" />
                    <h3>{{ meal.strMeal }}</h3>
                    <button @click="showDetails(meal)">View Details</button>
                    <button class="unfavorite" @click="removeFavorite(meal.idMeal)">
                        Remove Favorite
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Search Results -->
    <div class="recipe-grid">
      <div v-for="meal in meals" :key="meal.idMeal" class="recipe-card">
        <img :src="meal.strMealThumb" :alt="meal.strMeal" />
        <h3>{{ meal.strMeal }}</h3>
        <button @click="showDetails(meal)">View Details</button>
        <button
          class="favorite"
          @click="addFavorite(meal)"
          :disabled="isFavorited(meal.idMeal)"
        >
          {{ isFavorited(meal.idMeal) ? "Favorited" : "Favorite" }}
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="selectedMeal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>{{ selectedMeal.strMeal }}</h2>
        <img :src="selectedMeal.strMealThumb" :alt="selectedMeal.strMeal" />
        <h4>Ingredients</h4>
        <ul>
          <li v-for="(ingredient, i) in ingredients" :key="i">
            {{ ingredient }}
          </li>
        </ul>
        <h4>Instructions</h4>
        <p>{{ selectedMeal.strInstructions }}</p>
        <button @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";

const search = ref("");
const meals = ref([]);
const selectedMeal = ref(null);

// Favorites
const favorites = ref([]);
const showFavoritesPanel = ref(false);
const favoriteSearch = ref("");

// Load favorites from localStorage
onMounted(() => {
  const saved = localStorage.getItem("favorite-recipes");
  if (saved) favorites.value = JSON.parse(saved);
});

// Save favorites to localStorage
watch(
  favorites,
  (newVal) => {
    localStorage.setItem("favorite-recipes", JSON.stringify(newVal));
  },
  { deep: true }
);

// Fetch recipes from API
const fetchRecipes = async () => {
  if (!search.value) return;
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${search.value}`
  );
  const data = await res.json();
  meals.value = data.meals || [];
};

// Modal
const showDetails = (meal) => (selectedMeal.value = meal);
const closeModal = () => (selectedMeal.value = null);

// Compute ingredients
const ingredients = computed(() => {
  if (!selectedMeal.value) return [];
  const ing = [];
  for (let i = 1; i <= 20; i++) {
    const item = selectedMeal.value[`strIngredient${i}`];
    const measure = selectedMeal.value[`strMeasure${i}`];
    if (item && item.trim()) ing.push(`${item} - ${measure}`);
  }
  return ing;
});

// Favorites functions
const isFavorited = (id) => favorites.value.some((f) => f.idMeal === id);
const addFavorite = (meal) => {
  if (!isFavorited(meal.idMeal)) favorites.value.push(meal);
};
const removeFavorite = (id) => {
  favorites.value = favorites.value.filter((f) => f.idMeal !== id);
};

// Filter favorites by search
const filteredFavorites = computed(() => {
  if (!favoriteSearch.value) return favorites.value;
  return favorites.value.filter((f) =>
    f.strMeal.toLowerCase().includes(favoriteSearch.value.toLowerCase())
  );
});
</script>

<style scoped>
.recipe-view {
  text-align: center;
  padding: 20px;
}
.search-box {
  margin-bottom: 20px;
}
button {
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  margin: 2px;
}
button:hover {
  background: #2980b9;
}
button.favorite[disabled] {
  background: #2ecc71;
  cursor: default;
}
button.unfavorite {
  background: #e74c3c;
}
button.unfavorite:hover {
  background: #c0392b;
}
button.favorites-btn {
  background: #f39c12;
}
button.favorites-btn:hover {
  background: #d68910;
}

/* Favorites Panel */
.favorites-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.favorites-panel {
  background: white;
  border-radius: 10px;
  padding: 10px 20px 20px 20px;
  width: 90%;
  max-width: 700px;
  text-align: center;
  max-height: 80vh;
  overflow-y: auto;
}

/* Header with search and close */
.favorites-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
  margin-bottom: 15px;
  background: white;          /* Needed for sticky header background */
  position: sticky;           /* Make it sticky */
  top: 0;                     /* Stick to top of scroll container */
  z-index: 10;                /* Keep above recipe cards */
  padding: 10px 0;            /* Optional padding inside header */
  border-bottom: 1px solid #ddd; /* Optional bottom border */
  border-top-left-radius: 12px;   /* Rounded top-left corner */
  border-top-right-radius: 12px;  /* Rounded top-right corner */
}
.favorites-header h3 {
  flex: 1 1 200px;
  margin: 0;
  text-align: left;
}
.favorite-search {
  flex: 2 1 250px;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.close-panel {
  flex: 0 0 auto;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
}
.close-panel:hover {
  background: #c0392b;
}

/* Recipe grid */
.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
.recipe-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
  transition: transform 0.2s;
}
.recipe-card:hover {
  transform: scale(1.03);
}
.recipe-card img {
  width: 100%;
  border-radius: 8px;
}
.recipe-card h3 {
  margin: 8px 0;
  font-size: 16px;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}
.modal {
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 600px;
  text-align: left;
  overflow-y: auto;
  max-height: 80vh;
}
.modal img {
  width: 100%;
  border-radius: 10px;
  margin-bottom: 10px;
}
.empty {
  font-style: italic;
  color: #555;
  margin: 10px 0;
}
</style>
