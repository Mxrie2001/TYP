import React from 'react';
import { useUser } from './UserContext';

const MyAccount: React.FC = () => {
    const { user } = useUser();

    if (!user) {
        return <p>Vous devez être connecté pour accéder à cette page.</p>;
    }

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Bienvenue sur votre compte, {user.firstname} {user.name}!</h1>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>Image: {user.image}</p>
        </div>
    );
};

export default MyAccount;