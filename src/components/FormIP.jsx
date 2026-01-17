import { useState, useEffect } from 'react';
import axios from 'axios';
import { configureApi } from '../api/Api';
import './FormIP.css'; // Import custom styles

const FormIP = ({ onClose }) => {
    // Estados
    const [mode, setMode] = useState('ip'); // 'ip' | 'url'
    const [protocol, setProtocol] = useState('http');
    const [ip, setIp] = useState('');
    const [port, setPort] = useState('8080');
    const [fullUrl, setFullUrl] = useState('');

    useEffect(() => {
        // Read from the new standard key first, fallback to legacy or default
        const savedUrl = localStorage.getItem('API_URL') || localStorage.getItem('API_IP') || 'http://localhost:8080';

        let urlInternal = savedUrl;
        if (!urlInternal.startsWith('http')) {
            urlInternal = `http://${urlInternal}`;
        }

        setFullUrl(urlInternal);

        const match = urlInternal.match(/^(https?):\/\/([^:/]+)(?::(\d+))?$/);

        if (match) {
            setProtocol(match[1]); // http o https
            setIp(match[2]);       // 192.168.1.50
            setPort(match[3] || ''); // 8080 (o vacío)
            setMode('ip');
        } else {
            setMode('url');
        }
    }, []);

    const handleSave = () => {
        let finalUrl = '';
        if (mode === 'ip') {
            if (!ip) return alert("Ingresa una IP");
            // Construimos la URL manualmente
            finalUrl = `${protocol}://${ip.trim()}${port ? ':' + port.trim() : ''}`;
        } else {
            if (!fullUrl) return alert("Ingresa una URL");
            finalUrl = fullUrl.trim();
        }

        configureApi(finalUrl);

        alert(`Guardado: ${finalUrl}`);
        if (onClose) onClose();
    };

    return (
        <div className="form-ip-container">
            <h3 className="modal-title">Configuración de API</h3>

            {/* Toggle Modos */}
            <div className="ip-mode-toggle">
                <button
                    onClick={() => setMode('ip')}
                    className={`toggle-btn ${mode === 'ip' ? 'active' : ''}`}
                >
                    Modo IP
                </button>
                <button
                    onClick={() => setMode('url')}
                    className={`toggle-btn ${mode === 'url' ? 'active' : ''}`}
                >
                    URL Completa
                </button>
            </div>

            {mode === 'ip' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div className="form-row">
                        <div className="form-col" style={{ flex: '0 0 80px' }}>
                            <label>Protocolo</label>
                            <select
                                className="form-input"
                                value={protocol}
                                onChange={(e) => setProtocol(e.target.value)}
                            >
                                <option value="http">HTTP</option>
                                <option value="https">HTTPS</option>
                            </select>
                        </div>
                        <div className="form-col">
                            <label>IP / Host</label>
                            <input
                                className="form-input"
                                placeholder="Ej. 192.168.1.50"
                                value={ip}
                                onChange={(e) => setIp(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-col">
                        <label>Puerto</label>
                        <input
                            className="form-input"
                            placeholder="Ej. 8080"
                            value={port}
                            onChange={(e) => setPort(e.target.value)}
                        />
                    </div>
                </div>
            ) : (
                <div className="form-group">
                    <label>URL Completa</label>
                    <input
                        className="form-input"
                        placeholder="https://api.midominio.com/v1"
                        value={fullUrl}
                        onChange={(e) => setFullUrl(e.target.value)}
                    />
                </div>
            )}

            <button
                onClick={handleSave}
                className="btn-save btn-full"
            >
                Guardar Conexión
            </button>
        </div>
    );
};

export default FormIP;
