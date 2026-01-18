import React, { useState, useEffect } from 'react';
import api from '../api/Api';
import '../App.css';

const PageDetallePalletsSecos = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await Promise.all([
                api.get('/api/proceso/pallets-secos'),
                new Promise(resolve => setTimeout(resolve, 1000))
            ]);
            setData(response[0].data || []);
        } catch (error) {
            console.error("Error fetching pallets secos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fmtNum = (num) => num ? num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-';

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            // Formato dd/mm/yyyy HH:mm
            return date.toLocaleString('es-EC', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1 className="header-title">Madera Seca</h1>
                    <span className="header-subtitle">Aquí podrá encontrar el detalle los pallets y las secadoras a las que entraron</span>
                </div>
                <div className="header-actions">
                    <button onClick={fetchData} className="btn-save">
                        Actualizar
                    </button>
                </div>
            </header>

            <div className="table-container">
                {loading ? (
                    <div className="loader-container">
                        <div className="planer-machine">
                            <div className="plank"></div>
                            <div className="cutter-head"></div>
                            <div className="wood-chips">
                                <div className="chip"></div>
                                <div className="chip"></div>
                                <div className="chip"></div>
                            </div>
                        </div>
                        <div className="loader-text">Procesando...</div>
                    </div>
                ) : (
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Lote / Código</th>
                                <th>Viaje</th>
                                <th>N° Pallet</th>
                                <th>Cámara</th>
                                <th>Fecha Inicio</th>
                                <th>Fecha Fin</th>
                                <th>BFT Total Lote</th>
                                <th>BFT Lote Seco</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="empty-row">No hay registros</td>
                                </tr>
                            ) : (
                                data.map((item, index) => {
                                    const [viaje, pallet] = item.codigoPallet ? item.codigoPallet.split(' ') : ['-', '-'];
                                    return (
                                        <tr key={index}>
                                            <td>{item.loteCodigo}</td>
                                            <td>{viaje}</td>
                                            <td>{pallet}</td>
                                            <td>{item.camaraDescripcion}</td>
                                            <td>{formatDate(item.loteFechaInicio)}</td>
                                            <td>{formatDate(item.loteFechaFin)}</td>
                                            <td>{fmtNum(item.bftTotalLote)}</td>
                                            <td>{fmtNum(item.bftLoteSeco)}</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default PageDetallePalletsSecos;
