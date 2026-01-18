import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/AuthService';
import '../App.css';

const PageRegister = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await authService.register(username, password);
            navigate('/login');
            window.location.reload();
        } catch (error) {
            alert('Error en registro: ' + (error.response?.data || error.message));
            console.log(error);
            console.log(error.response.data);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Registro</h2>
                <form className="auth-form" onSubmit={handleRegister}>
                    <input
                        className="auth-input"
                        type="text"
                        placeholder="Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="auth-input"
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="auth-btn" type="submit">Registrarse</button>
                </form>
                <div className="auth-link">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                </div>
            </div>
        </div>
    );
};

export default PageRegister;