import React from 'react';
import '../App.css';

export default function PageModalResumenBloques({ visible, onClose, data }) {
    if (!visible) return null;

    // Constantes
    const BFT_PER_CONTAINER = 26500;

    // Estructura de acumuladores
    const stats = {
        L: {
            corto: { cant: 0, bft: 0 },
            largo: { cant: 0, bft: 0 },
        },
        P: {
            corto: { cant: 0, bft: 0 },
            largo: { cant: 0, bft: 0 },
        }
    };

    // Procesar datos
    data.forEach(item => {
        const tipo = item.tipoMadera; // 'L' or 'P'
        if (tipo !== 'L' && tipo !== 'P') return;

        const largo = item.largo;
        const bft = item.totalBft || 0;
        const cant = item.cantidad || 0;

        // Clasificación por largo
        let catLargo = null;
        if (largo >= 6 && largo <= 10) catLargo = 'corto';
        else if (largo >= 12 && largo <= 25) catLargo = 'largo';

        if (catLargo) {
            stats[tipo][catLargo].cant += cant;
            stats[tipo][catLargo].bft += bft;
        }
    });

    // Helper de formateo
    const fmtNum = (n) => n > 0 ? n : 0;
    const fmtBft = (n) => n > 0 ? Math.round(n) : 0; // BFT entero en la imagen
    const fmtCont = (bft) => (bft / BFT_PER_CONTAINER).toFixed(2);

    // Totales por grupo
    const totalL = stats.L.corto.bft + stats.L.largo.bft;
    const totalP = stats.P.corto.bft + stats.P.largo.bft;
    const grandTotalCant = stats.L.corto.cant + stats.L.largo.cant + stats.P.corto.cant + stats.P.largo.cant;
    const grandTotalBft = totalL + totalP;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '600px' }}>
                <h2 className="modal-title" style={{ textAlign: 'center', backgroundColor: '#1a3c6e', color: 'white', padding: '10px', borderRadius: '4px 4px 0 0', margin: '-30px -30px 20px -30px' }}>
                    INVENTARIO DE BLOQUES - 積木庫存
                </h2>

                <table className="custom-table" style={{ width: '100%', border: '1px solid #ccc' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f0f0f0' }}>
                            <th style={{ textAlign: 'left' }}>---</th>
                            <th style={{ textAlign: 'center' }}># BLOQUES</th>
                            <th style={{ textAlign: 'center' }}>BFT</th>
                            <th style={{ textAlign: 'right' }}>CONTENEDORES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* LIVIANO */}
                        <tr style={{ fontWeight: 'bold', backgroundColor: '#white' }}>
                            <td>LIVIANO</td>
                            <td style={{ textAlign: 'center' }}>{fmtNum(stats.L.corto.cant + stats.L.largo.cant)}</td>
                            <td style={{ textAlign: 'center' }}>{fmtBft(totalL)}</td>
                            <td style={{ textAlign: 'right' }}>{fmtCont(totalL)}</td>
                        </tr>
                        <tr>
                            <td style={{ paddingLeft: '30px' }}>CORTO</td>
                            <td style={{ textAlign: 'center' }}>{fmtNum(stats.L.corto.cant)}</td>
                            <td style={{ textAlign: 'center' }}>{fmtBft(stats.L.corto.bft)}</td>
                            <td style={{ textAlign: 'right' }}>{fmtCont(stats.L.corto.bft)}</td>
                        </tr>
                        <tr>
                            <td style={{ paddingLeft: '30px' }}>LARGO</td>
                            <td style={{ textAlign: 'center' }}>{fmtNum(stats.L.largo.cant)}</td>
                            <td style={{ textAlign: 'center' }}>{fmtBft(stats.L.largo.bft)}</td>
                            <td style={{ textAlign: 'right' }}>{fmtCont(stats.L.largo.bft)}</td>
                        </tr>

                        {/* PESADO */}
                        <tr style={{ fontWeight: 'bold', borderTop: '1px solid #ddd' }}>
                            <td>PESADO</td>
                            <td style={{ textAlign: 'center' }}>{fmtNum(stats.P.corto.cant + stats.P.largo.cant)}</td>
                            <td style={{ textAlign: 'center' }}>{fmtBft(totalP)}</td>
                            <td style={{ textAlign: 'right' }}>{fmtCont(totalP)}</td>
                        </tr>
                        <tr>
                            <td style={{ paddingLeft: '30px' }}>CORTO</td>
                            <td style={{ textAlign: 'center' }}>{fmtNum(stats.P.corto.cant)}</td>
                            <td style={{ textAlign: 'center' }}>{fmtBft(stats.P.corto.bft)}</td>
                            <td style={{ textAlign: 'right' }}>{fmtCont(stats.P.corto.bft)}</td>
                        </tr>
                        <tr>
                            <td style={{ paddingLeft: '30px' }}>LARGO</td>
                            <td style={{ textAlign: 'center' }}>{fmtNum(stats.P.largo.cant)}</td>
                            <td style={{ textAlign: 'center' }}>{fmtBft(stats.P.largo.bft)}</td>
                            <td style={{ textAlign: 'right' }}>{fmtCont(stats.P.largo.bft)}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr style={{ backgroundColor: '#e3f2fd', fontWeight: 'bold' }}>
                            <td>TOTAL GENERAL</td>
                            <td style={{ textAlign: 'center' }}>{fmtNum(grandTotalCant)}</td>
                            <td style={{ textAlign: 'center' }}>{fmtBft(grandTotalBft)}</td>
                            <td style={{ textAlign: 'right' }}>{fmtCont(grandTotalBft)}</td>
                        </tr>
                    </tfoot>
                </table>

                <div className="modal-actions" style={{ justifyContent: 'center', marginTop: '20px' }}>
                    <button className="btn-cancel" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
