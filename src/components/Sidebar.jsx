import React from 'react';
import { NavLink } from 'react-router-dom';
import '../App.css';

// SVG Icons
const Icons = {
    People: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
    ),
    FileText: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
    ),
    Calendar: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
    ),
    Chart: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
    ),
    Box: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
    ),
    Settings: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
    ),
    Menu: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-grid-icon">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
    )
};

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <Icons.Menu />
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
                    <span className="sidebar-icon"><Icons.FileText /></span>
                    Camaras de secado
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
                    <span className="sidebar-icon"><Icons.Calendar /></span>
                    Recepciones Madera Verde
                </NavLink>
                <NavLink to="/produccion" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-icon"><Icons.FileText /></span>
                    Produccion de Taller
                </NavLink>
                <NavLink to="/pallets-secos" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-icon"><Icons.FileText /></span>
                    Pallets Secos
                </NavLink>
            </div>

            <div className="sidebar-section">
                <h3 className="sidebar-section-title">REPORTES</h3>
                <NavLink to="/inventario-pallets" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-icon"><Icons.Chart /></span>
                    Pallets
                </NavLink>
                <NavLink to="/inventario-bloques" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-icon"><Icons.Box /></span>
                    Bloques
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
