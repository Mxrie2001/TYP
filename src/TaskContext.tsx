import React, { createContext, useContext, useState } from 'react';

export interface Task {
    TaskID: number;  // ID de type number
    PetID: string;
    UserID: string;
    Description: string;
    Completed: boolean;
    Categorie: string;
}



// Interface pour le contexte des tâches
interface TaskContextType {
    tasks: Task[];
    addTask: (task: Task) => void;
    toggleTaskCompletion: (taskID: string, completed: boolean) => void;
    deleteTask: (taskID: string) => void;
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>; // setState avec Dispatch
}

// Création du contexte
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Fournisseur du contexte
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    const addTask = (task: Task) => setTasks((prevTasks) => [...prevTasks, task]);

    const toggleTaskCompletion = (taskID: string, completed: boolean) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.TaskID === Number(taskID) ? { ...task, Completed: completed } : task
            )
        );
    };

    const deleteTask = (taskID: string) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.TaskID !== Number(taskID)));
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, toggleTaskCompletion, deleteTask, setTasks }}>
            {children}
        </TaskContext.Provider>
    );
};

// Hook personnalisé pour accéder au contexte
export const useTask = (): TaskContextType => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTask must be used within a TaskProvider');
    }
    return context;
};
