
import Dashboard from "./pages/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
// src/App.tsx
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ToDo from "./components/To-do.tsx";
import LoginPage from './components/LoginPage';
import Menu from './components/Menu';
import { UserProvider } from './components/UserContext';
import Logout from './components/Logout';
import MyAccount from "./components/MyAccount.tsx";
import AddTodoPage from "./components/AddTodoPage.tsx";

const App: React.FC = () => {
    return (
        <UserProvider>
            <Router>
                <Menu />
                <div>
                  <Dashboard />
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/todo" element={<ToDo />} />
                        <Route path="/add-todo" element={<AddTodoPage />} />
                        <Route path="/" element={<h2>Bienvenue sur la page d'accueil</h2>} />
                        <Route path="/account" element={<MyAccount />} />
                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
};

export default App;
