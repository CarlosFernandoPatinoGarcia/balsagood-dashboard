import React, { useEffect, useState } from 'react';
import api from '../api/Api';
import '../App.css';

export default function PageVistaProveedores() {
    const [proveedores, setProveedores] = useState([]);
    const [cargando, setCargando] = useState(false);

    const fetchProveedores = async () => {
        try {
            setCargando(true);
            const response = await api.get('/api/proveedores');
            if (response.data) {
                setProveedores(response.data);
            }
        } catch (error) {
            console.error('Error fetching proveedores:', error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        fetchProveedores();
    }, []);

    // if (cargando && proveedores.length === 0) return <div className="loading-container">Cargando...</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1 className="header-title">Listado de Proveedores</h1>
                    <span className="header-subtitle">
                        Total registrados: {proveedores.length}
                    </span>
                </div>
                <div className="header-actions">
                    <button onClick={fetchProveedores} className="btn-save">
                        ↻ Refrescar
                    </button>
                </div>
            </header>

            <div className="table-container">
                <table className="custom-table" style={{ width: '100%', tableLayout: 'fixed' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '80px', backgroundColor: '#f4f6f8' }}>ID</th>
                            <th style={{ backgroundColor: '#e3f2fd', color: '#1565c0' }}>Nombre del Proveedor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proveedores.map(p => (
                            <tr key={p.idProveedor}>
                                <td style={{ fontWeight: 'bold' }}>{p.idProveedor}</td>
                                <td>{p.provNombre}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}