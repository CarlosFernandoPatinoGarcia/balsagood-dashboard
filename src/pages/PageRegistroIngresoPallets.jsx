import React, { useState, useEffect, useRef } from 'react';
import api from '../api/Api';
import '../App.css';
import Icons from '../components/Icons';

// --- CONSTANTES ---
const ANCHO_OPTIONS = ['74', '81'];
const LARGO_OPTIONS = ['4', '3.5', '3', '2.5', '2'];
const ESPESOR_OPTIONS = ['3', '2.5', '2', '1.5', '1', '0.875'];

const PageRegistroIngresoPallets = () => {
    // ESTADO PARA LOS PROVEEDORES
    const [proveedores, setProveedores] = useState([]);

    // LISTA PRINCIPAL (Lo que se enviará al Backend)
    const [listaPalletsPendientes, setListaPalletsPendientes] = useState([]);

    // ESTADO DE LA CABECERA DEL PALLET
    const [cabeceraPallet, setCabeceraPallet] = useState({
        numViaje: '',
        fechaIngreso: new Date().toISOString().split('T')[0],
        idProveedor: null,
        provNombre: '',
        palletNumero: '',
        palletEmplantillador: '',
        idTipoMadera: 1,
    });

    // ESTADO DEL ITEM ACTUAL
    const [itemActual, setItemActual] = useState({
        largo: '',
        ancho: '',
        espesor: '',
        cantidad: '',
        esCastigada: false
    });

    // Cargar proveedores para insertarlos en la lista desplegable
    const fetchProveedores = async () => {
        try {
            const response = await api.get('/api/proveedores');
            setProveedores(response.data);
        } catch (error) {
            console.error('Error fetching proveedores:', error);

        }
    };

    useEffect(() => {
        fetchProveedores(); // Llama a la API al cargar el componente
    }, []);

    // LISTA TEMPORAL DE ITEMS
    const [itemsDelPalletActual, setItemsDelPalletActual] = useState([]);

    const [loading, setLoading] = useState(false);

    const inputLargoRef = useRef(null);
    const inputViajeRef = useRef(null);

    // --- MANEJADORES ---

    const handleProveedorChange = (e) => {
        const idSeleccionado = parseInt(e.target.value);

        // Buscar el objeto proveedor completo en la lista para obtener su nombre
        // NOTA: Ajusta '.id' o '.idProveedor' según como venga tu JSON del backend
        const proveedorEncontrado = proveedores.find(p => p.idProveedor === idSeleccionado);

        setCabeceraPallet(prev => ({
            ...prev,
            idProveedor: idSeleccionado,
            // Si lo encuentra usa el nombre, si no (caso "Seleccione") lo deja vacío
            provNombre: proveedorEncontrado ? proveedorEncontrado.provNombre : ''
        }));
    };

    const handleCabeceraChange = (e) => {
        const { name, value } = e.target;
        setCabeceraPallet(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (e) => {
        const { name, value, type, checked } = e.target;
        setItemActual(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // --- LÓGICA DE CÁLCULO DE BFT ---

    // Fórmula base: (Largo * Ancho * Espesor * Cantidad) / 12
    const calcularFormulaBft = (largo, ancho, espesor, cantidad) => {
        const l = parseFloat(largo) || 0;
        const a = parseFloat(ancho) || 0;
        const e = parseFloat(espesor) || 0;
        const c = parseFloat(cantidad) || 0;
        return (l * a * e * c) / 12;
    };

    // Calcular totales dinámicos recorriendo la lista temporal
    const totalesActuales = itemsDelPalletActual.reduce((acc, item) => {
        // 1. BFT RECIBIDO: Se calcula con el LARGO ORIGINAL (lo que llegó físicamente antes del castigo)
        const bftRecibidoItem = calcularFormulaBft(
            item.largoOriginal, // <--- CLAVE: Usa el original
            item.ancho,
            item.espesor,
            item.cantidad
        );

        const bftAceptadoItem = calcularFormulaBft(
            item.largo,
            item.ancho,
            item.espesor,
            item.cantidad
        );

        return {
            recibido: acc.recibido + bftRecibidoItem,
            aceptado: acc.aceptado + bftAceptadoItem
        };
    }, { recibido: 0, aceptado: 0 });


    // --- ACCIONES ---

    const agregarItemAPallet = (e) => {
        e.preventDefault();

        if (!itemActual.largo || !itemActual.ancho || !itemActual.espesor || !itemActual.cantidad) {
            alert("Complete las dimensiones y cantidad.");
            return;
        }

        // DETERMINAR LARGO ORIGINAL
        // Regla: "El largo original era siempre el del primer item"
        let largoOriginalParaEsteItem;

        if (itemsDelPalletActual.length === 0) {
            // Si es el primer item, SU largo es el original
            largoOriginalParaEsteItem = itemActual.largo;
        } else {
            // Si ya hay items, el largo original es el del PRIMER item agregado
            largoOriginalParaEsteItem = itemsDelPalletActual[0].largoOriginal;
        }

        const nuevoItem = {
            ...itemActual,
            largoOriginal: largoOriginalParaEsteItem, // Guardamos la referencia
            idTemp: Date.now()
        };

        setItemsDelPalletActual([...itemsDelPalletActual, nuevoItem]);

        // Preparar formulario para siguiente entrada
        setItemActual({
            ...itemActual,
            cantidad: '',
            // Sugerencia visual: si el anterior fue castigado, probablemente el siguiente también o volvemos a original.
            // Dejamos el largo en pantalla para agilizar, pero reseteamos el check si quieres:
            esCastigada: true
        });

        if (inputLargoRef.current) inputLargoRef.current.focus();
    };

    const eliminarItemTemporal = (idTemp) => {
        setItemsDelPalletActual(itemsDelPalletActual.filter(i => i.idTemp !== idTemp));
    };

    const guardarPalletCompleto = () => {
        if (itemsDelPalletActual.length === 0) {
            alert("Agregue al menos una calificación.");
            return;
        }
        if (!cabeceraPallet.numViaje || !cabeceraPallet.palletNumero) {
            alert("Faltan datos de cabecera.");
            return;
        }

        const palletPayload = {
            num_viaje: parseInt(cabeceraPallet.numViaje),
            fecha_ingreso: cabeceraPallet.fechaIngreso,
            id_proveedor: parseInt(cabeceraPallet.idProveedor) || null,
            prov_nombre: cabeceraPallet.provNombre,
            pallet_numero: parseInt(cabeceraPallet.palletNumero),
            pallet_emplantillador: cabeceraPallet.palletEmplantillador,
            id_tipo_madera: parseInt(cabeceraPallet.idTipoMadera),

            calificaciones: itemsDelPalletActual.map(item => ({
                largo: parseFloat(item.largo),
                espesor: parseFloat(item.espesor),
                cantidad: parseFloat(item.cantidad),
                es_castigada: item.esCastigada,
                largo_original: parseFloat(item.largoOriginal)
            })),

            // Visuales para el usuario porque se calcula en el backend
            visualTotalRecibido: totalesActuales.recibido,
            visualTotalAceptado: totalesActuales.aceptado
        };

        setListaPalletsPendientes([...listaPalletsPendientes, palletPayload]);

        // Reset
        setItemsDelPalletActual([]);
        setCabeceraPallet(prev => ({
            ...prev,
            palletNumero: (parseInt(prev.palletNumero) || 0) + 1
        }));
        setItemActual({
            largo: '', ancho: '', espesor: '', cantidad: '', esCastigada: false
        });

        if (inputViajeRef.current) inputViajeRef.current.focus();
    };

    const registrarEnBackend = async () => {
        if (listaPalletsPendientes.length === 0) return;
        setLoading(true);
        try {
            // Limpiar campos visuales antes de enviar (payload limpio)
            const payloadLimpio = listaPalletsPendientes.map(({ visualTotalRecibido, visualTotalAceptado, ...resto }) => resto);

            console.log("PAYLOAD:", JSON.stringify(payloadLimpio, null, 2));
            await api.post('/api/ingreso/ingreso-dashboard', payloadLimpio);

            alert("Pallets ingresados exitosamente.");
            setListaPalletsPendientes([]);
            setCabeceraPallet({ ...cabeceraPallet, numViaje: '', palletNumero: '' });
        } catch (error) {
            console.error(error);
            alert("Error al registrar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1 className="header-title">Registro de Ingreso</h1>
                    <span className="header-subtitle">Gestión de Pallets con múltiples calificaciones/castigos.</span>
                </div>
                <div className="header-actions">
                    <h2 className="header-title">Pallets Listos: {listaPalletsPendientes.length}</h2>
                </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* --- SECCIÓN SUPERIOR: CONSTRUCTOR DE PALLET --- */}
                <div className="card-panel" style={{
                    backgroundColor: 'var(--card)', padding: '20px', borderRadius: '8px',
                    border: '1px solid var(--border)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                }}>

                    <h3 className="section-title" style={{ borderBottom: '1px solid #eee' }}>1. Cabecera del Pallet</h3>
                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                        <div className="form-group">
                            <label>N° Viaje</label>
                            <input ref={inputViajeRef} type="number" name="numViaje" value={cabeceraPallet.numViaje} onChange={handleCabeceraChange} className="form-input" />
                        </div>
                        <div className="form-group">
                            <label>Fecha</label>
                            <input type="date" name="fechaIngreso" value={cabeceraPallet.fechaIngreso} onChange={handleCabeceraChange} className="form-input" />
                        </div>
                        <div className="form-group">
                            <label>N° Pallet</label>
                            <input type="number" name="palletNumero" value={cabeceraPallet.palletNumero} onChange={handleCabeceraChange} className="form-input" />
                        </div>
                        <div className="form-group">
                            <label>Proveedor</label>
                            {/* <input type="text" name="provNombre" value={cabeceraPallet.provNombre} onChange={handleCabeceraChange} className="form-input" placeholder="Nombre" /> */}
                            <select
                                name="idProveedor"
                                value={cabeceraPallet.idProveedor}
                                onChange={handleProveedorChange}
                                className="form-input"
                            >
                                <option value="">-- Seleccione --</option>
                                {proveedores.map((prov) => (

                                    <option key={prov.idProveedor} value={prov.idProveedor}>
                                        {prov.provNombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Tipo Madera</label>
                            <select name="idTipoMadera" value={cabeceraPallet.idTipoMadera} onChange={handleCabeceraChange} className="form-input">
                                <option value="1">Liviana</option>
                                <option value="2">Pesada</option>
                            </select>
                        </div>
                    </div>

                    <h3 className="section-title" style={{ borderBottom: '1px solid #eee' }}>2. Calificaciones (Items)</h3>

                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>

                        {/* FORMULARIO AGREGAR ITEM */}
                        <form onSubmit={agregarItemAPallet} style={{
                            flex: '1', minWidth: '250px', background: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px dashed #ccc'
                        }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div className="form-group">
                                    <label>Largo (Pies)</label>
                                    <select ref={inputLargoRef} name="largo" value={itemActual.largo} onChange={handleItemChange} className="form-input" required>
                                        <option value="">-</option>
                                        {LARGO_OPTIONS.map(o => <option key={o} value={o}>{o}'</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Ancho (Pulg)</label>
                                    <select name="ancho" value={itemActual.ancho} onChange={handleItemChange} className="form-input" required>
                                        <option value="">-</option>
                                        {ANCHO_OPTIONS.map(o => <option key={o} value={o}>{o}"</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Espesor (Pulg)</label>
                                    <select name="espesor" value={itemActual.espesor} onChange={handleItemChange} className="form-input" required>
                                        <option value="">-</option>
                                        {ESPESOR_OPTIONS.map(o => <option key={o} value={o}>{o}"</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Cant. Plantillas</label>
                                    <input type="number" name="cantidad" value={itemActual.cantidad} onChange={handleItemChange} className="form-input" required placeholder="0" />
                                </div>
                            </div>

                            <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--primary)' }}>
                                    <input type="checkbox" name="esCastigada" checked={itemActual.esCastigada} onChange={handleItemChange} />
                                    Es Castigo?
                                </label>
                                <button type="submit" className="btn-save" style={{ padding: '5px 15px', fontSize: '0.9rem' }}>+ Agregar</button>
                            </div>
                        </form>

                        {/* LISTA TEMPORAL */}
                        <div style={{ flex: '2', minWidth: '300px' }}>
                            {itemsDelPalletActual.length === 0 ? (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#999', border: '1px solid #eee', borderRadius: '8px' }}>
                                    Agregue el primer item para establecer el Largo Original.
                                </div>
                            ) : (
                                <>
                                    <table className="custom-table" style={{ fontSize: '0.85rem' }}>
                                        <thead>
                                            <tr style={{ background: '#eee' }}>
                                                <th>Tipo</th>
                                                {/* <th>Largo Orig.</th> */}
                                                <th>Largo</th>
                                                <th>Espesor</th>
                                                <th>Plantillas</th>
                                                <th>BFT Recibido</th>
                                                <th>BFT Aceptado</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {itemsDelPalletActual.map((item, idx) => {
                                                const bftRec = calcularFormulaBft(item.largoOriginal, item.ancho, item.espesor, item.cantidad);
                                                const bftAcep = calcularFormulaBft(item.largo, item.ancho, item.espesor, item.cantidad);
                                                return (
                                                    <tr key={item.idTemp}>
                                                        <td>{item.esCastigada ? <span style={{ color: 'red' }}>Castigo</span> : 'Normal'}</td>
                                                        {/* <td>{item.largoOriginal}'</td> */}
                                                        <td>{item.largo}''</td>
                                                        <td>{item.espesor}''</td>
                                                        <td>{item.cantidad}</td>
                                                        <td>{bftRec.toFixed(2)}</td>
                                                        <td>{bftAcep.toFixed(2)}</td>
                                                        <td style={{ width: '30px' }}>
                                                            <button onClick={() => eliminarItemTemporal(item.idTemp)} style={{ border: 'none', background: 'transparent', color: 'red' }}>X</button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>

                                    <div style={{ display: 'flex', gap: '20px', marginTop: '10px', justifyContent: 'flex-end', background: '#f0f8ff', padding: '10px', borderRadius: '4px' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <small>Total Recibido</small>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{totalesActuales.recibido.toFixed(2)}</div>
                                        </div>
                                        <div style={{ textAlign: 'right', color: 'green' }}>
                                            <small>Total Aceptado</small>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{totalesActuales.aceptado.toFixed(2)}</div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', textAlign: 'right' }}>
                        <button onClick={guardarPalletCompleto} className="btn-save" style={{ backgroundColor: '#2c3e50' }}>
                            Confirmar Pallet
                        </button>
                    </div>
                </div>

                {/* --- SECCIÓN INFERIOR: TABLA DE ENVÍO --- */}
                <div style={{
                    backgroundColor: 'var(--card)', padding: '20px', borderRadius: '8px',
                    border: '1px solid var(--border)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h2 className="section-title" style={{ margin: 0 }}>Pallets Listos para Enviar</h2>
                        {listaPalletsPendientes.length > 0 && (
                            <button onClick={registrarEnBackend} className="btn-save" disabled={loading} style={{ backgroundColor: '#28a745' }}>
                                {loading ? 'Enviando...' : `Registrar Todo`}
                            </button>
                        )}
                    </div>

                    <div className="table-container" style={{ boxShadow: 'none', padding: 0, border: 'none' }}>
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Viaje</th>
                                    <th>Pallet</th>
                                    <th>Proveedor</th>
                                    <th># Calificaciones</th>
                                    <th>Total Recibido</th>
                                    <th>Total Aceptado</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaPalletsPendientes.length === 0 ? (
                                    <tr><td colSpan="8" className="empty-row">No hay registros pendientes.</td></tr>
                                ) : (
                                    listaPalletsPendientes.map((p, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{p.num_viaje}</td>
                                            <td>{p.pallet_numero}</td>
                                            <td>{p.prov_nombre}</td>
                                            <td>{p.calificaciones.length}</td>
                                            <td>{p.visualTotalRecibido?.toFixed(2)}</td>
                                            <td style={{ color: 'green', fontWeight: 'bold' }}>{p.visualTotalAceptado?.toFixed(2)}</td>
                                            <td>
                                                <button className="btn-icon" style={{ color: '#e74c3c' }}
                                                    onClick={() => setListaPalletsPendientes(prev => prev.filter((_, i) => i !== index))}>
                                                    <Icons.Delete />
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
        </div>
    );
};

export default PageRegistroIngresoPallets;