import { v4 as uuidv4 } from 'uuid'
import type { Category, DraftExpense, Expense } from "../types"

export type BudgetActions =
  { type: 'add-budget', payload: { budget: number } } |
  { type: 'show-modal' } |
  { type: 'hide-modal' } |
  { type: 'add-expense', payload: { expense: DraftExpense } } |
  { type: 'delete-expense', payload: { id: Expense['id'] } } |
  { type: 'get-expense-by-id', payload: { id: Expense['id'] } } |
  { type: 'update-expense', payload: { expense: Expense } } |
  { type: 'reset-app' } |
  { type: 'filter-category', payload: { id: Category['id'] } }

export type BudgetState = {
  budget: number,
  modal: boolean,
  expenses: Expense[],
  editingId: Expense['id'],
  currentCategory: Category['id']
}

const initialBudget = () => {
  const localBudget = localStorage.getItem('budget')
  return localBudget ? +localBudget : 0
}

const initialExpenses = () => {
  const localExpenses = localStorage.getItem('expenses')
  return localExpenses ? JSON.parse(localExpenses) : []
}

export const initialState: BudgetState = {
  budget: initialBudget(),
  modal: false,
  expenses: initialExpenses(),
  editingId: '',
  currentCategory: ''
}

const createExpense = (expense: DraftExpense): Expense => {
  return {
    id: uuidv4(),
    ...expense
  }
}

export const budgetReducer = (state: BudgetState = initialState, action: BudgetActions) => {
  switch (action.type) {
    case 'add-budget':
      return {
        ...state,
        budget: action.payload.budget
      }
    case 'show-modal':
      return {
        ...state,
        modal: true
      }
    case 'hide-modal':
      return {
        ...state,
        modal: false,
        editingId: ''
      }
    case 'add-expense': {
      const newExpense = createExpense(action.payload.expense)
      return {
        ...state,
        expenses: [...state.expenses, newExpense],
        modal: false
      }
    }
    case 'delete-expense':
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense.id !== action.payload.id),
      }
    case 'get-expense-by-id':
      return {
        ...state,
        editingId: action.payload.id,
        modal: true
      }
    case 'update-expense':
      return {
        ...state,
        expenses: state.expenses.map((expense) => expense.id === action.payload.expense.id ? action.payload.expense : expense),
        modal: false,
        editingId: ''
      }
    case 'reset-app':
      return {
        ...initialState,
        budget: 0,
        expenses: []
      }
    case 'filter-category':
      return {
        ...state,
        currentCategory: action.payload.id
      }
    default:
      return state
  }
}