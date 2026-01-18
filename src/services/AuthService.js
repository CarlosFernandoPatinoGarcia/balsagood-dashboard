import api from '../api/Api';

const login = async (usuarioNombre, usuarioClave) => {
    // Uses relative path, respects Api.jsx baseURL
    const response = await api.post('/api/auth/login', {
        usuarioNombre,
        usuarioClave,
    });
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const register = async (usuarioNombre, usuarioClave) => {
    const response = await api.post('/api/auth/register', {
        usuarioNombre,
        usuarioClave,
    });
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const AuthService = {
    login,
    register,
    logout,
    getCurrentUser,
};

export default AuthService;