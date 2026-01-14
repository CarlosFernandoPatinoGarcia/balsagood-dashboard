import React, { useEffect, useState } from 'react';
import api from '../api/Api';
import '../App.css';

export default function PageVistaCamarasSecado() {
    const [camarasSecado, setCamarasSecado] = useState([]);
    const [cargando, setCargando] = useState(false);

    // Estado CRUD
    const [modalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [descripcion, setDescripcion] = useState('');
    const [capacidad, setCapacidad] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'idCamara', direction: 'asc' });

    const fetchCamarasSecado = async () => {
        try {
            setCargando(true);
            const response = await api.get('/api/camaras');
            if (response.data) {
                setCamarasSecado(response.data);
            }
        } catch (error) {
            console.error('Error cargando camaras de secado:', error);
        } finally {
            setCargando(false);
        }
    };

    // Lógica de Ordenamiento
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedCamaras = React.useMemo(() => {
        let sorted = [...camarasSecado];
        if (sortConfig.key) {
            sorted.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sorted;
    }, [camarasSecado, sortConfig]);

    useEffect(() => {
        fetchCamarasSecado();
    }, []);

    // --- Handlers CRUD ---
    const handleStartAdd = () => {
        setEditingId(null);
        setDescripcion('');
        setCapacidad('');
        setModalVisible(true);
    };

    const handleStartEdit = (camara) => {
        setEditingId(camara.idCamara);
        setDescripcion(camara.camaraDescripcion);
        setCapacidad(camara.camaraCapacidad);
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Confirma eliminar esta cámara de secado?")) return;
        try {
            await api.delete(`/api/camaras/${id}`);
            alert("Cámara eliminada");
            fetchCamarasSecado();
        } catch (error) {
            console.error(error);
            alert("Error al eliminar la cámara");
        }
    };

    const handleSave = async () => {
        if (!descripcion || !capacidad) return alert("Complete los campos");

        const payload = {
            camaraDescripcion: descripcion,
            camaraCapacidad: parseInt(capacidad, 10)
        };

        try {
            if (editingId) {
                await api.put(`/api/camaras/${editingId}`, payload);
                alert("Cámara actualizada");
            } else {
                await api.post('/api/camaras', payload);
                alert("Cámara creada");
            }
            setModalVisible(false);
            fetchCamarasSecado();
        } catch (error) {
            console.error(error);
            alert("Error al guardar");
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1 className="header-title">Listado de Camaras de Secado</h1>
                    <span className="header-subtitle">
                        Total registrados: {camarasSecado.length}
                    </span>
                </div>
                <div className="header-actions">
                    <button onClick={fetchCamarasSecado} className="btn-cancel" style={{ marginRight: 10 }}>
                        ↻ Refrescar
                    </button>
                    <button onClick={handleStartAdd} className="btn-save">
                        + Nueva Cámara
                    </button>
                </div>
            </header>

            <div className="table-container">
                <table className="custom-table" style={{ width: '100%', tableLayout: 'fixed' }}>
                    <thead>
                        <tr>
                            <th
                                style={{ width: '80px', backgroundColor: '#f4f6f8', cursor: 'pointer' }}
                                onClick={() => handleSort('idCamara')}
                            >
                                ID {sortConfig.key === 'idCamara' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                            </th>
                            <th
                                style={{ backgroundColor: '#e3f2fd', color: '#1565c0', cursor: 'pointer' }}
                                onClick={() => handleSort('camaraDescripcion')}
                            >
                                Descripcion {sortConfig.key === 'camaraDescripcion' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                            </th>
                            <th
                                style={{ backgroundColor: '#e3f2fd', color: '#1565c0', cursor: 'pointer' }}
                                onClick={() => handleSort('camaraCapacidad')}
                            >
                                Capacidad {sortConfig.key === 'camaraCapacidad' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                            </th>
                            <th style={{ backgroundColor: '#e3f2fd', color: '#1565c0' }}>Disponible</th>
                            <th style={{ width: '150px', backgroundColor: '#f4f6f8' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedCamaras.map(c => (
                            <tr key={c.idCamara}>
                                <td style={{ fontWeight: 'bold' }}>{c.idCamara}</td>
                                <td>{c.camaraDescripcion}</td>
                                <td>{c.camaraCapacidad}</td>
                                <td>{c.capacidadDisponible}</td>
                                <td>
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleStartEdit(c)}
                                        title="Editar"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleDelete(c.idCamara)}
                                        title="Eliminar"
                                        style={{ color: 'red' }}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">
                            {editingId ? 'Editar Cámara' : 'Nueva Cámara'}
                        </h2>

                        <div className="form-group">
                            <label>Descripción / Nombre:</label>
                            <input
                                type="text"
                                className="form-input"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                placeholder="Ej. Cámara A"
                            />
                        </div>

                        <div className="form-group">
                            <label>Capacidad Total:</label>
                            <input
                                type="number"
                                className="form-input"
                                value={capacidad}
                                onChange={(e) => setCapacidad(e.target.value)}
                                placeholder="0"
                            />
                        </div>

                        <div className="modal-actions">
                            <button
                                className="btn-cancel"
                                onClick={() => setModalVisible(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn-save"
                                onClick={handleSave}
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}