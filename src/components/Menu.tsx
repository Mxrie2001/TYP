import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';
import '../Menu.css';

const Menu: React.FC = () => {
    const { user } = useUser();

    return (
        <nav>
            <h3>
                <Link to="/">Home</Link>
            </h3>

            {!user ? (
                <h3><Link to="/login"> Sign in </Link></h3>
                ) : (
                    <>
                    <h3><Link to="/todo">ToDo</Link></h3>
                    <h3><Link to="/account">My account</Link></h3>
                    <h3><Link to="/logout">Logout</Link></h3>
                    </>

                )}
        </nav>
    );
};

export default Menu;