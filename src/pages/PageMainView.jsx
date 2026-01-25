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

        checkAndRotateOrder();
    }, []);

    const checkAndRotateOrder = async () => {
        try {
            // 1. Consultar Orden Activa
            const response = await api.get('/api/ordenes-taller/activa');
            const ordenActiva = response.data;

            // Fecha HOY "YYYY-MM-DD" local
            const today = new Date().toLocaleDateString('en-CA'); // Formato ISO local friendly

            if (!ordenActiva) {
                // Caso A: No hay orden activa -> Iniciar una nueva
                console.log("No hay orden activa. Iniciando nueva orden...");
                await api.post('/api/ordenes-taller/iniciar');
            } else {
                // Caso B: Hay orden activa -> Verificar fecha
                // Asumimos 'ordenFechaInicio' viene como string ISO o similar.
                // Ajustar según formato real del backend. Si es "2023-10-27T10:00:00", hacer split.
                const ordenFecha = ordenActiva.ordenFechaInicio ? ordenActiva.ordenFechaInicio.split('T')[0] : '';

                if (ordenFecha !== today) {
                    console.log(`Orden activa de fecha ${ordenFecha} es antigua (Hoy: ${today}). Rotando orden...`);
                    // 1. Finalizar anterior
                    await api.patch('/api/ordenes-taller/finalizar');
                    // 2. Iniciar nueva
                    await api.post('/api/ordenes-taller/iniciar');
                    console.log("Orden rotada exitosamente.");
                } else {
                    console.log("Orden activa es válida para hoy.");
                }
            }
        } catch (error) {
            console.error("Error gestionando orden de taller automática:", error);
            // Si es 404 a veces axios lanza error, manejar si aplica
            if (error.response && error.response.status === 404) {
                // Si el endpoint retorna 404 en lugar de 204/null cuando no hay orden
                try {
                    await api.post('/api/ordenes-taller/iniciar');
                } catch (e) { console.error("Error iniciando orden tras 404:", e); }
            }
        }
    };

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
                <h1 className="welcome-title">Bienvenido al panel de administración de BalsaGood</h1>
                <p className="welcome-desc">Nuestros supervisores lo mantienen informado de lo sucedido en producción.</p>
            </div>


            {/* Menú Principal (Grid) */}
            <div className="grid-container">
                <MenuButton
                    title="Proveedores"
                    icon="👨🏻‍💼"
                    onClick={() => navigate('/proveedores')}
                />
                <MenuButton
                    title="Camaras de Secado"
                    icon="🎛️"
                    onClick={() => navigate('/camaras-de-secado')}
                />
                <MenuButton
                    title="Pallets"
                    icon="🌲"
                    onClick={() => navigate('/inventario-pallets')}
                />
                <MenuButton
                    title="Bloques"
                    icon="📦"
                    onClick={() => navigate('/inventario-bloques')}
                />
            </div>

            {/* Footer Silencioso */}
            <div className="dashboard-footer-message">
                Balsagood - Todos los derechos reservados.
            </div>
        </div>
    );
};

export default PageMainView;