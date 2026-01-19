import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/AuthService';
import '../App.css';
import FormIP from '../components/FormIP';
import Icons from '../components/Icons';

const PageRegister = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
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

            <div className="auth-card" style={{ position: "relative" }}>
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <button
                        className="btn-icon"
                        onClick={() => setModalVisible(true)}
                        title="Configuración de Conexión"
                    >
                        <Icons.Network />
                    </button>
                </div>
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

export default PageRegister;