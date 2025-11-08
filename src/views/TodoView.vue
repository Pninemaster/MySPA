<template>
  <div>
    <h2>To-Do List</h2>
    <input v-model="newTask" @keyup.enter="addTask" placeholder="Add new task" />
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <input type="checkbox" v-model="todo.done" @change="store.toggleTodo(todo.id)" />
        <span :class="{ done: todo.done }">{{ todo.task }}</span>
        <button @click="store.removeTodo(todo.id)">Remove</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTodoStore } from '../stores/todoStore'

const store = useTodoStore()
const newTask = ref('')

const addTask = () => {
  if (newTask.value.trim()) {
    store.addTodo(newTask.value)
    newTask.value = ''
  }
}

const todos = store.todos
</script>

<style>
.done { text-decoration: line-through; }
</style>
