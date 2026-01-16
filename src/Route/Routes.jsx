import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Importación de Vistas (Pages)
import PageMainView from '../pages/PageMainView';
import PageVistaCamarasSecado from '../pages/PageVistaCamarasSecado';
import PageInventarioPallets from '../pages/PageInventarioPallets';
import PageInventarioBloques from '../pages/PageInventarioBloques';
import PageVistaRecepcionesMV from '../pages/PageVistaRecepcionesMV';
import PageVistaProveedores from '../pages/PageVistaProveedores';
import PageVistaConfiguracion from '../pages/PageVistaConfiguracion';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Ruta Principal (Dashboard) */}
            <Route path="/" element={<PageMainView />} />
            <Route path="/dashboard" element={<PageMainView />} />

            {/* Rutas de Reportes y Tablas */}
            <Route path="/proveedores" element={<PageVistaProveedores />} />
            <Route path="/camaras-de-secado" element={<PageVistaCamarasSecado />} />
            <Route path="/inventario-pallets" element={<PageInventarioPallets />} />
            <Route path="/inventario-bloques" element={<PageInventarioBloques />} />
            <Route path="/recepciones" element={<PageVistaRecepcionesMV />} />
            <Route path="/configuracion" element={<PageVistaConfiguracion />} />

            {/* Redirección por defecto */}
            {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
    );
};

export default AppRoutes;