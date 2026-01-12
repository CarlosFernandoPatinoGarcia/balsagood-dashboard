import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { configureApi } from '../api/Api'; // Asegúrate de importar configureApi
import '../App.css'; // Importa los estilos globales

const MenuButton = ({ title, onClick, icon, disabled }) => (
    <div
        className={`card menu-card ${disabled ? 'disabled' : ''}`}
        onClick={!disabled ? onClick : undefined}
    >
        <div className="card-body">
            <span className="menu-icon">{icon}</span>
            <span className="menu-title">{title}</span>
        </div>
    </div>
);

const PageMainView = () => {
    const navigate = useNavigate();
    const [modalVisible, setModalVisible] = useState(false);
    const [ipAddress, setIpAddress] = useState('');

    useEffect(() => {
        const savedIp = localStorage.getItem('API_IP');
        if (savedIp) setIpAddress(savedIp);
    }, []);

    const handleSaveSettings = () => {
        if (!ipAddress) return alert('Ingrese una IP válida');

        // Usamos la función configureApi que creamos en el paso anterior
        configureApi(ipAddress);

        setModalVisible(false);
        alert('Configuración guardada. La página se recargará.');
        window.location.reload(); // Recargar para asegurar que la nueva IP se use en todo lado
    };

    return (
        <div className="dashboard-container">
            {/* Header Principal */}
            <div className="dashboard-header">
                <div>
                    <h1 className="header-title">Panel Supervisor</h1>
                    <p className="header-subtitle">Seleccione una opción</p>
                </div>
                <button
                    className="btn-icon"
                    onClick={() => setModalVisible(true)}
                    title="Configuración"
                >
                    ⚙️
                </button>
            </div>

            {/* Menú Principal (Grid) */}
            <div className="grid-container">
                {/* Desactivado temporalmente */}
                <MenuButton
                    title="Inventario de Bloques (Carga)"
                    icon="🌲"
                    onClick={() => alert("Próximamente")}
                    disabled={true}
                />

                <MenuButton
                    title="Tabla Stock Bloques"
                    icon="📊"
                    onClick={() => navigate('/inventario-bloques')}
                />

                {/* Desactivado temporalmente */}
                <MenuButton
                    title="Tabla Stock Pallets"
                    icon="📋"
                    onClick={() => alert("Próximamente")}
                    disabled={true}
                />

                <MenuButton
                    title="Dashboard Pallets (Vivo)"
                    icon="📈"
                    onClick={() => navigate('/inventario-pallets')}
                />
            </div>

            {/* Modal de Configuración (Overlay Web) */}
            {modalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">Conexión al Servidor</h2>

                        <div className="form-group">
                            <label>Dirección IP:</label>
                            <input
                                type="text"
                                className="form-input"
                                value={ipAddress}
                                onChange={(e) => setIpAddress(e.target.value)}
                                placeholder="Ej. 192.168.X.X"
                            />
                            <small>Puerto por defecto: 8080</small>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="btn-cancel"
                                onClick={() => setModalVisible(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn-save"
                                onClick={handleSaveSettings}
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PageMainView;