import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/AuthService';
import '../App.css';

const PageLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await authService.login(username, password);
            navigate('/dashboard');
            window.location.reload();
        } catch (error) {
            alert('Credenciales inválidas');
            console.log(error);
            console.log(error.response.data);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Iniciar Sesión</h2>
                <form className="auth-form" onSubmit={handleLogin}>
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
                    <button className="auth-btn" type="submit">Ingresar</button>
                </form>
                <div className="auth-link">
                    ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
                </div>
            </div>
        </div>
    );
};

export default PageLogin;