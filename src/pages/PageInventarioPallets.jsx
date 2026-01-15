import React, { useState, useEffect } from 'react';
import api from '../api/Api';
import '../App.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ESPESOR_OPTIONS = [3.0, 2.5, 2.0, 1.5, 1.0, 0.875];

const PageInventarioPallets = () => {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/inventario/pallets');
            if (response.data) {
                setReportData(response.data);
                setLastUpdate(new Date());
            }
        } catch (error) {
            console.error("Error cargando inventario:", error);
            // alert("Error conectando con el servidor");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
        const interval = setInterval(fetchInventory, 30000); // 30s
        return () => clearInterval(interval);
    }, []);

    // Procesamiento de datos para la Tabla Unificada
    const processTableData = (data) => {
        // Debug
        console.log("Procesando datos pallets:", data.length, "registros");

        // 1. Inicializar estructura base para cada espesor
        const tableRows = ESPESOR_OPTIONS.map(espesor => ({
            espesor: espesor,
            verde: { L: 0, P: 0 },
            secado: { L: 0, P: 0 },
            stock: { L: 0, P: 0 }
        }));

        // Agregar fila para "Otros" si fuera necesario, o sumar a un row genérico, 
        // pero por requerimiento "estático", nos ceñimos a las opciones. Consideraremos redondeo.

        // 2. Acumular valores
        data.forEach(item => {
            // Mapear Estado
            let targetSection = null;
            if (item.estado === 'MV') targetSection = 'verde';
            else if (item.estado === 'SE') targetSection = 'secado';
            else if (item.estado === 'SS') targetSection = 'stock';

            if (!targetSection) return; // Ignoramos otros estados

            // Mapear Tipo
            const tipo = item.tipoMadera; // 'L' o 'P'
            if (tipo !== 'L' && tipo !== 'P') return;

            // Parsing seguro de valores
            const itemBft = parseFloat(item.totalBft) || 0;
            const itemEspesor = parseFloat(item.espesor);

            // Encontrar fila por espesor
            const row = tableRows.find(r => Math.abs(r.espesor - itemEspesor) < 0.001);

            if (row) {
                row[targetSection][tipo] += itemBft;
            }
        });

        return tableRows;
    };

    const filteredData = reportData.filter(item => {
        if (!startDate && !endDate) return true;

        const fechaIngreso = item.fechaIngreso ? new Date(item.fechaIngreso) : null;

        if (startDate) {
            if (!fechaIngreso) return false;
            const s = new Date(startDate); s.setHours(0, 0, 0, 0);
            if (fechaIngreso < s) return false;
        }

        if (endDate) {
            if (!fechaIngreso) return false;
            const e = new Date(endDate); e.setHours(23, 59, 59, 999);
            if (fechaIngreso > e) return false;
        }

        return true;
    });

    const rows = processTableData(filteredData);

    // Calcular Totales de Columnas
    const totals = rows.reduce((acc, row) => {
        acc.verde.L += row.verde.L;
        acc.verde.P += row.verde.P;
        acc.secado.L += row.secado.L;
        acc.secado.P += row.secado.P;
        acc.stock.L += row.stock.L;
        acc.stock.P += row.stock.P;
        return acc;
    }, {
        verde: { L: 0, P: 0 },
        secado: { L: 0, P: 0 },
        stock: { L: 0, P: 0 }
    });

    const totalGlobal =
        totals.verde.L + totals.verde.P +
        totals.secado.L + totals.secado.P +
        totals.stock.L + totals.stock.P;

    // Helper para formatear
    const fmt = (num) => num > 0 ? num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-';

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1 className="header-title">Inventario de Pallets</h1>
                    <span className="header-subtitle">
                        Última actualización: {lastUpdate.toLocaleTimeString()}
                    </span>
                </div>


                <div className="date-picker-container">
                    <div className="date-picker" style={{ marginRight: '20px' }}>
                        <span className="header-subtitle">
                            Desde:
                        </span>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText="Fecha Inicio"
                            className="bg-white border rounded px-2 py-1"
                        />
                        <span className="header-subtitle">
                            Hasta:
                        </span>
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
                <button onClick={fetchInventory} className="btn-save" style={{ marginLeft: 10 }}>
                    Actualizar
                </button>

            </header>

            <div className="table-container">
                <table className="custom-table" style={{ width: '100%', tableLayout: 'fixed' }}>
                    <thead>
                        <tr>
                            <th rowSpan="2" style={{ width: '80px', backgroundColor: '#f4f6f8' }}>Espesor</th>
                            <th colSpan="2" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>MADERA VERDE</th>
                            <th colSpan="2" style={{ backgroundColor: '#fff3e0', color: '#ef6c00' }}>SECADORAS</th>
                            <th colSpan="2" style={{ backgroundColor: '#e3f2fd', color: '#1565c0' }}>STOCK SECO</th>
                        </tr>
                        <tr>
                            {/* Verde */}
                            <th style={{ backgroundColor: '#e8f5e9', fontSize: '13px' }}>Liviana</th>
                            <th style={{ backgroundColor: '#e8f5e9', fontSize: '13px' }}>Pesada</th>
                            {/* Secadoras */}
                            <th style={{ backgroundColor: '#fff3e0', fontSize: '13px' }}>Liviana</th>
                            <th style={{ backgroundColor: '#fff3e0', fontSize: '13px' }}>Pesada</th>
                            {/* Stock Seco */}
                            <th style={{ backgroundColor: '#e3f2fd', fontSize: '13px' }}>Liviana</th>
                            <th style={{ backgroundColor: '#e3f2fd', fontSize: '13px' }}>Pesada</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={i}>
                                <td style={{ fontWeight: 'bold' }}>{row.espesor}</td>

                                {/* Verde */}
                                <td>{fmt(row.verde.L)}</td>
                                <td>{fmt(row.verde.P)}</td>

                                {/* Secadoras */}
                                <td>{fmt(row.secado.L)}</td>
                                <td>{fmt(row.secado.P)}</td>

                                {/* Stock Seco */}
                                <td>{fmt(row.stock.L)}</td>
                                <td>{fmt(row.stock.P)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="total-row">
                            <td>TOTAL</td>
                            <td>{fmt(totals.verde.L)}</td>
                            <td>{fmt(totals.verde.P)}</td>
                            <td>{fmt(totals.secado.L)}</td>
                            <td>{fmt(totals.secado.P)}</td>
                            <td>{fmt(totals.stock.L)}</td>
                            <td>{fmt(totals.stock.P)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div className="header-actions">
                <div className="total-badge">
                    Total Planta: {fmt(totalGlobal)} BFT
                </div>
            </div>
        </div>
    );
};

export default PageInventarioPallets;