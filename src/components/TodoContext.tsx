import React, { createContext, useContext, useState } from 'react';

interface Todo {
    ID: number;
    title: string;
    content: string;
    state: string;
    userID: number;
    deadline: string;
    dateCheck: string | null;
    priority: string;
}

interface TodoContextType {
    todos: Todo[];
    setTodos: (todos: Todo[]) => void;
    addTodo: (todo: Todo) => void;
    updateTodo: (id: number, updatedTodo: Partial<Todo>) => void;
    removeTodo: (id: number) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [todos, setTodos] = useState<Todo[]>([]);

    const addTodo = (todo: Todo) => {
        setTodos((prevTodos) => [...prevTodos, todo]);
    };

    const updateTodo = (id: number, updatedTodo: Partial<Todo>) => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) => (todo.ID === id ? { ...todo, ...updatedTodo } : todo))
        );
    };

    const removeTodo = (id: number) => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.ID !== id));
    };

    return (
        <TodoContext.Provider value={{ todos, setTodos, addTodo, updateTodo, removeTodo }}>
            {children}
        </TodoContext.Provider>
    );
};

export const useTodos = (): TodoContextType => {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('useTodos must be used within a TodoProvider');
    }
    return context;
};
