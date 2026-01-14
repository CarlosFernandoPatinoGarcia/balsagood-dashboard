import React, { useState, useEffect } from 'react';
import api from '../api/Api';
import '../App.css';

import PageModalResumenBloques from './PageModalResumenBloques';

// Rango estático de largos comunes (ajustar según necesidad del negocio)
const LARGO_OPTIONS = [25, 24, 23, 22, 21, 20, 18, 16, 14, 12, 10, 8, 6];

const PageInventarioBloques = () => {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/inventario/bloques');
            if (response.data) {
                setReportData(response.data);
                setLastUpdate(new Date());
            }
        } catch (error) {
            console.error("Error cargando inventario bloques:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
        const interval = setInterval(fetchInventory, 30000);
        return () => clearInterval(interval);
    }, []);

    const processTableData = (data) => {
        const tableRows = LARGO_OPTIONS.map(largo => ({
            largo: largo,
            presentado: {
                L: { cant: 0, bft: 0 },
                P: { cant: 0, bft: 0 }
            },
            encolado: {
                L: { cant: 0, bft: 0 },
                P: { cant: 0, bft: 0 }
            }
        }));

        data.forEach(item => {
            // Mapeo Estado
            let section = null;
            if (item.estado === 'PR') section = 'presentado';
            else if (item.estado === 'EN') section = 'encolado';

            if (!section) return;

            // Mapeo Tipo
            const tipo = item.tipoMadera; // 'L' o 'P'
            if (tipo !== 'L' && tipo !== 'P') return;

            // Matching Largo
            const row = tableRows.find(r => r.largo === item.largo);
            if (row) {
                row[section][tipo].cant += (item.cantidad || 0);
                row[section][tipo].bft += (item.totalBft || 0);
            }
        });

        return tableRows;
    };

    const rows = processTableData(reportData);

    // Calcular Totales
    const totals = rows.reduce((acc, row) => {
        // Helper sum
        const add = (target, source) => {
            target.cant += source.cant;
            target.bft += source.bft;
        };
        add(acc.presentado.L, row.presentado.L);
        add(acc.presentado.P, row.presentado.P);
        add(acc.encolado.L, row.encolado.L);
        add(acc.encolado.P, row.encolado.P);
        return acc;
    }, {
        presentado: { L: { cant: 0, bft: 0 }, P: { cant: 0, bft: 0 } },
        encolado: { L: { cant: 0, bft: 0 }, P: { cant: 0, bft: 0 } }
    });

    const totalGlobalBft =
        totals.presentado.L.bft + totals.presentado.P.bft +
        totals.encolado.L.bft + totals.encolado.P.bft;



    const fmtNum = (n) => n > 0 ? n : '-';
    const fmtBft = (n) => n > 0 ? n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-';

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1 className="header-title">Inventario de Bloques</h1>
                    <span className="header-subtitle">
                        Última actualización: {lastUpdate.toLocaleTimeString()}
                    </span>
                </div>
                <div className="header-actions">
                    <button onClick={() => setShowModal(true)} className="btn-save" style={{ backgroundColor: '#1565c0', marginRight: 10 }}>
                        Ver Resumen
                    </button>
                    <button onClick={fetchInventory} className="btn-save" style={{ marginLeft: 10 }}>
                        Actualizar
                    </button>
                </div>
            </header>

            <PageModalResumenBloques
                visible={showModal}
                onClose={() => setShowModal(false)}
                data={reportData}
            />

            <div className="table-container">
                <table className="custom-table" style={{ width: '100%', tableLayout: 'fixed' }}>
                    <thead>
                        <tr>
                            <th rowSpan="3" style={{ width: '60px', backgroundColor: '#f4f6f8' }}>Largo</th>
                            <th colSpan="4" style={{ backgroundColor: '#fff3e0', color: '#e65100' }}>PRESENTADOS</th>
                            <th colSpan="4" style={{ backgroundColor: '#e3f2fd', color: '#0d47a1' }}>ENCOLADOS</th>
                            <th rowSpan="3" style={{ width: '60px', backgroundColor: '#f4f6f8' }}>Porc.</th>
                        </tr>
                        <tr>
                            {/* Sub-headers Madera */}
                            <th colSpan="2" style={{ backgroundColor: '#ffe0b2' }}>Liviana</th>
                            <th colSpan="2" style={{ backgroundColor: '#ffe0b2' }}>Pesada</th>
                            <th colSpan="2" style={{ backgroundColor: '#bbdefb' }}>Liviana</th>
                            <th colSpan="2" style={{ backgroundColor: '#bbdefb' }}>Pesada</th>
                        </tr>
                        <tr>
                            {/* Columnas Finales */}
                            {['Cant', 'BFT', 'Cant', 'BFT', 'Cant', 'BFT', 'Cant', 'BFT'].map((h, i) => (
                                <th key={i} style={{ fontSize: '12px', padding: '8px' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => {
                            const rowBft = row.presentado.L.bft + row.presentado.P.bft + row.encolado.L.bft + row.encolado.P.bft;
                            const porcentaje = totalGlobalBft > 0 ? (rowBft / totalGlobalBft) * 100 : 0;

                            return (
                                <tr key={i}>
                                    <td style={{ fontWeight: 'bold' }}>{row.largo}</td>

                                    {/* Presentado L */}
                                    <td>{fmtNum(row.presentado.L.cant)}</td>
                                    <td>{fmtBft(row.presentado.L.bft)}</td>
                                    {/* Presentado P */}
                                    <td>{fmtNum(row.presentado.P.cant)}</td>
                                    <td>{fmtBft(row.presentado.P.bft)}</td>

                                    {/* Encolado L */}
                                    <td>{fmtNum(row.encolado.L.cant)}</td>
                                    <td>{fmtBft(row.encolado.L.bft)}</td>
                                    {/* Encolado P */}
                                    <td>{fmtNum(row.encolado.P.cant)}</td>
                                    <td>{fmtBft(row.encolado.P.bft)}</td>

                                    {/* Porcentaje */}
                                    <td>{porcentaje > 0 ? porcentaje.toFixed(2) : '- '}%</td>

                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr className="total-row">
                            <td>SUBTOTALES:</td>
                            <td>{fmtNum(totals.presentado.L.cant)}</td>
                            <td>{fmtBft(totals.presentado.L.bft)}</td>
                            <td>{fmtNum(totals.presentado.P.cant)}</td>
                            <td>{fmtBft(totals.presentado.P.bft)}</td>
                            <td>{fmtNum(totals.encolado.L.cant)}</td>
                            <td>{fmtBft(totals.encolado.L.bft)}</td>
                            <td>{fmtNum(totals.encolado.P.cant)}</td>
                            <td>{fmtBft(totals.encolado.P.bft)}</td>
                        </tr>
                    </tfoot>
                </table>


            </div>

            <header className="dashboard-header">
                <div className="header-title">
                    Total: {fmtBft(totalGlobalBft)} BFT
                </div>
            </header>
        </div>
    );
};

export default PageInventarioBloques;