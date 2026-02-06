import { createContext, type Dispatch } from "react"
import type { BudgetActions, BudgetState } from "../reducers/budget-recuder"

type BudgetContextProps = {
  state: BudgetState
  dispatch: Dispatch<BudgetActions>
  totalExpenses: number
  remainingBudget: number
}

export const BudgetContext = createContext<BudgetContextProps>(null!)
