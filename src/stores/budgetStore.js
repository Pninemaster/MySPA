import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useBudgetStore = defineStore('budget', () => {
  const transactions = ref([]) // { id, type: 'income'|'expense', amount, description }

  // Load saved transactions on store initialization
  const loadTransactions = () => {
    const saved = localStorage.getItem('transactions')
    if (saved) transactions.value = JSON.parse(saved)
  }
  loadTransactions()

  // Watch for changes and save to localStorage
  watch(transactions, (newVal) => {
    localStorage.setItem('transactions', JSON.stringify(newVal))
  }, { deep: true })

  const addTransaction = (type, amount, description) => {
    if (!amount || isNaN(amount)) return
    transactions.value.push({
      id: Date.now(),
      type,
      amount: parseFloat(amount),
      description
    })
  }

  const removeTransaction = (id) => {
    const index = transactions.value.findIndex(t => t.id === id)
    if (index !== -1) transactions.value.splice(index, 1)
  }

  const totalIncome = computed(() => 
    transactions.value.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  )

  const totalExpense = computed(() => 
    transactions.value.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  )

  const balance = computed(() => totalIncome.value - totalExpense.value)

  return { transactions, addTransaction, removeTransaction, totalIncome, totalExpense, balance }
})
