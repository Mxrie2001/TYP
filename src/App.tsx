import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';
import { Authenticator } from '@aws-amplify/ui-react'; // Utiliser Authenticator pour gérer l'état de connexion
import CreateProfile from './components/CreateProfile.tsx';
import MyAccount from './components/MyAccount';
import EditProfile from './components/EditProfile.tsx';
import AddPet from './components/AddPet.tsx';
import EditPet from './components/EditPet.tsx';
import TodoList from './components/TodoList.tsx';
import CreateTask from './components/CreateTask.tsx';
import Match from './components/Match.tsx';
import MenuBar from './components/Menu.tsx';
import "./App.css"
import ChatMessages from "./components/CreateChat.tsx";

function App() {
    return (
        <div className="HomePage">
            <img src="logo2t.png" alt="Logo" className="menu-logo"/>
            <div>
                <h1>Welcome to Paw'fect Match!</h1>
                <p>Are you a lover of animals and looking to connect with someone special, make new friends, or simply
                    meet like-minded people? Look no further! With Paw'fect Match, you can fill out your profile, add
                    your beloved companions (pets), and link them to a to-do list. Based on this, we’ll match you with
                    others who share your passions, creating the perfect connections for you and your furry friends!</p>
            </div>

        </div>
    );
}

export default function RootApp() {
    return (
        <Router>
            <Authenticator>
                {({user}) => (
                    <div>
                        {user ? (
                            <>
                                {/* Si l'utilisateur est connecté, afficher le menu */}
                                <MenuBar/>
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
                                    <Route path="/chat" element={<ChatMessages />} />
                                </Routes>
                            </>
                        ) : (
                            <div>
                                {/* Si l'utilisateur n'est pas connecté, afficher un message ou la page de connexion */}
                                <h2>Veuillez vous connecter pour accéder à l'application.</h2>
                            </div>
                        )}
                    </div>
                )}
            </Authenticator>
        </Router>
    );
}
