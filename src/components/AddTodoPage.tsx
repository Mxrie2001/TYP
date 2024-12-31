import React, { useState } from "react";
import { createTodo } from './TodoService.tsx';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';

const AddTodoPage: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [deadline, setDeadline] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const userId = user?.ID
            await createTodo(title, content, 'New', userId, deadline, priority);
            setMessage('Todo added successfully!');
            setTitle('');
            setContent('');
            setDeadline('');
            setPriority('Medium');
            navigate('/todo');
        } catch (error: any) {
            setMessage(`Error adding todo: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Add ToDo</h1>
            <form onSubmit={handleAddTodo}>
                <div>
                    <label>
                        Title:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Content:
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Deadline:
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Priority:
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            required
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </label>
                </div>
                <button type="submit" disabled={loading}>Add Todo</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddTodoPage;
