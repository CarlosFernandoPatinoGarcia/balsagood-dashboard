import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { loadApiConfiguration } from './api/Api';
import AppNavigator from './Route/Routes';
import './App.css';

import Layout from './components/Layout';

function App() {

  useEffect(() => {
    // Cargar configuración de IP al iniciar la app
    loadApiConfiguration();
    document.title = "Balsagood Dashboard";
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <AppNavigator />
      </Layout>
    </BrowserRouter>
  );
}

export default App;