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

function Municipios() {
    const [municipios, setMunicipios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [formData, setFormData] = useState({
        nombre: '',
        provincia_id: '',
      });
    const [provincias, setProvincias] = useState([]);
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
        provincia_id: '',
        });
    };
  
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`${apiUrl}/provincias`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => setProvincias(response.data))
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

        const token = localStorage.getItem('token');
        axios.post(`${apiUrl}/municipio`, {
            nombre: formData.nombre,
            provincia_id: formData.provincia_id
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setMunicipios([ response.data.municipio,...municipios]);
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
        
        await axios.get(`${apiUrl}/municipio/${selectedId}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Incluir el token en los encabezados
            }
        })
            .then(response => {
                
                setFormData({
                    nombre: response.data.nombre,
                    provincia_id: response.data.provincia_id
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

        
        

        const token = localStorage.getItem('token');
        axios.put(`${apiUrl}/municipio/${selectedId}`, {
            nombre: formData.nombre,
            provincia_id: formData.provincia_id
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setMunicipios((prevMunicipios) => 
                prevMunicipios.map(municipio => municipio.id === selectedId ? response.data.municipio : municipio)
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
        axios.delete(`${apiUrl}/municipio/${selectedId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setMunicipios(municipios.filter(municipio => municipio.id !== selectedId));
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
        axios.get(`${apiUrl}/municipios`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                const sortedMunicipios = response.data.sort((a, b) => b.id - a.id);
                setMunicipios(sortedMunicipios);
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

    
    const activeMunicipios_Count = municipios.length;

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

    const renderMunicipios = () => (
        <div className="container mx-auto h-auto px-4">
            <h5 className="text-2xl font-bold text-cyan-700 dark:text-white">Municipios</h5>
            <br />
            <Button onClick={() => setOpenNewModal(true)} className='mb-2'>
                Nuevo Municipio <HiOutlinePlus className="ml-2 h-5 w-5" />
            </Button>
            <DataTable 
                value={municipios}
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                filters={filters}
                globalFilterFields={['nombre','provincia.nombre']}
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
                    field="provincia.nombre" 
                    header="Provincia" 
                    body={(rowData) => renderWithTooltip(rowData, 'provincia.nombre')}
                    className="p-col text-sm font-medium text-gray-900 px-6 py-4"
                />
                <Column 
                    body={actionBodyTemplate} 
                    header="ACCIONES" 
                    className="p-col text-sm font-medium text-gray-900 px-6 py-4"
                />
            </DataTable>
            <div className="flex flex-wrap gap-2">
                <Button>Municipios: {activeMunicipios_Count}</Button>
            </div>
        </div>
    );

    return (
        <Layout>
            <section className="bg-white dark:bg-gray-800 relative shadow-md rounded-lg mx-auto h-auto">
                <div role="status" className="w-full p-4 space-y-4 divide-y divide-gray-200 dark:divide-gray-700 md:p-6 dark:border-gray-700">
                    {loading ? renderLoadingElements() : (
                        <PrimeReactProvider>
                            {renderMunicipios()}
                        </PrimeReactProvider>
                    )}
                </div>
                <ToastNotification show={showToastSUCC} type="success" message={toastMessage} onClose={() => setShowToastSUCC(false)} />
                <ToastNotification show={showToastERR} type="error" message={toastMessage} onClose={() => setShowToastERR(false)} />
                
                <Modal show={openNewModal}  size='md'onClose={() => {setOpenNewModal(false); resetFormData();}}>
                    <Modal.Header onClose={() => { setOpenNewModal(false); resetFormData(); }}>
                        Nuevo Municipio
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div>
                                <Label htmlFor="nombre">Nombre</Label>
                                <TextInput id="nombre" name="nombre" maxLength={30} value={formData.nombre} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa el nombre.')} onInput={(e) => e.target.setCustomValidity('')}/>
                            </div>
                            <div>
                                <Label htmlFor="provincia_id">Provincia</Label>
                                <Select id="provincia_id" name="provincia_id" value={formData.provincia_id} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                        <option value="">-Seleccione una Provincia-</option>
                                        {provincias.map(provincia => (
                                            <option key={provincia.id} value={provincia.id}>{provincia.nombre}</option>
                                        ))}
                                </Select> 
                            </div>
                            
                            <Button type="submit">Guardar</Button>
                        </form>
                    </Modal.Body>
                </Modal>

                <Modal show={openEdtModal}  size='md'onClose={() => {setOpenEdtModal(false); resetFormData();}}>
                    <Modal.Header onClose={() => { setOpenEdtModal(false); resetFormData(); }}>
                        Editar Municipio
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleEdtSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="nombre">Nombre</Label>
                                <TextInput id="nombre" name="nombre" maxLength={30} value={formData.nombre} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa el nombre.')} onInput={(e) => e.target.setCustomValidity('')}/>
                            </div>
                            <div>
                                <Label htmlFor="provincia_id">Provincia</Label>
                                <Select id="provincia_id" name="provincia_id" value={formData.provincia_id} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                        <option value="">-Seleccione una Provincia-</option>
                                        {provincias.map(provincia => (
                                            <option key={provincia.id} value={provincia.id}>{provincia.nombre}</option>
                                        ))}
                                </Select> 
                            </div>
                            
                            
                            <Button type="submit">Guardar</Button>
                        </form>
                    </Modal.Body>
                </Modal>    

                <ConfirmacionModal show={openModal} onClose={() => setOpenModal(false)} onConfirm={confirmDelete} msg={'¿Desea eliminar este municipio?'} />
                
            </section>
        </Layout>
    );
}
export default Municipios;