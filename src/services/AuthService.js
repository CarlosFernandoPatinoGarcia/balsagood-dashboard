import api from '../api/Api';

const SESSION_DURATION = 3600000; // 1 Hora en milisegundos

const login = async (usuarioNombre, usuarioClave) => {
    // Uses relative path, respects Api.jsx baseURL
    const response = await api.post('/api/auth/login', {
        usuarioNombre,
        usuarioClave,
    });
    if (response.data) {
        // Fix: If response.data is a string (JWT), wrap it. 
        // Spreading a string (...response.data) causes the {0:'e', 1:'y'} bug.
        const userData = typeof response.data === 'string'
            ? { token: response.data }
            : { ...response.data };

        const userWithExpiry = {
            ...userData,
            expiry: Date.now() + SESSION_DURATION
        };
        localStorage.setItem('user', JSON.stringify(userWithExpiry));
    }
    return response.data;
};

const register = async (usuarioNombre, usuarioClave) => {
    const response = await api.post('/api/auth/register', {
        usuarioNombre,
        usuarioClave,
    });
    if (response.data) {
        // Fix: If response.data is a string (JWT), wrap it.
        const userData = typeof response.data === 'string'
            ? { token: response.data }
            : { ...response.data };

        const userWithExpiry = {
            ...userData,
            expiry: Date.now() + SESSION_DURATION
        };
        localStorage.setItem('user', JSON.stringify(userWithExpiry));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    const user = JSON.parse(userStr);
    if (user.expiry && Date.now() > user.expiry) {
        logout();
        return null;
    }
    return user;
};

const AuthService = {
    login,
    register,
    logout,
    getCurrentUser,
};

export default AuthService;