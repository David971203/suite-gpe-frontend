import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../../../utils/apiUrl';
import { renderWithTooltip } from '../../../utils/renderWithTooltip';
import { TextInput,Select,Label, Modal } from "flowbite-react";
import { HiOutlineSearch, HiOutlinePlus, HiOutlineArrowNarrowRight } from "react-icons/hi";
import Layout from "../../layout/layout";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PrimeReactProvider } from 'primereact/api';
import { Button } from "flowbite-react";
import { FilterMatchMode } from 'primereact/api';
import 'flowbite/dist/flowbite.css';
import '../styles.css';
import {TableActionsItemsActive} from '../../../utils/TableActions';
import ConfirmacionModal from '../../../utils/ConfirmacionModal';
import ToastNotification from '../../../utils/ToastNotification';

function TipoPortadoresActivos() {
    const [tipoPortadores, settipoPortadores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [formData, setFormData] = useState({
        nombre: '',
        tarifa: 0,
        estado:'Activo',
        portador_id: '',
        unidad_medida_id: ''
      });
    const [portadores, setPortadores] = useState([]);
    const [unidadesMedia, setunidadesMedia] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openNewModal, setOpenNewModal] = useState(false);
    const [openEdtModal, setOpenEdtModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showToastSUCC, setShowToastSUCC] = useState(false);
    const [showToastERR, setShowToastERR] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [colorInputText, setcolorInputText] = useState('gray');
    const [msgInputText, setmsgInputText] = useState('');
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const resetFormData = () => {
    setFormData({
    nombre: '',
    tarifa: 0,
    estado:'Activo',
    portador_id: '',
    unidad_medida_id: ''
    });
    };
  
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`${apiUrl}/portador_energeticos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => setPortadores(response.data))
        .catch(error => {
            const errorMsg = error.response?.data?.detail || 'Error al actualizar el estado';
            setToastMessage(errorMsg);
            setShowToastERR(true);
            setTimeout(() => setShowToastERR(false), 5000);
        });
    }, []);
    const activePortadores = portadores.filter(portador => portador.estado === 'Activo');

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`${apiUrl}/unidad_medidas`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => setunidadesMedia(response.data))
        .catch(error => {
            const errorMsg = error.response?.data?.detail || 'Error al actualizar el estado';
            setToastMessage(errorMsg);
            setShowToastERR(true);
            setTimeout(() => setShowToastERR(false), 5000);
        });
    }, []);

    //Add
    const handleSubmit = (e) => {
        e.preventDefault();

        if(!(/^\d+(\.\d+)?$/.test(formData.tarifa))){
            setcolorInputText('failure');
                setmsgInputText('Para los lugares decimales utilize . solo una vez');
                
                setTimeout(() => {
                    setShowToastERR(false);
                    setcolorInputText('gray');
                    setmsgInputText('');
                }
                , 5000);
                
                return;
        }

        const token = localStorage.getItem('token');
        axios.post(`${apiUrl}/tipo_portador_energetico`, {
            nombre: formData.nombre,
            tarifa: formData.tarifa,
            estado: formData.estado,
            portador_id: formData.portador_id,
            unidad_medida_id: formData.unidad_medida_id
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            settipoPortadores([ response.data.tipo_portador,...tipoPortadores]);
            setToastMessage(response.data.message);
            setShowToastSUCC(true);
            setTimeout(() => setShowToastSUCC(false), 5000);
            setOpenNewModal(false);
            resetFormData();
        })
        .catch(error => {
            setOpenNewModal(false);
            resetFormData();
            const errorMsg = error.response?.data?.detail || 'Error al actualizar el estado';
            if (errorMsg === 'Could not validate credentials') {
                setToastMessage('Su sesión ha expirado, por favor ingrese de nuevo');
                setShowToastERR(true);
                setTimeout(() => {
                    setShowToastERR(false);
                    localStorage.setItem('rol', '');
                    logout();
                    navigate('/login');
                }, 3000);
            } else {
                setToastMessage(errorMsg);
                setShowToastERR(true);
                setTimeout(() => setShowToastERR(false), 5000);
            }
        });
    };

    //Edt
    const openModalWithData = (userId) => {
        
        setSelectedId(userId);
        fetchUserData(userId);
        setOpenEdtModal(true);
        
    };
    useEffect(() => {
        if (selectedId !== null) {
            fetchUserData(selectedId);
        }
    }, [selectedId]);

    const fetchUserData = async (selectedId) => {
        const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
        
        await axios.get(`${apiUrl}/tipo_portador_energetico/${selectedId}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Incluir el token en los encabezados
            }
        })
            .then(response => {
                
                setFormData({
                    nombre: response.data.nombre,
                    tarifa: response.data.tarifa,
                    estado: response.data.estado,
                    portador_id: response.data.portador_id,
                    unidad_medida_id: response.data.unidad_medida_id
                });
                
            })
            .catch(error => {
              
              if (error.response.data.detail === 'Could not validate credentials') {
                setToastMessage('Su sesión ha expirado, por favor ingrese de nuevo');
                setShowToastERR(true); // Mostrar Toast
                setTimeout(() => setShowToastERR(false), 5000); 
                setTimeout(() => {
                    setShowToastERR(false);
                    if (error.response.data.detail === 'Could not validate credentials') {
                      // Token inválido o expirado, redirigir a la página de inicio de sesión
                      localStorage.setItem('rol', '');
                      logout();
                      navigate('/login');
                    }
                  }, 3000);
                }else{
                    setToastMessage(error.response.data.detail);
                    setShowToastERR(true); // Mostrar Toast
                    setTimeout(() => setShowToastERR(false), 5000); 
                }
            
            // 2 segundos de retraso antes de la redirección
             
            });
    };

    const handleEdtSubmit = (e) => {
        e.preventDefault();

        
        if(!(/^\d+(\.\d+)?$/.test(formData.tarifa))){
            setcolorInputText('failure');
                setmsgInputText('Para los lugares decimales utilize . solo una vez');
                
                setTimeout(() => {
                    setShowToastERR(false);
                    setcolorInputText('gray');
                    setmsgInputText('');
                }
                , 5000);
                
                return;
        }

        const token = localStorage.getItem('token');
        axios.put(`${apiUrl}/tipo_portador_energetico/${selectedId}`, {
            nombre: formData.nombre,
            tarifa: formData.tarifa,
            estado: formData.estado,
            portador_id: formData.portador_id,
            unidad_medida_id: formData.unidad_medida_id
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            settipoPortadores((prevTipoPortadores) => 
                prevTipoPortadores.map(tipoPortador => tipoPortador.id === selectedId ? response.data.tipo_portador : tipoPortador)
            );
            setToastMessage(response.data.message);
            setShowToastSUCC(true);
            setTimeout(() => setShowToastSUCC(false), 5000);
            setOpenEdtModal(false);
            resetFormData();
        })
        .catch(error => {
            setOpenEdtModal(false);
            resetFormData();
            console.log(error);
            if (error.response.data.detail === 'Could not validate credentials') {
                setToastMessage('Su sesión ha expirado, por favor ingrese de nuevo');
                setShowToastERR(true);
                setTimeout(() => {
                    setShowToastERR(false);
                    localStorage.setItem('rol', '');
                    logout();
                    navigate('/login');
                }, 3000);
            } else {
                setToastMessage(error.response.data.detail);
                setShowToastERR(true);
                setTimeout(() => setShowToastERR(false), 5000);
            }
        });
    };



    //Delete
    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setOpenModal(true);
    };

    const confirmDelete = () => {
        const token = localStorage.getItem('token');
        axios.put(`${apiUrl}/tipo_portador_energetico/estado/${selectedId}`, { estado: "Inactivo" }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                settipoPortadores(tipoPortadores.filter(tipoPortador => tipoPortador.id !== selectedId));
                setOpenModal(false);
                setToastMessage(response.data.message);
                setShowToastERR(true);
                setTimeout(() => setShowToastERR(false), 5000);
            })
            .catch(error => {
                setOpenModal(false);
                const errorMsg = error.response?.data?.detail || 'Error al actualizar el estado';
                if (errorMsg === 'Could not validate credentials') {
                    setToastMessage('Su sesión ha expirado, por favor ingrese de nuevo');
                    setShowToastERR(true);
                    setTimeout(() => {
                        setShowToastERR(false);
                        localStorage.setItem('rol', '');
                        logout();
                        navigate('/login');
                    }, 3000);
                } else {
                    setToastMessage(errorMsg);
                    setShowToastERR(true);
                    setTimeout(() => setShowToastERR(false), 5000);
                }
            });
    };

    //Tabla
    const actionBodyTemplate = (rowData) => (
        <TableActionsItemsActive
            onEdit={() => openModalWithData(rowData.id)}
            onDelete={() => handleDeleteClick(rowData.id)} 
        />
    );

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        setFilters({ ...filters, global: { value, matchMode: FilterMatchMode.CONTAINS } });
        setGlobalFilterValue(value);
    };

    const renderHeader = () => (
        <div className="flex justify-end dark:bg-gray-800">
            <TextInput 
                value={globalFilterValue} 
                onChange={onGlobalFilterChange} 
                rightIcon={HiOutlineSearch} 
                id="input-gray" 
                placeholder="Buscar" 
                className="mb-2" 
            />
        </div>
    );

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`${apiUrl}/tipo_portador_energeticos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                const sortedTipoPortador = response.data.sort((a, b) => b.id - a.id);
                settipoPortadores(sortedTipoPortador);
                setLoading(false);
            })
            .catch(error => {
                const errorMsg = error.response?.data?.detail || 'Error al cargar los datos';
                if (errorMsg === 'Could not validate credentials') {
                    setToastMessage('Su sesión ha expirado, por favor ingrese de nuevo');
                    setShowToastERR(true);
                    setTimeout(() => {
                        setShowToastERR(false);
                        localStorage.setItem('rol', '');
                        logout();
                        navigate('/login');
                    }, 3000);
                } else {
                    setToastMessage(errorMsg);
                    setShowToastERR(true);
                    setTimeout(() => {
                        setShowToastERR(false);
                        if (error.response.data.detail === 'No tiene permisos para acceder a esta ruta') {
                        // Token inválido o expirado, redirigir a la página de inicio de sesión
                        
                        navigate('/');
                        }
                    }, 3000); 
                }
                setLoading(false);
                setTimeout(() => setShowToastERR(false), 5000);
            });
    }, []);

    const activeTipoPortadores = tipoPortadores.filter(tipoPortador => tipoPortador.estado === 'Activo');
    const activeTipoPortadoresCount = activeTipoPortadores.length;

    const renderLoadingElements = () => (
        [...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between pt-4">
                <div>
                    <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                    <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
            </div>
        ))
    );

    const renderTipoPortadores = () => (
        <div className="container mx-auto h-auto px-4">
            <h5 className="text-2xl font-bold text-cyan-700 dark:text-white">Tipos de Portadores Energéticos</h5>
            <br />
            <Button onClick={() => setOpenNewModal(true)} className='mb-2'>
                Nuevo Tipo de Portador <HiOutlinePlus className="ml-2 h-5 w-5" />
            </Button>
            
            <DataTable 
                value={activeTipoPortadores}
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                filters={filters}
                globalFilterFields={['nombre','tarifa','portador.nombre','unidad_medida.nombre']}
                header={renderHeader()}
                filterDisplay="row"
                emptyMessage="No hay datos disponibles"
                className="p-datatable-gridlines p-component table-auto w-full text-left"
            >
                <Column 
                    field="nombre" 
                    header="NOMBRE" 
                    body={(rowData) => renderWithTooltip(rowData, 'nombre')} 
                    className="p-col text-sm font-medium text-gray-900 px-6 py-4"
                />
                <Column 
                    field="tarifa" 
                    header="Tarifa" 
                    body={(rowData) => renderWithTooltip(rowData, 'tarifa')}
                    className="p-col text-sm font-medium text-gray-900 px-6 py-4"
                />
                <Column 
                    field="portador.nombre" 
                    header="Portador" 
                    body={(rowData) => renderWithTooltip(rowData, 'portador.nombre')}
                    className="p-col text-sm font-medium text-gray-900 px-6 py-4"
                />
                <Column 
                    field="unidad_medida.nombre" 
                    header="Unidad de Medida" 
                    body={(rowData) => renderWithTooltip(rowData, 'unidad_medida.nombre')}
                    className="p-col text-sm font-medium text-gray-900 px-6 py-4"
                />
                <Column 
                    body={actionBodyTemplate} 
                    header="ACCIONES" 
                    className="p-col text-sm font-medium text-gray-900 px-6 py-4"
                />
            </DataTable>
            <div className="flex flex-wrap gap-2">
                <Button>Tipo Portadores Activos: {activeTipoPortadoresCount}</Button>
                <Button href='/tipo-portadores/inactive'>
                    Ver Tipo Portadores Inactivos <HiOutlineArrowNarrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </div>
    );

    return (
        <Layout>
            
            <section className=" bg-white dark:bg-gray-800 relative shadow-md rounded-lg overflow-y-auto">
                <div role="status" className="w-full p-4 space-y-4 divide-y divide-gray-200 dark:divide-gray-700 md:p-6 dark:border-gray-700">
                    {loading ? renderLoadingElements() : (
                        <PrimeReactProvider>
                            {renderTipoPortadores()}
                        </PrimeReactProvider>
                    )}
                </div>
                <ToastNotification show={showToastSUCC} type="success" message={toastMessage} onClose={() => setShowToastSUCC(false)} />
                <ToastNotification show={showToastERR} type="error" message={toastMessage} onClose={() => setShowToastERR(false)} />
                
                <Modal show={openNewModal}  size='md'onClose={() => {setOpenNewModal(false); resetFormData();}}>
                    <Modal.Header onClose={() => { setOpenNewModal(false); resetFormData(); }}>
                        Nuevo Tipo Portador Energético
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div>
                                <Label htmlFor="nombre">Nombre</Label>
                                <TextInput id="nombre" name="nombre" maxLength={30} value={formData.nombre} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa el nombre.')} onInput={(e) => e.target.setCustomValidity('')}/>
                            </div>
                            <div>
                                <Label htmlFor="tarifa">Tarifa</Label>
                                <TextInput id="tarifa" name="tarifa" min='0' value={formData.tarifa} color={colorInputText}
                                helperText={
                                    <>
                                        <p>{msgInputText}</p> 
                                    </>
                                }
                                onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa el monto de la tarifa, debe ser mayor que  0.')} onInput={(e) => e.target.setCustomValidity('')} aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                            </div>
                            <div>
                                <Label htmlFor="portador_id">Portador</Label>
                                <Select id="portador_id" name="portador_id" value={formData.portador_id} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                        <option value="">-Seleccione un portador-</option>
                                        {activePortadores.map(portador => (
                                            <option key={portador.id} value={portador.id}>{portador.nombre}</option>
                                        ))}
                                </Select> 
                            </div>
                            <div>
                                <Label htmlFor="unidad_medida_id">Unidad de Medida</Label>
                                <Select id="unidad_medida_id" name="unidad_medida_id" value={formData.unidad_medida_id} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                        <option value="">-Seleccione una unidad de medida-</option>
                                        {unidadesMedia.map(uM => (
                                            <option key={uM.id} value={uM.id}>{uM.nombre}</option>
                                        ))}
                                </Select>
                            </div>
                            
                            <Button type="submit">Guardar</Button>
                        </form>
                    </Modal.Body>
                </Modal>

                <Modal show={openEdtModal}  size='md'onClose={() => {setOpenEdtModal(false); resetFormData();}}>
                    <Modal.Header onClose={() => { setOpenEdtModal(false); resetFormData(); }}>
                        Editar Tipo Portador Energético
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleEdtSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="nombre">Nombre</Label>
                                <TextInput id="nombre" name="nombre" maxLength={30} value={formData.nombre} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa el nombre.')} onInput={(e) => e.target.setCustomValidity('')}/>
                            </div>
                            <div>
                                <Label htmlFor="tarifa">Tarifa</Label>
                                <TextInput id="tarifa" name="tarifa" min='0' value={formData.tarifa} color={colorInputText}
                                helperText={
                                    <>
                                        <p>{msgInputText}</p> 
                                    </>
                                }
                                onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa el monto de la tarifa, debe ser mayor que  0.')} onInput={(e) => e.target.setCustomValidity('')} aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                            </div>
                            <div>
                                <Label htmlFor="portador_id">Portador</Label>
                                <Select id="portador_id" name="portador_id" value={formData.portador_id} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                        <option value="">-Seleccione un portador-</option>
                                        {activePortadores.map(portador => (
                                            <option key={portador.id} value={portador.id}>{portador.nombre}</option>
                                        ))}
                                </Select> 
                            </div>
                            <div>
                                <Label htmlFor="unidad_medida_id">Unidad de Medida</Label>
                                <Select id="unidad_medida_id" name="unidad_medida_id" value={formData.unidad_medida_id} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                        <option value="">-Seleccione una unidad de medida-</option>
                                        {unidadesMedia.map(uM => (
                                            <option key={uM.id} value={uM.id}>{uM.nombre}</option>
                                        ))}
                                </Select>
                            </div>
                            
                            
                            <Button type="submit">Guardar</Button>
                        </form>
                    </Modal.Body>
                </Modal>    

                <ConfirmacionModal show={openModal} onClose={() => setOpenModal(false)} onConfirm={confirmDelete} msg={'¿Desea eliminar este tipo de portador?'} />
                
            </section>
        </Layout>
    );
}
export default TipoPortadoresActivos;