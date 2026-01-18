import React, { useState, useEffect } from 'react';
import api from '../api/Api';
import '../App.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import PageModalResumenBloques from './PageModalResumenBloques';

// Rango estático de largos comunes (ajustar según necesidad del negocio)
const LARGO_OPTIONS = [25, 24, 23, 22, 21, 20, 18, 16, 14, 12, 10, 8, 6];

const PageInventarioBloques = () => {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const response = await Promise.all([
                api.get('/api/inventario/bloques'),
                new Promise(resolve => setTimeout(resolve, 1000))
            ]);
            if (response[0].data) {
                setReportData(response[0].data);
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

    const filteredData = reportData.filter(item => {
        if (!startDate && !endDate) return true;

        // Safe access to dates
        const itemFechaInicio = item.fechaInicio ? new Date(item.fechaInicio) : null;
        const itemFechaFin = item.fechaFin ? new Date(item.fechaFin) : null;

        if (startDate) {
            if (!itemFechaInicio) return false;
            // set start date time to 00:00:00 for fair comparison if item has hours
            const s = new Date(startDate); s.setHours(0, 0, 0, 0);
            if (itemFechaInicio < s) return false;
        }

        if (endDate) {
            if (!itemFechaFin) return false;
            // set end date time to 23:59:59
            const e = new Date(endDate); e.setHours(23, 59, 59, 999);
            if (itemFechaFin > e) return false;
        }

        return true;
    });

    const rows = processTableData(filteredData);

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
                )}

            </div>


            <header className="dashboard-header">
                <div className="header-title">
                    Total: {fmtBft(totalGlobalBft)} BFT
                </div>
            </header>

            {/* tabla de contenedores */}
            {/* tabla de contenedores y totales calculados */}
            {/* <h2 className="section-title" style={{ marginTop: '20px', textAlign: 'center' }}>CONTROL DE BLOQUES PRESENTADOS Y ENCOLADOS</h2> */}

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
                    <table className="custom-table" style={{ width: '100%', tableLayout: 'fixed' }}>

                        {/* Wait, the user asked for a specific table "Control de Contenedores" based on existing data.
                        Let's re-read the request carefully: "Implementa esta tabla en base a la estructura ya planteada... El calculo de los contenedores sabemos que es el el bft respectivo/26500"
                        And the previous dummy table I had:
                        CONTENEDORES
                        Presentados | Encolados
                        Cant | BFT | Cant | BFT
                        
                        I should calculate totals here first.
                    */}
                        {(() => {
                            // Calculate totals for filteredData
                            const calcTotals = filteredData.reduce((acc, item) => {
                                const bft = item.totalBft || 0;
                                const tipo = item.tipoMadera; // 'L' (Liviana/Larga?) or 'P' (Pesada/Corta?) - usually L=Liviana, P=Pesada in this code context?
                                // Wait, existing code maps L -> Liviana, P -> Pesada.  
                                // User request existing code:
                                // <th colSpan="2">Liviana</th><th colSpan="2">Pesada</th>

                                if (item.estado === 'PR') {
                                    if (tipo === 'L') acc.pres.L += bft;
                                    else if (tipo === 'P') acc.pres.P += bft;
                                } else if (item.estado === 'EN') {
                                    if (tipo === 'L') acc.enc.L += bft;
                                    else if (tipo === 'P') acc.enc.P += bft;
                                }
                                return acc;
                            }, { pres: { L: 0, P: 0 }, enc: { L: 0, P: 0 } });

                            const totalPres = calcTotals.pres.L + calcTotals.pres.P;
                            const totalEnc = calcTotals.enc.L + calcTotals.enc.P;

                            const contPres = totalPres / 26500;
                            const contEnc = totalEnc / 26500;

                            return (
                                <>
                                    <thead>
                                        <tr>
                                            <th colSpan="5" style={{ backgroundColor: '#2f3b52', color: 'white', textAlign: 'center' }}>
                                                CONTROL DE BLOQUES PRESENTADOS Y ENCOLADOS (CONTENEDORES)
                                            </th>
                                        </tr>
                                        <tr>
                                            <th style={{ backgroundColor: '#f4f6f8' }}>Tipo de madera</th>
                                            <th style={{ backgroundColor: '#fff3e0' }}>Presentados BFT</th>
                                            <th style={{ backgroundColor: '#fff3e0' }}>Contenedores</th>
                                            <th style={{ backgroundColor: '#e3f2fd' }}>Encolados BFT</th>
                                            <th style={{ backgroundColor: '#e3f2fd' }}>Contenedores</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ fontWeight: 'bold' }}>Liviana (L)</td>
                                            <td>{fmtBft(calcTotals.pres.L)}</td>
                                            <td>{(calcTotals.pres.L / 26500).toFixed(2)}</td>
                                            <td>{fmtBft(calcTotals.enc.L)}</td>
                                            <td>{(calcTotals.enc.L / 26500).toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ fontWeight: 'bold' }}>Pesada (P)</td>
                                            <td>{fmtBft(calcTotals.pres.P)}</td>
                                            <td>{(calcTotals.pres.P / 26500).toFixed(2)}</td>
                                            <td>{fmtBft(calcTotals.enc.P)}</td>
                                            <td>{(calcTotals.enc.P / 26500).toFixed(2)}</td>
                                        </tr>
                                        <tr style={{ fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>
                                            <td>TOTAL</td>
                                            <td>{fmtBft(totalPres)}</td>
                                            <td>{contPres.toFixed(2)}</td>
                                            <td>{fmtBft(totalEnc)}</td>
                                            <td>{contEnc.toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </>
                            );
                        })()}
                    </table>
                )}
            </div>

        </div>
    );
};

export default PageInventarioBloques;