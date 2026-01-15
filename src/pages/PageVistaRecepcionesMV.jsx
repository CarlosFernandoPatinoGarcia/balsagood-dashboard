import React, { useState, useEffect } from 'react';
import api from '../api/Api';
import '../App.css';

const PageVistaRecepcionesMV = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/proceso/recepciones-madera-verde');
            setData(response.data || []);
        } catch (error) {
            console.error("Error fetching recepciones:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fmtNum = (num) => num ? num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-';

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1 className="header-title">Recepciones Madera Verde</h1>
                    <span className="header-subtitle">Historial de recepciones</span>
                </div>
                <div className="header-actions">
                    <button onClick={fetchData} className="btn-save">
                        Actualizar
                    </button>
                </div>
            </header>

            <div className="table-container">
                {loading ? (
                    <div style={{ padding: 20, textAlign: 'center' }}>Cargando...</div>
                ) : (
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Fecha Ingreso</th>
                                <th>Proveedor</th>
                                <th>Viaje</th>
                                <th>Pallet #</th>
                                <th>Tipo de Madera</th>
                                <th>BFT Recibido</th>
                                <th>BFT Aceptado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="empty-row">No hay registros de recepciones</td>
                                </tr>
                            ) : (
                                data.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.fechaIngreso}</td>
                                        <td>{item.provNombre}</td>
                                        <td>{item.numViaje}</td>
                                        <td>{item.palletNumero}</td>
                                        <td>{item.tipoMadera === 'L' ? 'Liviana' : item.tipoMadera === 'P' ? 'Pesada' : item.tipoMadera}</td>
                                        <td>{fmtNum(item.bftVerdeRecibido)}</td>
                                        <td>{fmtNum(item.bftVerdeAceptado)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default PageVistaRecepcionesMV;
