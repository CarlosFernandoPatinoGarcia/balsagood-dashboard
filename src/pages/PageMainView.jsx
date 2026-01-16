import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { configureApi } from '../api/Api';
import '../App.css';

const MenuButton = ({ title, onClick, icon }) => (
    <div className="card menu-card" onClick={onClick}>
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
        alert('Configuración guardada. Recargando la página.');
        window.location.reload(); // Recargar para asegurar que la nueva IP se use en todo lado
    };

    return (
        <div className="dashboard-container">
            {/* Header Principal */}
            <div className="welcome-hero">
                <h1 className="welcome-title">Bienvenido al Dashboard de BalsaGood</h1>
                <p className="welcome-desc">Gestión integral de inventarios, cámaras de secado y producción.</p>

                <div className="welcome-instructions">
                    Seleccione una opción del menú para comenzar
                </div>
            </div>


            {/* Menú Principal (Grid) */}
            <div className="grid-container">
                <MenuButton
                    title="Proveedores"
                    icon="📈"
                    onClick={() => navigate('/proveedores')}
                />
                <MenuButton
                    title="Camaras de Secado"
                    icon="📈"
                    onClick={() => navigate('/camaras-de-secado')}
                />
                <MenuButton
                    title="Pallets"
                    icon="📈"
                    onClick={() => navigate('/inventario-pallets')}
                />
                <MenuButton
                    title="Bloques"
                    icon="📊"
                    onClick={() => navigate('/inventario-bloques')}
                />
            </div>

            {/* Footer Silencioso */}
            <div className="dashboard-footer-message">
                No olvide conectarse a su red de internet mediante la IP de su red actual.
            </div>
        </div>
    );
};

export default PageMainView;