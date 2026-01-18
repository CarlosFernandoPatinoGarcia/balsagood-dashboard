import React, { useState, useEffect } from 'react';
import api from '../api/Api';
import '../App.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PageDetalleBloquesDespachados = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Promise.all to ensure at least 2 seconds duration for the "wood planing" animation
            const [response] = await Promise.all([
                api.get('/api/proceso/bloques-despachados'),
                new Promise(resolve => setTimeout(resolve, 1000))
            ]);
            setData(response.data || []);
        } catch (error) {
            console.error("Error fetching bloques despachados:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fmtNum = (num) => num ? num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-';

    const formatDate = (dateString) => {
        return dateString || '-';
    };

    const filteredData = data.filter(item => {
        if (!startDate && !endDate) return true;

        // Parse item date (YYYY-MM-DD)
        // Note: Adding 'T00:00:00' ensures local time parsing or consistent parsing depending on environment, 
        // but simple new Date('YYYY-MM-DD') is usually UTC.
        // Let's use simple string comparison if format is guaranteed YYYY-MM-DD, or proper Date objects.
        // Using Date objects is safer for ranges.
        // We simulate the time part to avoid timezone shifts making it previous day in some browsers if parsed as UTC.
        const itemDate = item.fechaDespacho ? new Date(item.fechaDespacho + 'T00:00:00') : null;

        if (startDate) {
            if (!itemDate) return false;
            const s = new Date(startDate);
            s.setHours(0, 0, 0, 0);
            if (itemDate < s) return false;
        }

        if (endDate) {
            if (!itemDate) return false;
            const e = new Date(endDate);
            e.setHours(23, 59, 59, 999);
            if (itemDate > e) return false;
        }

        return true;
    });

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1 className="header-title">Bloques Despachados</h1>
                    <span className="header-subtitle">Listado de bloques exportados</span>
                </div>
                <div className="date-picker-container">
                    <div className="date-picker" style={{ marginRight: '20px' }}>
                        <span className="header-subtitle">Desde: </span>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText="Fecha Inicio"
                            className="bg-white border rounded px-2 py-1"
                        />
                        <span className="header-subtitle" style={{ marginLeft: '10px' }}>Hasta: </span>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            placeholderText="Fecha Fin"
                            className="bg-white border rounded px-2 py-1"
                        />
                    </div>
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
                                <th>Código</th>
                                {/* <th>Fecha Despacho</th> */}
                                <th>N° Bloque</th>
                                <th>Largo (")</th>
                                <th>Ancho (")</th>
                                <th>Alto (")</th>
                                <th>Peso (c/cola)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="empty-row">No hay registros</td>
                                </tr>
                            ) : (
                                filteredData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.codigoDespacho}</td>
                                        {/* <td>{formatDate(item.fechaDespacho)}</td> */}
                                        <td>{item.codigoBloque}</td>
                                        <td>{fmtNum(item.bloqueLargo)}</td>
                                        <td>{fmtNum(item.bloqueAncho)}</td>
                                        <td>{fmtNum(item.bloqueAlto)}</td>
                                        <td>{fmtNum(item.bloquePesoConCola)}</td>
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

export default PageDetalleBloquesDespachados;
