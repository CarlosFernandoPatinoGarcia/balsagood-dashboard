import React, { useState, useEffect, useRef } from 'react';
import api from '../api/Api';
import '../App.css';
import Icons from '../components/Icons';

const LARGO_OPTIONS = [25, 24, 23, 22, 21, 20, 18, 16, 14, 12, 10, 8, 6];

const PageVistaBloques = () => {
    // Estado de datos y paginación
    const [bloques, setBloques] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [estadoFiltro, setEstadoFiltro] = useState('EN'); // Default "EN"

    // Estado del formulario de edición
    const [indiceEditando, setIndiceEditando] = useState(null); // ID del bloque siendo editado (o null)
    const [formData, setFormData] = useState({
        bloqueCodigo: '',
        bloqueLargo: '',
        bloquePesoSinCola: '',
        bloquePesoConCola: '',
        tipoMaderaId: 1
    });

    const largoInputRef = useRef(null);

    // Constantes
    const CONSTANT_ANCHO = 50.0;
    const CONSTANT_ALTO = 25.0;

    // Cargar datos al montar o cambiar página/filtros
    useEffect(() => {
        fetchBloques();
    }, [page, pageSize, estadoFiltro]);

    const fetchBloques = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/bloques/paginated', {
                params: {
                    estado: estadoFiltro,
                    page: page, // 0-indexed
                    size: pageSize
                }
            });
            // Asumiendo estructura de respuesta Page<BloqueDTO>: { content: [], totalPages: N, ... }
            if (response.data && response.data.content) {
                setBloques(response.data.content);
                setTotalPages(response.data.totalPages);
            } else {
                // Fallback si la estructura es diferente (ej. lista directa)
                setBloques(response.data || []);
                setTotalPages(1);
            }
        } catch (error) {
            console.error("Error cargando bloques paginados:", error);
            // alert("Error cargando datos.");
        } finally {
            setLoading(false);
        }
    };

    // Funciones del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const calculateBft = (largo) => {
        return largo ? parseFloat(largo) * 8 : 0;
    };

    const cargarBloqueParaEditar = (bloque) => {
        // Preferimos el ID de base de datos para el endpoint PUT /api/bloques/{id}
        // Si no viene id, fallamos a bloqueCodigo pero podría no funcionar si el backend espera ID numérico PK
        setIndiceEditando(bloque.idBloque || bloque.bloqueCodigo);
        setFormData({
            bloqueCodigo: bloque.bloqueCodigo,
            bloqueLargo: bloque.bloqueLargo,
            bloquePesoSinCola: bloque.bloquePesoSinCola,
            bloquePesoConCola: bloque.bloquePesoConCola || '',
            tipoMaderaId: bloque.tipoMadera?.idTipoMadera || 1
        });
        if (largoInputRef.current) {
            largoInputRef.current.focus();
        }
    };

    const cancelarEdicion = () => {
        setIndiceEditando(null);
        setFormData({
            bloqueCodigo: '',
            bloqueLargo: '',
            bloquePesoSinCola: '',
            bloquePesoConCola: '',
            tipoMaderaId: 1
        });
    };

    const handleUpdateBloque = async (e) => {
        e.preventDefault();
        if (!indiceEditando) return;

        // Construir payload
        const largo = parseFloat(formData.bloqueLargo);
        // Validación de rango (6 - 25)
        if (largo < 6 || largo > 25) {
            alert("El largo debe estar entre 6 y 25.");
            return;
        }

        const bloqueUpdate = {
            bloqueCodigo: formData.bloqueCodigo, // Mantener código original
            tipoMadera: { idTipoMadera: parseInt(formData.tipoMaderaId) },
            bloqueLargo: largo,
            bloqueAncho: CONSTANT_ANCHO,
            bloqueAlto: CONSTANT_ALTO,
            bloqueBftFinal: calculateBft(largo),
            bloquePesoSinCola: parseFloat(formData.bloquePesoSinCola),
            bloquePesoConCola: formData.bloquePesoConCola ? parseFloat(formData.bloquePesoConCola) : null,
            // Estado y Orden de Taller ignorados/asignados por backend
        };

        console.log("Indice editando: ", indiceEditando);
        console.log("Bloque update: ", bloqueUpdate);
        try {
            // Usamos PUT /api/bloques/{id} como especificó el usuario
            await api.put(`/api/bloques/${indiceEditando}`, bloqueUpdate);

            alert("Bloque actualizado correctamente");
            fetchBloques(); // Recargar tabla
            cancelarEdicion();

        } catch (error) {
            console.error("Error actualizando bloque:", error);
            alert("Error al actualizar el bloque.");
        }
    };

    const fmtNum = (num) => num ? num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-';

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1 className="header-title">Gestión de Bloques (CRUD)</h1>
                    <span className="header-subtitle">Vista y Edición de Bloques Paginados</span>
                </div>
                <div className="header-actions">
                    <select
                        className="form-input"
                        value={pageSize}
                        onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
                        style={{ width: 'auto', marginRight: '10px' }}
                    >
                        <option value="5">5 por pág</option>
                        <option value="10">10 por pág</option>
                        <option value="20">20 por pág</option>
                        <option value="50">50 por pág</option>
                    </select>

                    <select
                        className="form-input"
                        value={estadoFiltro}
                        onChange={(e) => { setEstadoFiltro(e.target.value); setPage(0); }}
                        style={{ width: 'auto' }}
                    >
                        <option value="EN">Encolados (EN)</option>
                        <option value="PR">Presentados (PR)</option>
                        {/* Agregar más estados si existen */}
                    </select>
                </div>
            </header>

            <div style={{ display: 'flex', gap: '20px', flexDirection: 'row', alignItems: 'start' }}>

                {/* Panel Izquierdo: Formulario de Edición */}
                <div style={{
                    flex: '1',
                    backgroundColor: 'var(--card)',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    maxWidth: '300px'
                }}>
                    <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '20px' }}>
                        {indiceEditando ? 'Editar Bloque ' + formData.bloqueCodigo : 'Detalle'}
                    </h2>

                    {indiceEditando ? (
                        <form onSubmit={handleUpdateBloque}>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label>N° Bloque</label>
                                <input
                                    type="number"
                                    value={formData.bloqueCodigo}
                                    className="form-input"
                                    disabled
                                    style={{ background: '#f5f5f5' }}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label>Largo - pulg</label>
                                <input
                                    ref={largoInputRef}
                                    type="number"
                                    name="bloqueLargo"
                                    list="largo-options-crud"
                                    value={formData.bloqueLargo}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    step="any"
                                    required
                                />
                                <datalist id="largo-options-crud">
                                    {LARGO_OPTIONS.map((val) => (
                                        <option key={val} value={val} />
                                    ))}
                                </datalist>
                            </div>

                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label>Peso Sin Cola - Kg</label>
                                <input
                                    type="number"
                                    name="bloquePesoSinCola"
                                    value={formData.bloquePesoSinCola}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    step="any"
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label>Peso Con Cola - Kg</label>
                                <input
                                    type="number"
                                    name="bloquePesoConCola"
                                    value={formData.bloquePesoConCola}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    step="any"
                                    required
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label>Tipo de Madera</label>
                                <select
                                    name="tipoMaderaId"
                                    value={formData.tipoMaderaId}
                                    onChange={handleInputChange}
                                    className="form-input"
                                >
                                    <option value="1">Liviana</option>
                                    <option value="2">Pesada</option>
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label>Volumen - BFT</label>
                                <input
                                    type="number"
                                    value={calculateBft(formData.bloqueLargo).toFixed(2)}
                                    disabled
                                    className="form-input"
                                    style={{ background: '#f5f5f5' }}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-save"
                                style={{ width: '100%', backgroundColor: '#f39c12', marginBottom: '10px' }}
                            >
                                Guardar Cambios
                            </button>
                            <button
                                type="button"
                                onClick={cancelarEdicion}
                                className="btn-cancel"
                                style={{ width: '100%' }}
                            >
                                Cancelar
                            </button>
                        </form>
                    ) : (
                        <div style={{ color: '#666', fontStyle: 'italic' }}>
                            Seleccione un bloque de la tabla para editar sus datos.
                        </div>
                    )}
                </div>

                {/* Panel Derecho: Tabla Paginada */}
                <div style={{
                    flex: '2',
                    backgroundColor: 'var(--card)',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 className="section-title" style={{ margin: 0 }}>Bloques ({bloques.length})</h2>

                        {/* Controles de Paginación */}
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <button
                                className="btn-save"
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0 || loading}
                                style={{ padding: '5px 10px', fontSize: '14px', backgroundColor: page === 0 ? '#ccc' : 'var(--primary)' }}
                            >
                                Anterior
                            </button>
                            <span>Página {page + 1} de {totalPages || 1}</span>
                            <button
                                className="btn-save"
                                onClick={() => setPage(p => (p + 1 < totalPages ? p + 1 : p))}
                                disabled={page >= totalPages - 1 || loading}
                                style={{ padding: '5px 10px', fontSize: '14px', backgroundColor: page >= totalPages - 1 ? '#ccc' : 'var(--primary)' }}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>

                    <div className="table-container" style={{ boxShadow: 'none', padding: 0, border: 'none', marginBottom: 0 }}>
                        {loading ? (
                            <div style={{ padding: '20px', textAlign: 'center' }}>Cargando datos...</div>
                        ) : (
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Largo</th>
                                        <th>Tipo</th>
                                        <th>P. Sin Cola</th>
                                        <th>P. Con Cola</th>
                                        <th>Volumen</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bloques.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="empty-row">No se encontraron datos.</td>
                                        </tr>
                                    ) : (
                                        bloques.map((item) => (
                                            <tr key={item.id || item.bloqueCodigo} style={{ backgroundColor: indiceEditando === (item.bloqueCodigo || item.id) ? '#fef9e7' : 'transparent' }}>
                                                <td>{item.bloqueCodigo}</td>
                                                <td>{fmtNum(item.bloqueLargo)}</td>
                                                <td>{item.tipoMadera?.descripcion || (item.tipoMadera?.idTipoMadera === 1 ? 'L' : 'P')}</td>
                                                <td>{fmtNum(item.bloquePesoSinCola)}</td>
                                                <td>{fmtNum(item.bloquePesoConCola)}</td>
                                                <td>{fmtNum(item.bloqueBftFinal)}</td>
                                                <td>{item.estado}</td>
                                                <td>
                                                    <button
                                                        className="btn-icon"
                                                        onClick={() => cargarBloqueParaEditar(item)}
                                                        title="Editar"
                                                    >
                                                        <Icons.Edit />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageVistaBloques;
