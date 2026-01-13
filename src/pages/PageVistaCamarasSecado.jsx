import React, { useEffect, useState } from 'react';
import api from '../api/Api';
import '../App.css';

export default function PageVistaCamarasSecado() {
    const [camarasSecado, setCamarasSecado] = useState([]);
    const [cargando, setCargando] = useState(false);

    const fetchCamarasSecado = async () => {
        try {
            setCargando(true);
            const response = await api.get('/api/camaras');
            if (response.data) {
                setCamarasSecado(response.data);
            }
        } catch (error) {
            console.error('Error cargando camaras de secado:', error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        fetchCamarasSecado();
    }, []);

    // if (cargando && proveedores.length === 0) return <div className="loading-container">Cargando...</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1 className="header-title">Listado de Camaras de Secado</h1>
                    <span className="header-subtitle">
                        Total registrados: {camarasSecado.length}
                    </span>
                </div>
                <div className="header-actions">
                    <button onClick={fetchCamarasSecado} className="btn-save">
                        ↻ Refrescar
                    </button>
                </div>
            </header>

            <div className="table-container">
                <table className="custom-table" style={{ width: '100%', tableLayout: 'fixed' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '80px', backgroundColor: '#f4f6f8' }}>ID</th>
                            <th style={{ backgroundColor: '#e3f2fd', color: '#1565c0' }}>Descripcion</th>
                            <th style={{ backgroundColor: '#e3f2fd', color: '#1565c0' }}>Capacidad</th>
                            <th style={{ backgroundColor: '#e3f2fd', color: '#1565c0' }}>Capacidad Disponible</th>
                        </tr>
                    </thead>
                    <tbody>
                        {camarasSecado.map(c => (
                            <tr key={c.idCamara}>
                                <td style={{ fontWeight: 'bold' }}>{c.idCamara}</td>
                                <td>{c.camaraDescripcion}</td>
                                <td>{c.camaraCapacidad}</td>
                                <td>{c.capacidadDisponible}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}