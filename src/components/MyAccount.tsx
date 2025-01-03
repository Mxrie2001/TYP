import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useInfoUser } from '../InfoUserContext';
import { usePet } from '../PetContext';
import { getUserInfo } from '../InfoUserService';
import { getPetsByUser } from '../PetService';
import "./Page.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faList, faPlus } from '@fortawesome/free-solid-svg-icons';

interface LocationState {
    userID: string;
}

const MyAccount: React.FC = () => {
    const { userInfo, setUserInfo } = useInfoUser();
    const { pets = [], setPets } = usePet();
    const location = useLocation();
    const navigate = useNavigate();
    const { userID } = location.state as LocationState;

    const [refresh, setRefresh] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserInfo(userID);
                if (userData) {
                    setUserInfo(userData);
                } else {
                    setError('Utilisateur non trouvé');
                }

                const petData = await getPetsByUser(userID);
                if (petData) {
                    setPets(petData);
                } else {
                    setError('Aucun compagnon trouvé pour cet utilisateur');
                }
            } catch (error) {
                console.error('Erreur lors du chargement des informations', error);
                setError('Erreur lors du chargement des informations');
            }
        };

        fetchUserData();
    }, [userID, refresh, setUserInfo, setPets]);

    const handleAddPet = () => {
        navigate('/add-pet', { state: { userID } });
        setRefresh(!refresh);
    };

    if (error) {
        return <div>Erreur : {error}</div>;
    }

    if (!userInfo) {
        return <div>Utilisateur non trouvé ou en cours de chargement...</div>;
    }

    if (pets === undefined) {
        return <div>Chargement des compagnons...</div>;
    }

    const getPetImage = (type: string): string => {
        switch (type.toLowerCase()) {
            case 'dog':
                return 'dog.png';
            case 'cat':
                return 'cat.png';
            case 'bird':
                return 'bird.png';
            case 'rabbit':
                return 'bunny.png';
            case 'racoon':
                return 'racoon.png';
            default:
                return 'newPet.jpg';
        }
    };

    return (
        <div className="PageContent">
            <h1 className="Title">My Profile</h1>
            {userInfo ? (
                <div className="Infos">
                    <div>
                        <h3>My Informations :</h3>
                        <div className="MyInfos">
                            <img src="profilepp.jpg" alt="Profile pp" className="pp" />
                            <div className="infoContent">
                                <p><strong>First Name :</strong> {userInfo.FirstName}</p>
                                <p><strong>Last Name :</strong> {userInfo.LastName}</p>
                                <p><strong>Email :</strong> {userInfo.Email}</p>
                            </div>
                        </div>
                        <div className="BtnEdit">
                            <button onClick={() => navigate('/edit-profile', { state: { userID: userInfo.UserID } })}>
                                <p>Edit</p> <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className="PetAdd">
                            <h3>Pet(s) Informations :</h3>
                            <button className="add" onClick={handleAddPet}>
                                <FontAwesomeIcon icon={faPlus}/>
                            </button>
                        </div>
                        {pets.length > 0 ? (
                            pets.map((pet) => (
                                <div key={pet.ID}>
                                <div className="PetInfos">
                                        <img src={getPetImage(pet.Type)} alt={pet.Type} className="pp"/>
                                        <div className="PetInfoContent">
                                            <p><strong>Name :</strong> {pet.Name}</p>
                                            <p><strong>Type :</strong> {pet.Type}</p>
                                            <p><strong>Age :</strong> {pet.Age} ans</p>
                                        </div>
                                    </div>


                                    {/*<button*/}
                                    {/*    onClick={() => {*/}
                                    {/*        if (userID && pet.ID) {*/}
                                    {/*            navigate('/edit-pet', { state: { userID, petID: pet.ID } });*/}
                                    {/*        } else {*/}
                                    {/*            alert("Impossible de récupérer l’ID du compagnon ou de l’utilisateur. Veuillez réessayer.");*/}
                                    {/*        }*/}
                                    {/*    }}*/}
                                    {/*>*/}
                                    {/*    Edit <FontAwesomeIcon icon={faPenToSquare} />*/}
                                    {/*</button>*/}
                                    <div className="BtnEdit">
                                        <button
                                            onClick={() => {
                                                if (userID && pet.ID) {
                                                    navigate('/todo-list', {state: {userID, petID: pet.ID}});
                                                } else {
                                                    alert("Impossible de récupérer l’ID du compagnon ou de l’utilisateur. Veuillez réessayer.");
                                                }
                                            }}
                                        >
                                            <p>To-Do List</p> <FontAwesomeIcon icon={faList}/>
                                        </button>
                                    </div>
                                </div>

                            ))
                        ) : (
                            <p>Vous n'avez pas encore ajouté de compagnon.</p>
                        )}


                    </div>
                </div>
            ) : (
                <p>Chargement...</p>
            )}
        </div>
    );
};

export default MyAccount;
