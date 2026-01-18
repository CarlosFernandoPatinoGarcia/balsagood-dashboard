import axios from 'axios';

// Configuración por defecto
const DEFAULT_IP = '192.168.1.63';

// Función auxiliar para formatear la URL (asegura http/https)
// OJO: Si ya viene completa (Ej: https://api.com), la respeta.
const buildUrl = (input) => {
    let url = input.trim();
    // Si no empieza con http, asumimos http
    if (!url.startsWith('http')) {
        url = `http://${url}`;
    }
    // NOTA: Ya no agregamos puerto por defecto a ciegas, 
    // confiamos en que si el usuario guardó un "Full URL" o "IP+Puerto", viene correcto.
    // Solo si es una IP "pelada" antigua podría necesitarse, pero mejor ser explícitos.
    return url;
};

// 1. Intentamos leer la URL guardada (nuevo estándar) o la IP antigua (legacy)
const savedUrl = localStorage.getItem('API_URL') || localStorage.getItem('API_IP');
const initialBaseURL = savedUrl ? buildUrl(savedUrl) : buildUrl(DEFAULT_IP);

const api = axios.create({
    baseURL: initialBaseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = JSON.parse(localStorage.getItem('user'));
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 2. Función para guardar la nueva Configuración
export const configureApi = (fullUrl) => {
    try {
        const url = buildUrl(fullUrl);

        // Actualizamos la instancia de axios en caliente
        api.defaults.baseURL = url;

        // Guardamos en el almacenamiento local como API_URL (Estándar nuevo)
        localStorage.setItem('API_URL', url);
        // Limpiamos la key antigua para no causar conflictos futuros
        localStorage.removeItem('API_IP');

        console.log(`API apuntando a: ${url}`);
    } catch (e) {
        console.error("Error saving IP", e);
    }
};

// 3. Función de carga
export const loadApiConfiguration = () => {
    const savedUrl = localStorage.getItem('API_URL');
    if (savedUrl) {
        // Ya confiamos en que viene armada
        api.defaults.baseURL = savedUrl;
        return savedUrl;
    }
    // Fallback legacy
    const savedIp = localStorage.getItem('API_IP');
    if (savedIp) {
        const url = buildUrl(savedIp);
        configureApi(url); // Migrar a nuevo formato
        return url;
    }
    return DEFAULT_IP;
};

export default api;