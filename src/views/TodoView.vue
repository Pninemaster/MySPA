<template>
  <div class="todo-container">
    <h2>📝 To-Do List</h2>

    <!-- Input area -->
    <div class="add-task">
      <input
        v-model="newTask"
        @keyup.enter="addTask"
        placeholder="Add new task..."
      />
      <button @click="addTask">Add</button>
    </div>

    <!-- Tasks list -->
    <div v-if="todos.length === 0" class="empty">No tasks yet!</div>
    <div class="tasks-grid">
        <div
            v-for="todo in todos"
            :key="todo.id"
            class="task-card"
            :class="{ done: todo.done }"
            @click="toggleTodoCard(todo)"
        >
            <div class="task-left">
            <input
                type="checkbox"
                :checked="todo.done"
                @click.stop="store.toggleTodo(todo.id)"
            />
            <span>{{ todo.task }}</span>
            </div>
            <button class="remove-btn" @click.stop="store.removeTodo(todo.id)">
            Remove
            </button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTodoStore } from '../stores/todoStore'

const store = useTodoStore()
const newTask = ref('')

const toggleTodoCard = (todo) => {
  store.toggleTodo(todo.id)
}

const addTask = () => {
  if (newTask.value.trim()) {
    store.addTodo(newTask.value)
    newTask.value = ''
  }
}

const todos = store.todos
</script>

<style scoped>
.todo-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

/* Header */
h2 {
  text-align: center;
  margin-bottom: 20px;
}

/* Add task area */
.add-task {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.add-task input {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
}
.add-task button {
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  background-color: #3498db;
  color: white;
  font-weight: bold;
  cursor: pointer;
}
.add-task button:hover {
  background-color: #2980b9;
}

/* Tasks grid */
.tasks-grid {
  display: grid;
  gap: 10px;
}

/* Individual task card */
.task-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  padding: 10px 12px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.task-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.task-card input[type="checkbox"] {
  width: 16px;
  height: 16px;
}
.done {
  text-decoration: line-through;
  color: #999;
}

/* Remove button */
.remove-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 12px;
}
.remove-btn:hover {
  background-color: #c0392b;
}

/* Empty state */
.empty {
  text-align: center;
  color: #999;
  font-style: italic;
  margin-top: 20px;
}
</style>
