import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { loadApiConfiguration } from './api/Api';
import AppNavigator from './Route/Routes';
import './App.css';

export default function App() {

  useEffect(() => {
    // Cargar configuración de IP al iniciar la app
    loadApiConfiguration();
    document.title = "Balsagood Dashboard";
  }, []);

  return (
    <BrowserRouter>
      {/* Contenedor principal de la aplicación */}
      <div className="app-root">
        <AppNavigator />
      </div>
    </BrowserRouter>
  );
}