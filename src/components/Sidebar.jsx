import React from 'react';
import { NavLink } from 'react-router-dom';
import '../App.css';
import Icons from './Icons';



const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <Icons.Icon />
            </div>

            <div className="sidebar-section">
                <h3 className="sidebar-section-title">Dashboard</h3>
                <NavLink to="/dashboard" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-icon"><Icons.Menu /></span>
                    Resumen
                </NavLink>
            </div>

            <div className="sidebar-section">
                <h3 className="sidebar-section-title">ADMINISTRACIÓN</h3>
                <NavLink to="/proveedores" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-icon"><Icons.People /></span>
                    Proveedores
                </NavLink>
                <NavLink to="/camaras-de-secado" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-icon"><Icons.Dryer /></span>
                    Camaras de secado
                </NavLink>
                <NavLink to="/bloques-producidos" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-icon"><Icons.Block /></span>
                    Bloques producidos
                </NavLink>

                {/* <div className="sidebar-button-container">
                    <button className="sidebar-action-btn">
                        Tabla de Densidades
                    </button>
                </div> */}
            </div>

            <div className="sidebar-section">
                <h3 className="sidebar-section-title">PROCESO</h3>
                <NavLink to="/recepciones" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-icon"><Icons.Liston /></span>
                    Recepciones
                </NavLink>
                <NavLink to="/pallets-secos" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-icon"><Icons.DryadSquare /></span>
                    Madera seca
                </NavLink>
                <NavLink to="/pallets-ingresados" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-icon"><Icons.Presentacion /></span>
                    Ingresar madera
                </NavLink>
                <NavLink to="/registro-presentados" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-icon"><Icons.Presentacion /></span>
                    Presentación
                </NavLink>
            </div>

            <div className="sidebar-section">
                <h3 className="sidebar-section-title">REPORTES</h3>
                <NavLink to="/inventario-pallets" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-icon"><Icons.Pallet /></span>
                    Pallets
                </NavLink>
                <NavLink to="/inventario-bloques" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-icon"><Icons.Block /></span>
                    Bloques
                </NavLink>
                <NavLink to="/bloques-despachados" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-icon"><Icons.Truck /></span>
                    Despachos
                </NavLink>
            </div>

            <div className="sidebar-section">
                <h3 className="sidebar-section-title">GENERAL</h3>
                <NavLink to="/configuracion" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-icon"><Icons.Settings /></span>
                    Configuración
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;
