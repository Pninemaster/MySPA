<template>
  <div>
    <h2>To-Do List</h2>
    <input v-model="newTask" @keyup.enter="addTask" placeholder="Add new task" />

    <div class="actions">
      <button @click="markAllDone">Mark All Done</button>
      <button @click="clearCompleted">Clear Completed</button>
    </div>

    <ul>
      <li v-for="todo in store.todos" :key="todo.id">
        <!-- <input type="checkbox" v-model="todo.done" @change="store.toggleTodo(todo.id)" /> -->
        <input type="checkbox" v-model="todo.done" />
        <span
          v-if="editingId !== todo.id"
          :class="{ done: todo.done }"
          @dblclick="startEditing(todo.id)"
        >
          {{ todo.task }}
        </span>
        <input
          v-else
          v-model="editTask"
          @keyup.enter="saveEdit(todo.id)"
          @blur="saveEdit(todo.id)"
        />
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
const editingId = ref(null)
const editTask = ref('')

const addTask = () => {
  if (newTask.value.trim()) {
    store.addTodo(newTask.value)
    newTask.value = ''
  }
}

const startEditing = (id) => {
  editingId.value = id
  const todo = store.todos.find(t => t.id === id)
  editTask.value = todo ? todo.task : ''
}

const saveEdit = (id) => {
  const todo = store.todos.find(t => t.id === id)
  if (todo && editTask.value.trim()) todo.task = editTask.value.trim()
  editingId.value = null
}

const markAllDone = () => {
  store.todos.forEach(t => (t.done = true))
}

const clearCompleted = () => {
  store.todos.splice(0, store.todos.length, ...store.todos.filter(t => !t.done))
}
</script>

<style>
.done {
  text-decoration: line-through;
}
.actions {
  margin: 8px 0;
}
</style>
