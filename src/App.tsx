import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import CreateProfile from './components/CreateProfile.tsx';
import MyAccount from './components/MyAccount';
import EditProfile from './components/EditProfile.tsx';
import AddPet from './components/AddPet.tsx';
import EditPet from './components/EditPet.tsx';
import TodoList from './components/TodoList.tsx';
import CreateTask from './components/CreateTask.tsx';
import Match from './components/Match.tsx';


function App() {
    const navigate = useNavigate();

    return (
        <Authenticator>
            {({ signOut, user }) => (
                <div>
                    <h1>Bienvenue, {user?.username}</h1>
                    <button onClick={signOut}>Se déconnecter</button>
                    {/* Vérifier que l'ID de l'utilisateur est bien transmis ici */}
                    <button
                        onClick={() =>
                            navigate('/create-profile', {state: {userID: user?.username}})
                        }
                    >
                        Compléter mon profil
                    </button>
                    {/* Ajouter un bouton pour accéder à la page "Mon Compte", en passant l'ID de l'utilisateur */}
                    <button onClick={() => navigate('/my-account', {state: {userID: user?.username}})}>
                        Mon Compte
                    </button>

                    <button onClick={() => navigate('/match', {state: {userID: user?.username}})}>
                        Mes Matches
                    </button>
                </div>
            )}
        </Authenticator>
    );
}

export default function RootApp() {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<App />} />
                <Route path="/create-profile" element={<CreateProfile />} />
                <Route path="/my-account" element={<MyAccount />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/add-pet" element={<AddPet />} />
                <Route path="/edit-pet" element={<EditPet />} />
                <Route path="/todo-list" element={<TodoList />} />
                <Route path="/create-task" element={<CreateTask />} />
                <Route path="/match" element={<Match />} />
            </Routes>
        </Router>
    );
}
