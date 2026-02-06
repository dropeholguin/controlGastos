"use client"

import { useMemo, useReducer, type ReactNode } from "react"
import { budgetReducer, initialState } from "../reducers/budget-recuder"
import { BudgetContext } from "./BudgetContext"

type BudgetProviderProps = {
  children: ReactNode
}

export const BudgetProvider = ({ children }: BudgetProviderProps) => {
  const [state, dispatch] = useReducer(budgetReducer, initialState)
  const totalExpenses = useMemo(() => {
    return state.expenses.reduce((total, expense) => total + expense.amount, 0)
  }, [state.expenses])

  const remainingBudget = state.budget - totalExpenses

  return (
    <BudgetContext.Provider value={{ state, dispatch, totalExpenses, remainingBudget }}>
      {children}
    </BudgetContext.Provider>
  )
}
