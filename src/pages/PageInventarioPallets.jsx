import React, { useState, useEffect } from 'react';
import api from '../api/Api';
import '../App.css'; // Importamos los estilos globales

const ESPESOR_OPTIONS = ['3', '2.5', '2', '1.5', '1', '0.875'];

const PageInventarioPallets = () => {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date());

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
            alert("Error conectando con el servidor");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
        const interval = setInterval(fetchInventory, 60000);
        return () => clearInterval(interval);
    }, []);

    const processBackendData = (data, categoryFilter, tipoFilter) => {
        const filtered = data.filter(item =>
            item.estado === categoryFilter &&
            item.tipoMadera === tipoFilter
        );

        const mapped = {};
        ESPESOR_OPTIONS.forEach(opt => { mapped[opt] = { espesor: opt, bft: 0 }; });

        filtered.forEach(item => {
            let key = String(item.espesor);
            if (key.endsWith('.0') && key.length > 2) key = key.slice(0, -2);
            if (!mapped[key]) mapped[key] = { espesor: key, bft: 0 };
            mapped[key].bft += parseFloat(item.totalBft || 0);
        });

        return Object.values(mapped).sort((a, b) => parseFloat(b.espesor) - parseFloat(a.espesor));
    };

    // Componente interno para la tabla
    const TablaSeccion = ({ title, color, dataL, dataP }) => {
        const totalL = dataL.reduce((sum, r) => sum + r.bft, 0);
        const totalP = dataP.reduce((sum, r) => sum + r.bft, 0);
        const granTotal = totalL + totalP;

        return (
            <div className="card">
                {/* Usamos style inline SOLO para el color dinámico del header */}
                <div className="card-header" style={{ backgroundColor: color }}>
                    {title}
                </div>
                <div className="table-responsive">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Espesor</th>
                                <th>Liviana</th>
                                <th>Pesada</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataL.map((rowL, index) => {
                                const rowP = dataP[index] || { bft: 0 };
                                const rowTotal = rowL.bft + rowP.bft;
                                return (
                                    <tr key={index}>
                                        <td style={{ fontWeight: 'bold' }}>{rowL.espesor}</td>
                                        <td>{rowL.bft > 0 ? rowL.bft.toFixed(2) : '-'}</td>
                                        <td>{rowP.bft > 0 ? rowP.bft.toFixed(2) : '-'}</td>
                                        <td className="cell-total">
                                            {rowTotal > 0 ? rowTotal.toFixed(2) : '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr className="total-row">
                                <td>TOTAL</td>
                                <td>{totalL.toFixed(2)}</td>
                                <td>{totalP.toFixed(2)}</td>
                                <td>{granTotal.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        );
    };

    // Preparar datos
    const verdeL = processBackendData(reportData, 'MV', 'L'); // 'MV' = Madera Verde
    const verdeP = processBackendData(reportData, 'MV', 'P');

    const secadoL = processBackendData(reportData, 'SE', 'L'); // 'SE' = Secado
    const secadoP = processBackendData(reportData, 'SE', 'P');

    const stockL = processBackendData(reportData, 'SS', 'L'); // 'SS' = Stock Seco
    const stockP = processBackendData(reportData, 'SS', 'P');

    const totalPlanta = [verdeL, verdeP, secadoL, secadoP, stockL, stockP]
        .flat()
        .reduce((acc, item) => acc + item.bft, 0);

    if (loading && reportData.length === 0) {
        return <div className="loading-container">Cargando datos...</div>;
    }

    return (
        <div className="dashboard-container">
            {/* Header Dashboard */}
            <header className="dashboard-header">
                <div>
                    <h1 className="header-title">Dashboard Inventario Pallets</h1>
                    <span className="header-subtitle">
                        Última actualización: {lastUpdate.toLocaleTimeString()}
                    </span>
                </div>

                <div className="header-actions">
                    <div className="total-badge">
                        Total Planta: {totalPlanta.toLocaleString('en-US', { maximumFractionDigits: 2 })} BFT
                    </div>
                    <button onClick={fetchInventory} className="btn-refresh">
                        ↻ Refrescar
                    </button>
                </div>
            </header>

            {/* Grid Layout */}
            <div className="grid-container">
                <TablaSeccion title="MADERA VERDE" color="#27ae60" dataL={verdeL} dataP={verdeP} />
                <TablaSeccion title="SECADO" color="#d35400" dataL={secadoL} dataP={secadoP} />
                <TablaSeccion title="STOCK SECO" color="#2980b9" dataL={stockL} dataP={stockP} />
            </div>
        </div>
    );
};

export default PageInventarioPallets;