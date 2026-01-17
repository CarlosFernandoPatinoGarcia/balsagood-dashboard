
import React, { useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import api, { configureApi } from '../api/Api';
import FormIP from '../components/FormIP';

const PageVistaConfiguracion = () => {
    const navigate = useNavigate();
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <div className="dashboard-header">
            <div>
                <h1 className="header-title">Configuración de conexión</h1>
                <p className="header-subtitle">Introduzca la IP de la red</p>
            </div>
            <button
                className="btn-icon"
                onClick={() => setModalVisible(true)}
                title="Configuración"
            >
                ⚙️
            </button>

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


    );
};
export default PageVistaConfiguracion;
