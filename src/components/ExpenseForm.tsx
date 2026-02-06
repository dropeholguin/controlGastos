import { useEffect, useState, startTransition, type FocusEvent } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import type { DraftExpense, Value } from "../types";
import { categories } from "../data/categories";
import { DatePicker } from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";

export default function ExpenseForm() {
    const [expense, setExpense] = useState<DraftExpense>({
        name: '',
        amount: 0,
        category: '',
        date: new Date()
    });

    const [error, setError] = useState('');
    const [previousAmount, setPreviousAmount] = useState(0);
    const { dispatch, state, remainingBudget } = useBudget()

    useEffect(() => {
        // Only update if editingId actually changed
        if (state.editingId) {
            const expense = state.expenses.find((expense) => expense.id === state.editingId)
            startTransition(() => {
                setExpense(expense!)
                setPreviousAmount(expense!.amount);
            })
        }
    }, [state.editingId, state.expenses])

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setExpense({
            ...expense,
            [name]: name === 'amount' ? +value : value
        });
    };

    const handleDate = (date: Value) => {
        setExpense({
            ...expense,
            date
        });
    };

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (Object.values(expense).includes('') || expense.amount === 0) {
            setError('Todos los campos son requeridos');
            return;
        }

        if ((expense.amount - previousAmount) > remainingBudget) {
            setError('El gasto no puede ser mayor al presupuesto disponible');
            return;
        }

        // Update or add expense
        if (state.editingId) {
            dispatch({ type: 'update-expense', payload: { expense: { ...expense, id: state.editingId } } })
        } else {
            dispatch({ type: 'add-expense', payload: { expense } })
        }

        // Reset the form
        setExpense({
            name: '',
            amount: 0,
            category: '',
            date: new Date()
        });
        setPreviousAmount(0);
    };

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
        if(e.target.value === '0') {
            e.target.value = '';
        }
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
                {state.editingId ? 'Editar Gasto' : 'Nuevo Gasto'}
            </legend>

            {error && <ErrorMessage> {error} </ErrorMessage>}

            <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-xl">
                    Nombre del Gasto
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Añade el nombre del gasto"
                    className="bg-slate-100 p-2"
                    value={expense.name}
                    onChange={handleChange}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="amount" className="text-xl">
                    Cantidad
                </label>
                <input
                    type="number"
                    id="amount"
                    name="amount"
                    placeholder="Añade la cantidad del gasto: ej. 300"
                    className="bg-slate-100 p-2"
                    value={expense.amount}
                    onChange={handleChange}
                    onFocus={handleFocus}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="category" className="text-xl">
                    Categoría
                </label>
                <select
                    id="category"
                    name="category"
                    className="bg-slate-100 p-2"
                    value={expense.category}
                    onChange={handleChange}
                >
                    <option value="">-- Selecciona una categoría --</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="date" className="text-xl">
                    Fecha del Gasto
                </label>
                <DatePicker
                    className="bg-slate-100 p-2 border-0"
                    value={expense.date}
                    onChange={handleDate}
                />
            </div>

            <input
                type="submit"
                value={state.editingId ? 'Guardar Cambios' : 'Registrar Gasto'}
                className="bg-blue-600 cursor-pointer w-full p-2 text-white font-bold uppercase rounded-lg"
            />
        </form>
    );
}
