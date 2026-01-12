import React from 'react';
// 1. Importas el CSS
import '../App.css';

const PageInventarioBloques = () => {
    return (
        // 2. Usas className con el nombre de la clase (sin "styles.")
        <div className="container">
            <div className="content">

                <div className="header">
                    <div>
                        <h1 className="header-title">Stock de Bloques</h1>
                        <p className="header-subtitle">Reporte Diario</p>
                    </div>
                </div>

                <div className="table-container">
                    <span className="table-title">Resumen General</span>

                    {/* Tabla HTML real usando las clases CSS */}
                    <table>
                        <thead>
                            <tr>
                                <th>Estado</th>
                                <th>Tipo</th>
                                <th>Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Verde</td>
                                <td>L</td>
                                <td>150</td>
                            </tr>
                            {/* Fila de totales */}
                            <tr className="total-row">
                                <td>TOTAL</td>
                                <td></td>
                                <td>150</td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    );
};
export default PageInventarioBloques;