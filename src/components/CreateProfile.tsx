import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { registerUserInDynamoDB } from '../InfoUserService';
import "./Page.css"

interface LocationState {
    userID: string;
}

const CreateProfile: React.FC = () => {
    const location = useLocation();
    const userID = (location.state as LocationState)?.userID; // Récupération de l'ID utilisateur à partir de l'état

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (!userID) {
            alert('Impossible de récupérer l’ID utilisateur. Veuillez réessayer.');
            navigate('/'); // Si l'ID est manquant, on redirige vers la page d'accueil
        }
    }, [userID, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userID) {
            alert('Impossible de récupérer l’ID utilisateur. Veuillez réessayer.');
            return;
        }

        try {
            // Appeler InfoUserService pour enregistrer les données
            await registerUserInDynamoDB(userID, formData);

            console.log('Profil créé avec succès');
            navigate('/'); // Redirige vers la page principale après le succès
        } catch (error) {
            console.error('Erreur lors de la création de votre profil :', error);
            alert('Une erreur est survenue lors de la création de votre profil.');
        }
    };

    return (
        <div className="PageContent">
            <h1 className="Title">My Profile</h1>
            <p>New to this platform? Fill out your profile and let Paw'match find your perfect match!</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <img src="comeOn.png" alt="Come on!" className="pp"/>
                    <div className="InputRegister">
                        <div>
                            <label htmlFor="firstname"><strong>First Name :</strong></label>
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="lastname"><strong>Last Name :</strong></label>
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email"><strong>Email :</strong></label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                </div>
                <div className="BtnEdit">
                    <button type="submit">Save</button>
                </div>
            </form>
        </div>
    );
};

export default CreateProfile;
