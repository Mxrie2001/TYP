import { useNavigate } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import { useState, useEffect } from 'react';
import { userExist } from '../InfoUserService';  // Importer la fonction pour vérifier l'existence de l'utilisateur
import './Menu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  // Importer FontAwesomeIcon
import { faUser, faHeart, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const MenuBar = () => {
    const navigate = useNavigate();
    const [userExists, setUserExists] = useState<boolean | null>(null);  // Etat pour savoir si l'utilisateur existe
    const [loading, setLoading] = useState<boolean>(false);  // Etat pour gérer le chargement

    // Vérifier si l'utilisateur existe dans DynamoDB
    const checkUserExistence = async (userID: string) => {
        setLoading(true);  // Mettre en chargement
        try {
            const exists = await userExist(userID);
            setUserExists(exists);  // Mettre à jour l'état avec la réponse
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'existence de l\'utilisateur:', error);
        } finally {
            setLoading(false);  // Fin du chargement
        }
    };

    // Ajouter un script externe avec useEffect
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://kit.fontawesome.com/f5d01d2599.js';
        script.async = true;
        document.body.appendChild(script);

        // Nettoyer le script au démontage
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <Authenticator>
            {({ signOut, user }) => {
                // Appeler la fonction dès que l'utilisateur est connecté
                if (user?.username && userExists === null) {
                    checkUserExistence(user.username);
                }

                return (
                    <div className="menu-bar">
                        <button className="menu-title" onClick={() => navigate('/')}>
                            <img src="logo2t.png" alt="Logo" className="menu-logo"/>
                            <h1>Paw'fect Match</h1>
                        </button>
                        <div className="menu-nav">
                            <button onClick={() => navigate('/match', {state: {userID: user?.username}})}>
                                <h1>My Matches</h1> <FontAwesomeIcon icon={faHeart}/>
                            </button>
                            {/* Vérification de l'état de chargement */}
                            {loading ? (
                                <div className="loading-message">Chargement...</div>
                            ) : (
                                // Vérification de l'existence de l'utilisateur avec un if classique
                                userExists === true ? (
                                    <button onClick={() => navigate('/my-account', {state: {userID: user?.username}})}>
                                        <h1>My profile</h1> <FontAwesomeIcon icon={faUser} />
                                    </button>
                                ) : userExists === false ? (
                                    <button
                                        onClick={() => navigate('/create-profile', {state: {userID: user?.username}})}>
                                        <h1>My profile</h1>  <FontAwesomeIcon icon={faUser}/>
                                    </button>
                                ) : (
                                    <div className="error-message">Erreur lors de la vérification de l'utilisateur.</div> // En cas d'erreur
                                )
                            )}

                            <button onClick={signOut}><h1>Log out</h1> <FontAwesomeIcon icon={faSignOutAlt} /></button>
                        </div>
                    </div>
                );
            }}
        </Authenticator>
    );
};

export default MenuBar;
