import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = { username, password };
        
        try {
            const response = await fetch(`http://3.86.198.216/api/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
    
            if (!response.ok) {
                if (response.status === 403) {
                    // Handle forbidden error specifically, e.g., incorrect credentials
                    alert('Login failed: Incorrect username or password.');
                    return; // Prevent further execution, avoiding redirection
                } else {
                    // Handle other types of errors generically
                    throw new Error('Network response was not ok');
                }
            }
    
            const data = await response.json();
            localStorage.setItem('token', data.token); // Store the session token
            setIsLoggedIn(true);
            console.log('Login response data:', data); // Log the entire data object
            if (data.token) {
                console.log('Token:', data.token); // Log the token if present
            } else {
                console.error('Token not found in response:', data);
            }
            navigate('/'); // Redirect to main page only after successful login
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={handleUsernameChange}
                    /> 
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;