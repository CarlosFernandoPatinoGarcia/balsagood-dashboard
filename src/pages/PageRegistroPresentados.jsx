import React, { useState, useRef, useEffect } from 'react';
import api from '../api/Api';
import '../App.css';

import Icons from '../components/Icons';

const LARGO_OPTIONS = [25, 24, 23, 22, 21, 20, 18, 16, 14, 12, 10, 8, 6];

const PageRegistroPresentados = () => {
    // Lista de bloques acumulados para enviar en lote (Payload)
    const [listaBloquesPendientes, setListaBloquesPendientes] = useState([]);

    // Estado del formulario
    const [formData, setFormData] = useState({
        bloqueLargo: '',
        bloquePesoSinCola: '',
        bloquePesoConCola: '',
        tipoMaderaId: 1 // Por defecto ID 1, cambiado por el usuario si es necesario
    });

    const [ultimoCodigo, setUltimoCodigoBloque] = useState(0);
    async function cargarUltimoCodigoBloque() {
        try {
            const response = await api.get('/api/bloques/ultimo-codigo');
            const ultimoCodigo = response.data;
            console.log("Último código de bloque:", ultimoCodigo);
            setConteoBloque(ultimoCodigo + 1);
            setUltimoCodigoBloque(ultimoCodigo);
        } catch (error) {
            console.error("Error al cargar el último código de bloque:", error);
        }
    }

    useEffect(() => {
        cargarUltimoCodigoBloque();
    }, []);

    // Contador local para el codigoBloque (autonumérico en la sesión)
    const [conteoBloque, setConteoBloque] = useState(1);
    const [loading, setLoading] = useState(false);

    // Estado para la edición
    const [indiceEditando, setIndiceEditando] = useState(null); // null si no se está editando

    // Ref para el input de Largo
    const largoInputRef = useRef(null);

    // Constantes definidas por requerimiento
    const CONSTANT_ANCHO = 50.0;
    const CONSTANT_ALTO = 25.0;



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Calculo automatico: Largo * 8
    const calculateBft = (largo) => {
        return largo ? parseFloat(largo) * 8 : 0;
    };

    const agregarActualizarBloqueALista = (e) => {
        e.preventDefault();

        if (!formData.bloqueLargo || !formData.bloquePesoSinCola) {
            alert("El largo y el peso sin cola son obligatorios.");
            return;
        }

        const largo = parseFloat(formData.bloqueLargo);

        // Validación de rango (6 - 25)
        if (largo < 6 || largo > 25) {
            alert("El largo debe estar entre 6 y 25.");
            return;
        }

        const pesoSinCola = parseFloat(formData.bloquePesoSinCola);
        const pesoConCola = formData.bloquePesoConCola ? parseFloat(formData.bloquePesoConCola) : null;

        const bloqueData = {
            bloqueCodigo: conteoBloque, // Puede ser el editado o uno nuevo
            tipoMadera: {
                idTipoMadera: parseInt(formData.tipoMaderaId)
            },
            bloqueLargo: largo,
            bloqueAncho: CONSTANT_ANCHO,
            bloqueAlto: CONSTANT_ALTO,
            bloqueBftFinal: calculateBft(largo),
            bloquePesoSinCola: pesoSinCola,
            bloquePesoConCola: pesoConCola, // Opcional
        };

        if (indiceEditando !== null) {
            // ACTUALIZAR REGISTRO EXISTENTE
            const nuevaLista = [...listaBloquesPendientes];
            nuevaLista[indiceEditando] = bloqueData;
            setListaBloquesPendientes(nuevaLista);
            setIndiceEditando(null); // Salir modo edición

            // Al terminar de editar, restauramos contador
            const maxCodigo = Math.max(...nuevaLista.map(b => parseInt(b.bloqueCodigo)), 0);
            setConteoBloque(maxCodigo + 1);

            // Limpiar TODO el formulario al terminar edición
            setFormData({
                ...formData,
                bloqueLargo: '',
                bloquePesoSinCola: '',
                bloquePesoConCola: ''
            });

        } else {
            // AGREGAR NUEVO REGISTRO
            setListaBloquesPendientes([...listaBloquesPendientes, bloqueData]);
            setConteoBloque(prev => (parseInt(prev) || 0) + 1);

            // Limpiar formulario excepto LARGO para facilitar entrada continua
            setFormData({
                ...formData,
                // bloqueLargo se mantiene
                bloquePesoSinCola: '',
                bloquePesoConCola: ''
            });
        }

        // Focus en el campo Largo
        if (largoInputRef.current) {
            largoInputRef.current.focus();
        }
    };

    const cargarDatosParaEditar = (item, index) => {
        setIndiceEditando(index);
        setConteoBloque(item.bloqueCodigo);
        setFormData({
            bloqueLargo: item.bloqueLargo,
            bloquePesoSinCola: item.bloquePesoSinCola,
            bloquePesoConCola: item.bloquePesoConCola || '',
            tipoMaderaId: item.tipoMadera.idTipoMadera
        });

        if (largoInputRef.current) {
            largoInputRef.current.focus();
        }
    };



    const registrarBloquesBackend = async () => {
        if (listaBloquesPendientes.length === 0) {
            alert("No hay bloques en la lista para registrar.");
            return;
        }

        const payload = listaBloquesPendientes;
        console.log("PAYLOAD ENVIADO AL BACKEND:", JSON.stringify(payload, null, 2));

        setLoading(true);
        try {
            await api.post('/api/proceso/bloques-presentados', payload);
            alert("Bloques registrados correctamente.");
            setListaBloquesPendientes([]);
            setConteoBloque(1); // Reiniciar para nueva tanda

            // Limpiar formulario completo tras guardado exitoso
            setFormData({
                bloqueLargo: '',
                bloquePesoSinCola: '',
                bloquePesoConCola: '',
                tipoMaderaId: 1
            });
        } catch (error) {
            console.error("Error registrando bloques:", error);
            alert("Error al registrar los bloques. Revise la consola.");
        } finally {
            setLoading(false);
        }
    };

    const fmtNum = (num) => num ? num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-';

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1 className="header-title">Registro de Bloques Presentados</h1>
                    <span className="header-subtitle">Ingrese los datos del bloque y agréguelo a la lista. Confirmar para enviar al servidor.</span>
                </div>
                <div className="header-actions">
                    <h1 className="header-title">Bloques en Lista: {listaBloquesPendientes.length}</h1>
                </div>
            </header>

            <div style={{ display: 'flex', gap: '20px', flexDirection: 'row', alignItems: 'start' }}>

                {/* Panel Izquierdo: Formulario */}
                <div style={{
                    flex: '1',
                    backgroundColor: 'var(--card)',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    maxWidth: '250px'
                }}>
                    <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '20px' }}>
                        {indiceEditando !== null ? 'Editar Bloque' : '+ Registrar Bloques'}
                    </h2>
                    <form onSubmit={agregarActualizarBloqueALista}>
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label>N° Bloque (Manual/Auto)</label>
                            <input
                                type="number"
                                value={conteoBloque}
                                onChange={(e) => setConteoBloque(e.target.value)}
                                className="form-input"
                                placeholder="Ej: 1234"
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label>Largo - pulg</label>
                            <input
                                ref={largoInputRef}
                                type="number"
                                name="bloqueLargo"
                                list="largo-options"
                                value={formData.bloqueLargo}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="Seleccione o ingrese"
                                step="any"
                                required
                            />
                            <datalist id="largo-options">
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
                                placeholder="Ej: 56"
                                step="any"
                                required
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label>Peso Con Cola - Kg (Opcional)</label>
                            <input
                                type="number"
                                name="bloquePesoConCola"
                                value={formData.bloquePesoConCola}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="Ej: 60"
                                step="any"
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
                                type="text"
                                value={calculateBft(formData.bloqueLargo).toFixed(2)}
                                disabled
                                className="form-input"
                                style={{ background: '#f5f5f5' }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-save"
                            style={{ width: '100%', backgroundColor: indiceEditando !== null ? '#f39c12' : 'var(--primary)' }}
                        >
                            {indiceEditando !== null ? 'Actualizar Bloque' : 'Agregar a la Lista'}
                        </button>

                        {indiceEditando !== null && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIndiceEditando(null);
                                    // Restaurar contador al max + 1
                                    const maxCodigo = listaBloquesPendientes.length > 0 ? Math.max(...listaBloquesPendientes.map(b => parseInt(b.bloqueCodigo)), 0) : 0;
                                    setConteoBloque(maxCodigo + 1);
                                    setFormData({
                                        ...formData,
                                        bloqueLargo: '',
                                        bloquePesoSinCola: '',
                                        bloquePesoConCola: ''
                                    });
                                }}
                                className="btn-cancel"
                                style={{ width: '100%', marginTop: '10px' }}
                            >
                                Cancelar Edición
                            </button>
                        )}
                    </form>
                </div>

                {/* Panel Derecho: Tabla */}
                <div style={{
                    flex: '2',
                    backgroundColor: 'var(--card)',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 className="section-title" style={{ textAlign: 'left', margin: 0 }}>Bloques Registrados</h2>
                        {listaBloquesPendientes.length > 0 && (
                            <button
                                onClick={registrarBloquesBackend}
                                className="btn-save"
                                disabled={loading}
                                style={{ backgroundColor: '#28a745' }}
                            >
                                {loading ? 'Enviando...' : 'Confirmar Todo'}
                            </button>
                        )}
                    </div>

                    <div className="table-container" style={{ boxShadow: 'none', padding: 0, border: 'none', marginBottom: 0 }}>
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Largo</th>
                                    <th>Ancho</th>
                                    <th>Alto</th>
                                    <th>P. Sin Cola</th>
                                    <th>P. Con Cola</th>
                                    <th>Volumen</th>
                                    <th>Tipo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaBloquesPendientes.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="empty-row">
                                            No hay bloques en la lista.
                                        </td>
                                    </tr>
                                ) : (
                                    listaBloquesPendientes.map((item, index) => (
                                        <tr key={index} style={{ backgroundColor: indiceEditando === index ? '#fef9e7' : 'transparent' }}>
                                            <td>{item.bloqueCodigo}</td>
                                            <td>{fmtNum(item.bloqueLargo)}</td>
                                            <td>{fmtNum(item.bloqueAncho)}</td>
                                            <td>{fmtNum(item.bloqueAlto)}</td>
                                            <td>{fmtNum(item.bloquePesoSinCola)}</td>
                                            <td>{fmtNum(item.bloquePesoConCola)}</td>
                                            <td>{fmtNum(item.bloqueBftFinal)}</td>
                                            <td>{item.tipoMadera.idTipoMadera === 1 ? "L" : "P"}</td>
                                            <td>
                                                <button
                                                    className="btn-icon"
                                                    onClick={() => cargarDatosParaEditar(item, index)}
                                                    title="Editar este bloque"
                                                >
                                                    <Icons.Edit />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default PageRegistroPresentados;
