import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useTodoStore = defineStore('todo', () => {
  const todos = ref([])

  // Load from localStorage on store initialization
  const saved = localStorage.getItem('todos')
  if (saved) todos.value = JSON.parse(saved)

  // Watch todos and save to localStorage
  watch(todos, (newVal) => {
    localStorage.setItem('todos', JSON.stringify(newVal))
  }, { deep: true })

  // Add a new todo
  const addTodo = (task) => {
    todos.value.push({
      id: Date.now(),
      task: task.trim(),
      done: false
    })
  }

  // Remove a todo by id
  const removeTodo = (id) => {
    const index = todos.value.findIndex(t => t.id === id)
    if (index !== -1) todos.value.splice(index, 1)
  }

  // Toggle todo done state
  const toggleTodo = (id) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) todo.done = !todo.done
  }

  return { todos, addTodo, removeTodo, toggleTodo }
})
