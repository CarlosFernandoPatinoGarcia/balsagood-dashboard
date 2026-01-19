import React, { useEffect, useState } from 'react';
import api from '../api/Api';
import '../App.css';

import Icons from '../components/Icons';

export default function PageVistaProveedores() {
    const [proveedores, setProveedores] = useState([]);
    const [cargando, setCargando] = useState(false);

    // Estado para Modal, Edición y Ordenamiento
    const [modalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [nombre, setNombre] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'idProveedor', direction: 'asc' });

    const fetchProveedores = async () => {
        try {
            setCargando(true);
            const response = await Promise.all([
                api.get('/api/proveedores'),
                new Promise(resolve => setTimeout(resolve, 1000))
            ]);
            if (response[0].data) {
                setProveedores(response[0].data);
            }
        } catch (error) {
            console.error('Error fetching proveedores:', error);
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

    const sortedProveedores = React.useMemo(() => {
        let sorted = [...proveedores];
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
    }, [proveedores, sortConfig]);

    useEffect(() => {
        fetchProveedores();
    }, []);

    // --- Handlers CRUD ---

    const handleStartAdd = () => {
        setEditingId(null);
        setNombre('');
        setModalVisible(true);
    };

    const handleStartEdit = (provider) => {
        setEditingId(provider.idProveedor);
        setNombre(provider.provNombre);
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Está seguro de eliminar este proveedor?")) return;

        try {
            await api.delete(`/api/proveedores/${id}`);
            alert("Proveedor eliminado correctamente");
            fetchProveedores();
        } catch (error) {
            console.error("Error eliminando:", error);
            alert("Error al eliminar proveedor");
        }
    };

    const handleSave = async () => {
        if (!nombre.trim()) return alert("El nombre es obligatorio");

        try {
            const payload = { provNombre: nombre };

            if (editingId) {
                // Actualizar (PUT)
                await api.put(`/api/proveedores/${editingId}`, payload);
                alert("Proveedor actualizado");
            } else {
                // Crear (POST)
                await api.post('/api/proveedores', payload);
                alert("Proveedor creado");
            }

            setModalVisible(false);
            fetchProveedores();

        } catch (error) {
            console.error("Error guardando:", error);
            alert("Error al guardar proveedor");
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1 className="header-title">Listado de Proveedores</h1>
                    <span className="header-subtitle">
                        Total registrados: {proveedores.length}
                    </span>
                </div>
                <div className="header-actions">
                    <button onClick={fetchProveedores} className="btn-cancel" style={{ marginRight: 10 }}>
                        ↻ Refrescar
                    </button>

                    <button onClick={handleStartAdd} className="btn-save">
                        + Nuevo Proveedor
                    </button>
                </div>
            </header>

            <div className="table-container">
                {cargando ? (
                    <div className="loader-container">
                        <div className="planer-machine">
                            <div className="plank"></div>
                            <div className="cutter-head"></div>
                            <div className="wood-chips">
                                <div className="chip"></div>
                                <div className="chip"></div>
                                <div className="chip"></div>
                            </div>
                        </div>
                        <div className="loader-text">Procesando...</div>
                    </div>
                ) : (
                    <table className="custom-table" style={{ width: '100%', tableLayout: 'fixed' }}>
                        <thead>
                            <tr>
                                <th
                                    style={{ width: '80px', backgroundColor: '#f4f6f8', cursor: 'pointer' }}
                                    onClick={() => handleSort('idProveedor')}
                                >
                                    ID {sortConfig.key === 'idProveedor' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                                </th>
                                <th
                                    style={{ backgroundColor: '#e3f2fd', color: '#1565c0', cursor: 'pointer' }}
                                    onClick={() => handleSort('provNombre')}
                                >
                                    Nombre del Proveedor {sortConfig.key === 'provNombre' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                                </th>
                                <th style={{ width: '150px', backgroundColor: '#f4f6f8' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedProveedores.map(p => (
                                <tr key={p.idProveedor}>
                                    <td style={{ fontWeight: 'bold' }}>{p.idProveedor}</td>
                                    <td>{p.provNombre}</td>
                                    <td>
                                        <button
                                            className="btn-add-icon"
                                            onClick={() => handleStartEdit(p)}
                                            title="Editar"
                                        >
                                            <Icons.Edit />
                                        </button>
                                        <button
                                            className="btn-delete-icon"
                                            onClick={() => handleDelete(p.idProveedor)}
                                            title="Eliminar"

                                        >
                                            <Icons.Delete />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal Formulario */}
            {modalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">
                            {editingId ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                        </h2>

                        <div className="form-group">
                            <label>Nombre:</label>
                            <input
                                type="text"
                                className="form-input"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Nombre completo"
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