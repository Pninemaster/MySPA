<template>
  <div>
    <nav>
      <router-link to="/todo">To-Do</router-link>
      <router-link to="/budget">Budget</router-link>
      <router-link to="/recipe">Recipe</router-link>
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
</style>
