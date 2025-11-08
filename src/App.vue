<template>
  <div>
    <nav class="navbar">
      <router-link
        to="/todo"
        class="nav-link"
        :class="{ active: isActive('/todo') }"
      >
        To-Do
      </router-link>
      <router-link
        to="/budget"
        class="nav-link"
        :class="{ active: isActive('/budget') }"
      >
        Budget
      </router-link>
      <router-link
        to="/recipe"
        class="nav-link"
        :class="{ active: isActive('/recipe') }"
      >
        Recipe
      </router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

// Determine which link is active
const isActive = (path) => route.path === path
</script>

<style scoped>
.navbar {
  display: flex;
  gap: 1.5rem;
  padding: 1rem 2rem;
  background-color: #3498db;
  color: white;
  font-weight: bold;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background 0.2s;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.4);
}
</style>
