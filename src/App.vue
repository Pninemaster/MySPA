<template>
  <div>
    <nav>
      <router-link to="/todo" :class="{ active: $route.path === '/todo' }">To-Do</router-link>
      <router-link to="/budget" :class="{ active: $route.path === '/budget' }">Budget</router-link>
      <router-link to="/recipe" :class="{ active: $route.path === '/recipe' }">Recipe</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style>
nav {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: #f5f5f5;
}
nav a.active {
  font-weight: bold;
  color: #2196F3;
}
@media (max-width: 600px) {
  nav { flex-direction: column; }
}
</style>
