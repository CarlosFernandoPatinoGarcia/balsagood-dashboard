import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Importación de Vistas (Pages)
import PageMainView from '../pages/PageMainView';
import PageVistaCamarasSecado from '../pages/PageVistaCamarasSecado';
import PageInventarioPallets from '../pages/PageInventarioPallets';
import PageInventarioBloques from '../pages/PageInventarioBloques';
import PageVistaRecepcionesMV from '../pages/PageVistaRecepcionesMV';
import PageDetallePalletsSecos from '../pages/PageDetallePalletsSecos';
import PageVistaProveedores from '../pages/PageVistaProveedores';
import PageVistaConfiguracion from '../pages/PageVistaConfiguracion';
import PageDetalleBloquesDespachados from '../pages/PageDetalleBloquesDespachados';
import PrivateRoute from '../Route/PrivateRoute';
import PageRegister from '../auth/PageRegister';
import PageLogin from '../auth/PageLogin';

import Layout from '../components/Layout';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Ruta de Login */}
            <Route path="/login" element={<PageLogin />} />
            {/* Ruta de Registro */}
            <Route path="/register" element={<PageRegister />} />
            {/* Ruta Principal (Dashboard) */}
            <Route element={<PrivateRoute />}>
                <Route element={<Layout><Outlet /></Layout>}>
                    <Route path="/" element={<PageMainView />} />
                    <Route path="/dashboard" element={<PageMainView />} />

                    {/* Rutas de Reportes y Tablas */}
                    <Route path="/proveedores" element={<PageVistaProveedores />} />
                    <Route path="/camaras-de-secado" element={<PageVistaCamarasSecado />} />
                    <Route path="/inventario-pallets" element={<PageInventarioPallets />} />
                    <Route path="/inventario-bloques" element={<PageInventarioBloques />} />
                    <Route path="/bloques-despachados" element={<PageDetalleBloquesDespachados />} />
                    <Route path="/recepciones" element={<PageVistaRecepcionesMV />} />
                    <Route path="/pallets-secos" element={<PageDetallePalletsSecos />} />
                    <Route path="/configuracion" element={<PageVistaConfiguracion />} />
                </Route>
            </Route>


        </Routes>
    );
};

export default AppRoutes;