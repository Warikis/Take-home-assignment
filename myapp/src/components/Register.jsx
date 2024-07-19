import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  styles from './styles/Register.module.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        setErrorMessage(''); // Clear error message when user starts typing
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setErrorMessage(''); // Clear error message when user starts typing
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setErrorMessage(''); // Clear error message when user starts typing
    };

    const validateInput = () => {
        if (!email || !username || !password) {
            setErrorMessage('Please fill in all fields.');
            return false;
        }
        // Add any other validation logic here
        return true;
    };

    const [errors, setErrors] = useState({ username: '', password: '', email: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateInput()) return;

        const userData = { username, password, email };
        
        try {
            const response = await fetch(`${apiUrl}/api/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                const errorMessage = data.error || data.detail || 'Registration failed: An unknown error occurred.';
                setErrorMessage(errorMessage);
                setErrors({ username: '', password: '', email: '' });
                if (data.email) setErrors(prev => ({ ...prev, email: data.email.join(' ')}));
                if (data.password) setErrors(prev => ({ ...prev, password: data.password.join(' ')}));
                if (data.username) setErrors(prev => ({ ...prev, username: data.username.join(' ')}));    
                return; // Prevent further execution
            }
    
            console.log(data); // Handle success
            navigate('/login'); // Redirect to login page after successful registration
        } catch (error) {
            console.error('Registration failed', error);
            setErrorMessage('Registration failed: An error occurred.');
        }
    };

    return (
        <div>
        <h2>Register</h2>
        {errorMessage && <div className="error">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" value={username} onChange={handleUsernameChange} />
                {errors.username && <p className={`${styles.error}`}>{errors.username}</p>}
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={password} onChange={handlePasswordChange} />
                {errors.password && <p className={`${styles.error}`}>{errors.password}</p>}
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input type="text" id="email" value={email} onChange={handleEmailChange} />
                {errors.email && <p className={`${styles.error}`}>{errors.email}</p>}
            </div>
            <button type="submit">Register</button>
        </form>
    </div>
    );
};

export default Register;