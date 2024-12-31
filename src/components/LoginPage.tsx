import React, { useState } from 'react';
import { loginUser, registerUser } from './userService.tsx';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const { setUser } = useUser();
    const navigate = useNavigate(); // Hook pour la navigation
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [firstname, setFirstName] = useState('');
    const [image, setImage] = useState('');
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const resetFields = () => {
        setEmail('');
        setPassword('');
        setName('');
        setFirstName('');
        setImage('');
        setRole('');
    };

    const handleLogin = async () => {
        setLoading(true);
        setMessage('');
        try {
            const user = await loginUser(email, password);
            setUser({ ID: user.ID, name: user.name, firstname: user.firstname, email: user.email, image: user.image, role: user.role });
            setMessage(`Bienvenue, ${user.name}!`);
            navigate('/account'); // Redirection vers "My Account"
        } catch (error: any) {
            setMessage(`Erreur de connexion: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        setLoading(true);
        setMessage('');
        try {
            await registerUser(email, password, name, firstname, image, role);
            setMessage('Inscription réussie! Vous pouvez maintenant vous connecter.');
            resetFields();
            setIsRegister(false);
        } catch (error: any) {
            setMessage(`Erreur d'inscription: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
            <h1>{isRegister ? 'Inscription' : 'Connexion'}</h1>
            {message && <p style={{ color: message.includes('Erreur') ? 'red' : 'green' }}>{message}</p>}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    isRegister ? handleRegister() : handleLogin();
                }}
            >
                {isRegister && (
                    <>
                        <div>
                            <label>
                                Nom:
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Prénom:
                                <input
                                    type="text"
                                    value={firstname}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Image:
                                <input
                                    type="text"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Rôle:
                                <input
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                            </label>
                        </div>
                    </>
                )}
                <div>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Mot de passe:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Chargement...' : isRegister ? "S'inscrire" : 'Se connecter'}
                    </button>
                </div>
            </form>
            <button onClick={() => setIsRegister(!isRegister)} style={{ marginTop: '10px' }}>
                {isRegister ? 'Déjà inscrit ? Connectez-vous' : "Pas encore inscrit ? S'inscrire"}
            </button>
        </div>
    );
};

export default LoginPage;