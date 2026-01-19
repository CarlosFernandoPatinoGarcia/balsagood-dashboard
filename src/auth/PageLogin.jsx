import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/AuthService';
import '../App.css';
import FormIP from '../components/FormIP';
import Icons from '../components/Icons';

const PageLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await authService.login(username, password);
            navigate('/dashboard');
            window.location.reload();
        } catch (error) {
            alert('Credenciales inválidas');
            console.error('Login Error:', error);
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
                alert(`Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
            } else {
                alert('Error de conexión o servidor no disponible');
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <button
                        className="btn-icon"
                        onClick={() => setModalVisible(true)}
                        title="Configuración de Conexión"
                    >
                        <Icons.Network />
                    </button>
                </div>

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

            {/* Modal de Configuración */}
            {modalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content p-0 overflow-hidden">
                        <FormIP onClose={() => {
                            setModalVisible(false);
                            window.location.reload();
                        }} />
                        <div className="text-right p-2" style={{ textAlign: 'right', padding: '10px' }}>
                            <button
                                className="text-gray-500 hover:text-gray-700 text-sm"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
                                onClick={() => setModalVisible(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PageLogin;