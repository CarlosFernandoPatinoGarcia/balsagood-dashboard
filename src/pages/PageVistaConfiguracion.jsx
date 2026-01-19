
import React, { useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import api, { configureApi } from '../api/Api';
import FormIP from '../components/FormIP';
import AuthService from '../services/AuthService';
import Icons from '../components/Icons';

const PageVistaConfiguracion = () => {
    const navigate = useNavigate();
    const [modalVisible, setModalVisible] = useState(false);

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
        window.location.reload();
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="header-title">Configuración de conexión</h1>
                    <p className="header-subtitle">Introduzca la IP de la red</p>
                </div>
                <div className="flex gap-2">
                    <button
                        className="btn-icon"
                        onClick={() => setModalVisible(true)}
                        title="Configuración"
                    >
                        <Icons.Network />
                    </button>
                </div>

                {/* Modal de Configuración (Overlay Web) */}
                {modalVisible && (
                    <div className="modal-overlay">
                        <div className="modal-content p-0 overflow-hidden">
                            <FormIP onClose={() => {
                                setModalVisible(false);
                                window.location.reload();
                            }} />
                            <div className="text-right p-2">
                                <button
                                    className="text-gray-500 hover:text-gray-700 text-sm"
                                    onClick={() => setModalVisible(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="dashboard-header">
                <div>
                    <h1 className="header-title">Cerrar Sesión</h1>

                </div>
                <div className="flex gap-2">
                    <button
                        className="btn-icon"
                        onClick={handleLogout}
                        title="Cerrar Sesión"
                    >
                        <Icons.Logout />
                    </button>
                </div>

            </div>
        </div>



    );
};
export default PageVistaConfiguracion;
