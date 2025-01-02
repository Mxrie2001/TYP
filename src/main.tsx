import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports.ts';
import { InfoUserProvider } from './InfoUserContext';
import { PetProvider } from './PetContext'; // Import du PetProvider
import { TaskProvider } from './TaskContext'; // Import du TaskProvider

Amplify.configure(awsExports);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <InfoUserProvider>
            <PetProvider>
                <TaskProvider>
                    <App />
                </TaskProvider>
            </PetProvider>
        </InfoUserProvider>
    </React.StrictMode>
);
