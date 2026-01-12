import axios from 'axios';

// Configuración por defecto
const DEFAULT_IP = '192.168.1.63';

// Función auxiliar para formatear la URL (http + puerto)
const buildUrl = (ip) => {
    let url = ip.trim();
    if (!url.startsWith('http')) {
        url = `http://${url}`;
    }
    // Si no tiene puerto explícito, agregamos :8080
    if ((url.match(/:/g) || []).length < 2) {
        url = `${url}:8080`;
    }
    return url;
};

// 1. Intentamos leer la IP guardada en el navegador al iniciar
const savedIp = localStorage.getItem('API_IP');
const initialBaseURL = savedIp ? buildUrl(savedIp) : buildUrl(DEFAULT_IP);

const api = axios.create({
    baseURL: initialBaseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Función para guardar la nueva IP (Reemplaza a AsyncStorage)
export const configureApi = (ip) => {
    try {
        const url = buildUrl(ip);

        // Actualizamos la instancia de axios en caliente
        api.defaults.baseURL = url;

        // Guardamos en el almacenamiento local del navegador
        localStorage.setItem('API_IP', ip.trim());

        console.log(`API apuntando a: ${url}`);
    } catch (e) {
        console.error("Error saving IP", e);
    }
};

// 3. Función de carga (En web es síncrono, ya no requiere async/await)
export const loadApiConfiguration = () => {
    const savedIp = localStorage.getItem('API_IP');
    if (savedIp) {
        configureApi(savedIp);
        return savedIp;
    }
    return DEFAULT_IP;
};

export default api;