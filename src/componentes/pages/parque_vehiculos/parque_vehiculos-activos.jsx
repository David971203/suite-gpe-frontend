import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../../../utils/apiUrl';
import { renderWithTooltip } from '../../../utils/renderWithTooltip';
import { TextInput,Select,Label, Textarea ,Modal } from "flowbite-react";
import { HiOutlineSearch, HiOutlinePlus, HiOutlineArrowNarrowRight,HiOutlineDownload  } from "react-icons/hi";
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
import Select2 from 'react-select'
import { Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';


function ParqueVehiculosActivos() {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const rol = decodedToken.role;
    const unidad_name = decodedToken.unidad_name;
    const unidad_id = decodedToken.unidad_id;
    
    const [vehiculos, setVehiculos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [isSearchable, setIsSearchable] = useState(true);

    const [formData, setFormData] = useState({
        no_vehiculo: '',
        ubicacion: '',
        anho_fabricacion: 1940,
        matricula: '',
        no_carroceria:'',
        no_vin:'',
        no_motor_original:'',
        servicio:'',
        indice_consumo_normado: 0,
        observaciones:'',
        estado_tecnico:'',
        estado:'Activo',
        tipo_vehiculo_id: '',
        marca_id: '',
        modelo_id: '',
        tipo_portador_id: '',
        unidad_id: ''
    });

    const [formDataView, setFormDataView] = useState({
        no_vehiculoView: '',
        ubicacionView: '',
        anho_fabricacionView: '',
        matriculaView: '',
        no_carroceriaView:'',
        no_vinView:'',
        no_motor_originalView:'',
        servicioView:'',
        indice_consumo_normadoView: 0,
        observacionesView:'',
        estado_tecnicoView:'',
        estado:'Activo',
        tipo_vehiculoView: '',
        marcaView: '',
        modeloView: '',
        tipo_portadorView: '',
        unidadView: ''
    });

    const [tipoVehiculos, settipoVehiculos] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [tipoPortadores, settipoPortadores] = useState([]);
    const [actividadesCda, setActividadesCda] = useState([]);
    const [unidades, setUnidades] = useState([]);

    const [openModal, setOpenModal] = useState(false);
    const [openNewModal, setOpenNewModal] = useState(false);
    const [openEdtModal, setOpenEdtModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showToastSUCC, setShowToastSUCC] = useState(false);
    const [showToastERR, setShowToastERR] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const [colorInputText, setcolorInputText] = useState('gray');
    const [msgInputText, setmsgInputText] = useState('');
    const [colorInputTextArea, setcolorInputTextArea] = useState('gray');
    const [msgInputTextArea, setmsgInputTextArea] = useState('');

    const [colorInputTextEdt, setcolorInputTextEdt] = useState('gray');
    const [msgInputTextEdt, setmsgInputTextEdt] = useState('');
    const [colorInputTextAreaEdt, setcolorInputTextAreaEdt] = useState('gray');
    const [msgInputTextAreaEdt, setmsgInputTextAreaEdt] = useState('');

    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const resetFormData = () => {
    setFormData({
        no_vehiculo: '',
        ubicacion: '',
        anho_fabricacion: 1940,
        matricula: '',
        no_carroceria:'',
        no_vin:'',
        no_motor_original:'',
        servicio:'',
        indice_consumo_normado: 0,
        observaciones:'',
        estado_tecnico:'',
        estado:'Activo',
        tipo_vehiculo_id: '',
        marca_id: '',
        modelo_id: '',
        tipo_portador_id: '',
        unidad_id: ''
        });
    };
  
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };



    //tipo de vehiculo
    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`${apiUrl}/tipo_vehiculos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => settipoVehiculos(response.data))
        .catch(error => {
            const errorMsg = error.response?.data?.detail || 'Error al actualizar el estado';
            setToastMessage(errorMsg);
            setShowToastERR(true);
            setTimeout(() => setShowToastERR(false), 5000);
        });
    }, []);

    

    //marca
     useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`${apiUrl}/marcas`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => setMarcas(response.data))
        .catch(error => {
            const errorMsg = error.response?.data?.detail || 'Error al actualizar el estado';
            setToastMessage(errorMsg);
            setShowToastERR(true);
            setTimeout(() => setShowToastERR(false), 5000);
        });
    }, []);

    const activeMarcas = marcas.filter(marca => marca.estado === 'Activo');

    //tipo de portadores
    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`${apiUrl}/tipo_portador_energeticos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => settipoPortadores(response.data))
        .catch(error => {
            const errorMsg = error.response?.data?.detail || 'Error al actualizar el estado';
            setToastMessage(errorMsg);
            setShowToastERR(true);
            setTimeout(() => setShowToastERR(false), 5000);
        });
    }, []);

    const activeTipoPortadores = tipoPortadores.filter(tipoPortadore => tipoPortadore.estado === 'Activo');

    //actividades de cda
    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`${apiUrl}/unidades_actividades/${unidad_id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                const sortedActividadesCda = response.data.sort((a, b) => b.id - a.id);
                setActividadesCda(sortedActividadesCda);
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

    const activeActividadesCda = actividadesCda.filter(actividadCda => actividadCda.estado === 'Activo');
    const options = activeActividadesCda.map(actividad => ({
        value: actividad.id,
        label: actividad.nombre
      }));
    
    //unidades
    let activeUnidades = null;
    if(rol === 'ROLE_ADMIN'){
        useEffect(() => {
            const token = localStorage.getItem('token');
            axios.get(`${apiUrl}/unidades`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => setUnidades(response.data))
            .catch(error => {
                const errorMsg = error.response?.data?.detail || 'Error al actualizar el estado';
                setToastMessage(errorMsg);
                setShowToastERR(true);
                setTimeout(() => setShowToastERR(false), 5000);
            });
        }, []);
        

        activeUnidades = unidades.filter(unidad => unidad.estado === 'Activo');
    }

    const handleMarcaChange = (e) => {
        const selectedMarcaId = e.target.value;
        setFormData({ ...formData, marca_id: selectedMarcaId, modelo_id: '' });

        if (selectedMarcaId) {
            const token = localStorage.getItem('token');
            axios.get(`${apiUrl}/marca/${selectedMarcaId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => setModelos(response.data.modelos))
            .catch(error => {
                const errorMsg = error.response?.data?.detail || 'Error al obtener los modelos';
                setToastMessage(errorMsg);
                setShowToastERR(true);
                setTimeout(() => setShowToastERR(false), 5000);
            });
        } else {
            setModelos([]);
        }
    };

    let activeModelos = modelos.filter(modelo => modelo.estado === 'Activo');

    //Add
    const handleSubmit = (e) => {
        e.preventDefault();

        if(!(/^\d+(\.\d+)?$/.test(formData.indice_consumo_normado))){
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

        if(formData.estado_tecnico !== 'Bueno' && formData.observaciones === ''){
            setcolorInputTextArea('failure');
            setmsgInputTextArea('Si el estado técnico del vehículo no es bueno debe dejar unas obsrevaciones');
            
            setTimeout(() => {
                setShowToastERR(false);
                setcolorInputTextArea('gray');
                setmsgInputTextArea('');
            }
            , 5000);
            
            return;
        }
        let unidad_id_tmp;
        if(rol === 'ROLE_ADMIN'){
            unidad_id_tmp = formData.unidad_id;
        }else{
            unidad_id_tmp = unidad_id;
        }
        const token = localStorage.getItem('token');
        axios.post(`${apiUrl}/vehiculo/`, {
            no_vehiculo: formData.no_vehiculo,
            ubicacion: formData.ubicacion,
            anho_fabricacion: formData.anho_fabricacion,
            matricula: formData.matricula,
            no_carroceria: formData.no_carroceria,
            no_vin: formData.no_vin,
            no_motor_original: formData.no_motor_original,
            servicio: formData.servicio,
            indice_consumo_normado: formData.indice_consumo_normado,
            observaciones: formData.observaciones,
            estado_tecnico: formData.estado_tecnico,
            estado: 'Activo',
            tipo_vehiculo_id: formData.tipo_vehiculo_id,
            marca_id: formData.marca_id,
            modelo_id: formData.modelo_id,
            tipo_portador_id: formData.tipo_portador_id,
            unidad_id: unidad_id_tmp
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setVehiculos([ response.data.vehiculo,...vehiculos]);
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
        
        await axios.get(`${apiUrl}/vehiculo/${selectedId}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Incluir el token en los encabezados
            }
        })
            .then(response => {
                const token = localStorage.getItem('token');
                axios.get(`${apiUrl}/marca/${response.data.marca_id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => setModelos(response.data.modelos))
                .catch(error => {
                    const errorMsg = error.response?.data?.detail || 'Error al obtener los modelos';
                    setToastMessage(errorMsg);
                    setShowToastERR(true);
                    setTimeout(() => setShowToastERR(false), 5000);
                });

                activeModelos = modelos.filter(modelo => modelo.estado === 'Activo');

                setFormData({
                    no_vehiculo: response.data.no_vehiculo,
                    ubicacion: response.data.ubicacion,
                    anho_fabricacion: response.data.anho_fabricacion,
                    matricula: response.data.matricula,
                    no_carroceria: response.data.no_carroceria,
                    no_vin: response.data.no_vin,
                    no_motor_original: response.data.no_motor_original,
                    servicio: response.data.servicio,
                    indice_consumo_normado: response.data.indice_consumo_normado,
                    observaciones: response.data.observaciones,
                    estado_tecnico: response.data.estado_tecnico,
                    estado: 'Activo',
                    tipo_vehiculo_id: response.data.tipo_vehiculo_id,
                    marca_id: response.data.marca_id,
                    modelo_id: response.data.modelo_id,
                    tipo_portador_id: response.data.tipo_portador_id,
                    unidad_id: response.data.unidad_id
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

        
        if(!(/^\d+(\.\d+)?$/.test(formData.indice_consumo_normado))){
            setcolorInputTextEdt('failure');
            setmsgInputTextEdt('Para los lugares decimales utilize . solo una vez');
            
            setTimeout(() => {
                setShowToastERR(false);
                setcolorInputTextEdt('gray');
                setmsgInputTextEdt('');
            }
            , 5000);
            
            return;
        }

        if(formData.estado_tecnico !== 'Bueno' && formData.observaciones === ''){
            setcolorInputTextAreaEdt('failure');
            setmsgInputTextAreaEdt('Si el estado técnico del vehículo no es bueno debe dejar unas obsrevaciones');
            
            setTimeout(() => {
                setShowToastERR(false);
                setcolorInputTextAreaEdt('gray');
                setmsgInputTextAreaEdt('');
            }
            , 5000);
            
            return;
        }

        let unidad_id_tmp;
        if(rol === 'ROLE_ADMIN'){
            unidad_id_tmp = formData.unidad_id;
        }else{
            unidad_id_tmp = unidad_id;
        }
        const token = localStorage.getItem('token');
        axios.put(`${apiUrl}/vehiculo/${selectedId}`, {
            no_vehiculo: formData.no_vehiculo,
            ubicacion: formData.ubicacion,
            anho_fabricacion: formData.anho_fabricacion,
            matricula: formData.matricula,
            no_carroceria: formData.no_carroceria,
            no_vin: formData.no_vin,
            no_motor_original: formData.no_motor_original,
            servicio: formData.servicio,
            indice_consumo_normado: formData.indice_consumo_normado,
            observaciones: formData.observaciones,
            estado_tecnico: formData.estado_tecnico,
            estado: 'Activo',
            tipo_vehiculo_id: formData.tipo_vehiculo_id,
            marca_id: formData.marca_id,
            modelo_id: formData.modelo_id,
            tipo_portador_id: formData.tipo_portador_id,
            unidad_id: unidad_id_tmp
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setVehiculos((prevVehiculos) => 
                prevVehiculos.map(vehiculo => vehiculo.id === selectedId ? response.data.vehiculo : vehiculo)
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

    //View
    const openViewData = (userId) => {
        
        setSelectedId(userId);
        fetchUserDataView(userId);
        setOpenViewModal(true);
        
    };

    const fetchUserDataView = async (selectedId) => {
        const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
        
        await axios.get(`${apiUrl}/vehiculo/${selectedId}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Incluir el token en los encabezados
            }
        })
            .then(response => {
                
                setFormDataView({
                    no_vehiculoView: response.data.no_vehiculo,
                    ubicacionView: response.data.ubicacion,
                    anho_fabricacionView: response.data.anho_fabricacion,
                    matriculaView: response.data.matricula,
                    no_carroceriaView: response.data.no_carroceria,
                    no_vinView: response.data.no_vin,
                    no_motor_originalView: response.data.no_motor_original,
                    servicioView: response.data.servicio,
                    indice_consumo_normadoView: response.data.indice_consumo_normado,
                    observacionesView: response.data.observaciones,
                    estado_tecnicoView: response.data.estado_tecnico,
                    estado: 'Activo',
                    tipo_vehiculoView: response.data.tipo_vehiculo.nombre,
                    marcaView: response.data.marca.nombre,
                    modeloView: response.data.modelo.nombre,
                    tipo_portadorView: response.data.tipo_portador.nombre,
                    unidadView: response.data.unidad.nombre
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

    //Delete
    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setOpenModal(true);
    };

    const confirmDelete = () => {
        const token = localStorage.getItem('token');
        axios.put(`${apiUrl}/vehiculo/estado/${selectedId}`, { estado: "Inactivo" }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setVehiculos(vehiculos.filter(vehiculo => vehiculo.id !== selectedId));
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
    
    //Excel 
    const handleDownloadExcel = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios({
                url: apiUrl+'/vehiculo_unidad_excel/'+unidad_id, // Cambia a tu ruta de la API
                method: 'GET',
                responseType: 'blob', // Importante para obtener el archivo como blob
                headers: {
                    'Authorization': `Bearer ${token}`  // Incluye tu token si es necesario
                }
            });
    
            // Crear un enlace para descargar el archivo
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Parque de Vehículos '+unidad_name+'.xlsx');  // Nombre del archivo
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
    
        } catch (error) {
            console.error('Error al descargar el archivo:', error);
        }
    };

    //Tabla
    const actionBodyTemplate = (rowData) => (
        <TableActionsItemsActive
            onEdit={() => openModalWithData(rowData.id)}
            onDelete={() => handleDeleteClick(rowData.id)}
            onView ={() => openViewData(rowData.id)} 
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

    if(rol === 'ROLE_ADMIN'){
        useEffect(() => {
            const token = localStorage.getItem('token');
            axios.get(`${apiUrl}/vehiculos`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                const sortedVehiculos = response.data.sort((a, b) => b.id - a.id);
                setVehiculos(sortedVehiculos);
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
    }else{
        useEffect(() => {
            const token = localStorage.getItem('token');
            axios.get(`${apiUrl}/vehiculo/unidad/${unidad_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                const sortedVehiculos = response.data.sort((a, b) => b.id - a.id);
                setVehiculos(sortedVehiculos);
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
    }
    
    const activeVehiculos = vehiculos.filter(vehiculo => vehiculo.estado === 'Activo');
    const activeVehiculosCount = activeVehiculos.length;

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

    const renderVehIculo = () => (
        <div className="container mx-auto h-auto px-4">
            {
                rol === "ROLE_ADMIN" ? 
                    <h5 className="text-2xl font-bold text-cyan-700 dark:text-white">Vehículos</h5>
                :   
                    <h5 className="text-2xl font-bold text-cyan-700 dark:text-white">Parque de Vehículos - Unidad: {unidad_name}</h5>
            }
            
            <br />
            <div className="flex space-x-4 mb-2">
                <Button onClick={() => setOpenNewModal(true)} className="mb-2">
                    Nuevo Vehículo <HiOutlinePlus className="ml-2 h-5 w-5" />
                </Button>

                <Button onClick={handleDownloadExcel} className="mb-2">
                    Descargar Excel <HiOutlineDownload className="ml-2 h-5 w-5" />
                </Button>
            </div>

            <DataTable 
                value={activeVehiculos}
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                filters={filters}
                globalFilterFields={['matricula','indice_consumo_normado','servicio','estado_tecnico','tipo_portador.nombre','unidad.nombre']}
                header={renderHeader()}
                filterDisplay="row"
                emptyMessage="No hay datos disponibles"
                className="p-datatable-gridlines p-component table-auto w-full text-left"
            >
                <Column 
                    field="matricula" 
                    header="MATRÍCULA" 
                    body={(rowData) => renderWithTooltip(rowData, 'matricula')} 
                    className="p-col text-sm font-medium text-gray-900 px-6 py-4"
                />
                <Column 
                    field="indice_consumo_normado" 
                    header="ÍNDICE" 
                    body={(rowData) => renderWithTooltip(rowData, 'indice_consumo_normado')}
                    className="p-col text-sm font-medium text-gray-900 px-6 py-4"
                />
                <Column 
                    field="servicio" 
                    header="SERVICIO" 
                    body={(rowData) => renderWithTooltip(rowData, 'servicio')}
                    className="p-col text-sm font-medium text-gray-900 px-6 py-4"
                />
                <Column 
                    field="estado_tecnico" 
                    header="ESTADO TÉCNICO" 
                    body={(rowData) => renderWithTooltip(rowData, 'estado_tecnico')}
                    className="p-col text-sm font-medium text-gray-900 px-6 py-4"
                />
                <Column 
                    field="tipo_portador.nombre" 
                    header="TIPO DE PORTADOR" 
                    body={(rowData) => renderWithTooltip(rowData, 'tipo_portador.nombre')}
                    className="p-col text-sm font-medium text-gray-900 px-6 py-4"
                />
                
                {
                    rol === 'ROLE_ADMIN' ?
                    <Column 
                        field="unidad.nombre" 
                        header="UNIDAD" 
                        body={(rowData) => renderWithTooltip(rowData, 'unidad.nombre')}
                        className="p-col text-sm font-medium text-gray-900 px-6 py-4"
                    />
                : null
                }    
                <Column 
                    body={actionBodyTemplate} 
                    header="ACCIONES" 
                    className="p-col text-sm font-medium text-gray-900 px-6 py-4"
                />
            </DataTable>
            <div className="flex flex-wrap gap-2">
                <Button>Vehículos Activos: {activeVehiculosCount}</Button>
                <Link to='/parque-vehiculos/inactive'>
                    <Button>
                        Ver Vehículos Inactivos <HiOutlineArrowNarrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </div>
        </div>
    );

    return (
        <Layout>
            
            <section className=" bg-white dark:bg-gray-800 relative shadow-md rounded-lg overflow-y-auto">
                <div role="status" className="w-full p-4 space-y-4 divide-y divide-gray-200 dark:divide-gray-700 md:p-6 dark:border-gray-700">
                    {loading ? renderLoadingElements() : (
                        <PrimeReactProvider>
                            {renderVehIculo()}
                        </PrimeReactProvider>
                    )}
                </div>
                <ToastNotification show={showToastSUCC} type="success" message={toastMessage} onClose={() => setShowToastSUCC(false)} />
                <ToastNotification show={showToastERR} type="error" message={toastMessage} onClose={() => setShowToastERR(false)} />
                
                <Modal show={openNewModal}  size='6xl'onClose={() => {setOpenNewModal(false); resetFormData();}}>
                    <Modal.Header onClose={() => { setOpenNewModal(false); resetFormData(); }}>
                        Nuevo Vehículo
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div class="grid grid-cols-3 gap-3">
                                <div>
                                    <Label htmlFor="no_vehiculo">No. del Vehículo</Label>
                                    <TextInput id="no_vehiculo" name="no_vehiculo" maxLength={30} value={formData.no_vehiculo} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa el No. del Vehículo.')} onInput={(e) => e.target.setCustomValidity('')}/>
                                </div>
                                <div>
                                    <Label htmlFor="ubicacion">Ubicación</Label>
                                    <TextInput id="ubicacion" name="ubicacion" maxLength={30} value={formData.ubicacion} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa la Ubicación.')} onInput={(e) => e.target.setCustomValidity('')}/>
                                </div>
                                <div>
                                    <Label htmlFor="anho_fabricacion">Año de Fabricación</Label>
                                    <input type='number' id="anho_fabricacion" name="anho_fabricacion" maxLength={30} value={formData.anho_fabricacion} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa el Año de Fabricación.')} onInput={(e) => e.target.setCustomValidity('')} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                </div>
                                {/** Fila 1 */}
                                <div>
                                    <Label htmlFor="matricula">Matrícula</Label>
                                    <TextInput id="matricula" name="matricula" maxLength={30} value={formData.matricula} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa la Matrícula.')} onInput={(e) => e.target.setCustomValidity('')}/>
                                </div>
                                <div>
                                    <Label htmlFor="no_carroceria">No. de Carrocería</Label>
                                    <TextInput id="no_carroceria" name="no_carroceria" maxLength={30} value={formData.no_carroceria} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa el No. de Carrocería.')} onInput={(e) => e.target.setCustomValidity('')}/>
                                </div>
                                <div>
                                    <Label htmlFor="no_vin">No. de Vin</Label>
                                    <TextInput id="no_vin" name="no_vin" maxLength={30} value={formData.no_vin} onChange={handleInputChange} onInput={(e) => e.target.setCustomValidity('')}/>
                                </div>
                                {/** Fila 2 */}
                                <div>
                                    <Label htmlFor="no_motor_original">No. de Motor Original</Label>
                                    <TextInput id="no_motor_original" name="no_motor_original" maxLength={30} value={formData.no_motor_original} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa el No. de Motor Original.')} onInput={(e) => e.target.setCustomValidity('')}/>
                                </div>
                                <div>
                                    <Label htmlFor="servicio">Servicio</Label>
                                    <Select id="servicio" name="servicio" value={formData.servicio} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                            <option value="">-Seleccione un servicio-</option>
                                            {options.map(opt => (
                                                <option key={opt.value} value={opt.label}>{opt.label}</option>
                                            ))}
                                    </Select> 
                                    {/* <Select2 
                                        className="basic-single "
                                        classNamePrefix="select"
                                        defaultValue={activeActividadesCda[0]}
                                        onChange={(selectedOption) => setFormData({ ...formData, servicio: selectedOption.label })}
                                        isSearchable={isSearchable}
                                        name="color"
                                        options={options}
                                    />*/}

                                    
                                </div>
                                <div>
                                    <Label htmlFor="indice_consumo_normado">Índice de Consumo Normado</Label>
                                    <TextInput id="indice_consumo_normado" name="indice_consumo_normado" min='0' value={formData.indice_consumo_normado} color={colorInputText}
                                    helperText={
                                        <>
                                            <p>{msgInputText}</p> 
                                        </>
                                    }
                                    onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa el Índice de Consumo Normado, debe ser mayor o igual a 0.')} onInput={(e) => e.target.setCustomValidity('')} aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                </div>
                                {/** Fila 3 */}
                                <div>
                                    <Label htmlFor="tipo_vehiculo_id">Tipo de Vehículo</Label>
                                    <Select id="tipo_vehiculo_id" name="tipo_vehiculo_id" value={formData.tipo_vehiculo_id} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                            <option value="">-Seleccione un vehículo-</option>
                                            {tipoVehiculos.map(tipoVehiculo => (
                                                <option key={tipoVehiculo.id} value={tipoVehiculo.id}>{tipoVehiculo.nombre}</option>
                                            ))}
                                    </Select> 
                                </div>
                                <div>
                                    <Label htmlFor="marca_id">Marca</Label>
                                    <Select id="marca_id" name="marca_id" value={formData.marca_id} onChange={handleMarcaChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                            <option value="">-Seleccione una marca-</option>
                                            {activeMarcas.map(marca => (
                                                <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                                            ))}
                                    </Select> 
                                </div>
                                <div>
                                    <Label htmlFor="modelo_id">Modelo</Label>
                                    <Select id="modelo_id" name="modelo_id" value={formData.modelo_id} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                            <option value="">-Seleccione un modelo-</option>
                                            {activeModelos.map(modelo => (
                                                <option key={modelo.id} value={modelo.id}>{modelo.nombre}</option>
                                            ))}
                                    </Select>
                                </div>
                                {/** Fila 4 */}
                                <div>
                                    <Label htmlFor="tipo_portador_id">Tipo de Portador</Label>
                                    <Select id="tipo_portador_id" name="tipo_portador_id" value={formData.tipo_portador_id} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                            <option value="">-Seleccione un tipo de portador-</option>
                                            {activeTipoPortadores.map(tipoportador => (
                                                <option key={tipoportador.id} value={tipoportador.id}>{tipoportador.nombre}</option>
                                            ))}
                                    </Select> 
                                </div>
                                
                                <div>
                                    <Label htmlFor="estado_tecnico">Estado Técnico</Label>
                                    <Select id="estado_tecnico" name="estado_tecnico" value={formData.estado_tecnico} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                            <option value="">-Seleccione un estado técnico-</option>
                                            <option value="Bueno">Bueno</option>
                                            <option value="Regular">Regular</option>
                                            <option value="Mal">Mal</option>
                                            <option value="ParalizadoCP">Paralizado Corto Plazo</option>
                                            <option value="ParalizadoLP">Paralizado Largo Plazo</option>
                                    </Select>
                                </div>
                                {
                                        rol === 'ROLE_ADMIN' ?
                                    <div>
                                        
                                        
                                        <Label htmlFor="unidad_id">Unidad</Label>
                                        <Select id="unidad_id" name="unidad_id" value={formData.unidad_id} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                                <option value="">-Seleccione una unidad-</option>
                                                {activeUnidades.map(unidad => (
                                                    <option key={unidad.id} value={unidad.id}>{unidad.nombre}</option>
                                                ))}
                                        </Select> 
                                        
                                    </div>
                                :   <div></div>
                                }
                                {/** Fila 4 */}
                                <div>
                                    <Label htmlFor="observaciones">Observaciones</Label>
                                    <Textarea id="observaciones" name="observaciones" maxLength={1000} rows={3} value={formData.observaciones} color={colorInputTextArea}
                                        helperText={
                                            <>
                                                <p>{msgInputTextArea}</p> 
                                            </>
                                        }
                                        onChange={handleInputChange} onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa el nombre.')} onInput={(e) => e.target.setCustomValidity('')} />
                                </div>
                                
                            </div>
                            <Button type="submit">Guardar</Button>
                        </form>
                    </Modal.Body>
                </Modal>

                <Modal show={openEdtModal}  size='6xl'onClose={() => {setOpenEdtModal(false); resetFormData();}}>
                    <Modal.Header onClose={() => { setOpenEdtModal(false); resetFormData(); }}>
                        Editar Vehículo
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleEdtSubmit} className="space-y-4">
                                <div class="grid grid-cols-3 gap-3">
                                    <div>
                                        <Label htmlFor="no_vehiculo">No. del Vehículo</Label>
                                        <TextInput id="no_vehiculo" name="no_vehiculo" maxLength={30} value={formData.no_vehiculo} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa el nombre.')} onInput={(e) => e.target.setCustomValidity('')}/>
                                    </div>
                                    <div>
                                        <Label htmlFor="ubicacion">Ubicación</Label>
                                        <TextInput id="ubicacion" name="ubicacion" maxLength={30} value={formData.ubicacion} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa el nombre.')} onInput={(e) => e.target.setCustomValidity('')}/>
                                    </div>
                                    <div>
                                        <Label htmlFor="noanho_fabricacionmbre">Año de Fabricación</Label>
                                        <input type='number' id="anho_fabricacion" name="anho_fabricacion" maxLength={30} value={formData.anho_fabricacion} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa el nombre.')} onInput={(e) => e.target.setCustomValidity('')} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                    </div>
                                    {/** Fila 1 */}
                                    <div>
                                        <Label htmlFor="matricula">Matrícula</Label>
                                        <TextInput id="matricula" name="matricula" maxLength={30} value={formData.matricula} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa el nombre.')} onInput={(e) => e.target.setCustomValidity('')}/>
                                    </div>
                                    <div>
                                        <Label htmlFor="no_carroceria">No. de Carrocería</Label>
                                        <TextInput id="no_carroceria" name="no_carroceria" maxLength={30} value={formData.no_carroceria} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa el nombre.')} onInput={(e) => e.target.setCustomValidity('')}/>
                                    </div>
                                    <div>
                                        <Label htmlFor="no_vin">No. de Vin</Label>
                                        <TextInput id="no_vin" name="no_vin" maxLength={30} value={formData.no_vin} onChange={handleInputChange}  onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa el nombre.')} onInput={(e) => e.target.setCustomValidity('')}/>
                                    </div>
                                    {/** Fila 2 */}
                                    <div>
                                        <Label htmlFor="no_motor_original">No. de Motor Original</Label>
                                        <TextInput id="no_motor_original" name="no_motor_original" maxLength={30} value={formData.no_motor_original} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa el nombre.')} onInput={(e) => e.target.setCustomValidity('')}/>
                                    </div>
                                    <div>
                                        <Label htmlFor="servicio">Servicio</Label>
                                        <Select id="servicio" name="servicio" value={formData.servicio} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                            <option value="">-Seleccione un servicio-</option>
                                            {options.map(opt => (
                                                <option key={opt.value} value={opt.label}>{opt.label}</option>
                                            ))}
                                        </Select>
                                        {/** 
                                        <Select2
                                        className="basic-single "
                                        classNamePrefix="select"
                                        value={options.find(option => option.label === formData.servicio)}
                                        onChange={(selectedOption) => setFormData({ ...formData, servicio: selectedOption.label })}
                                        
                                        name="color"
                                        options={options}
                                    />*/}
                                    </div>
                                    <div>
                                        <Label htmlFor="indice_consumo_normado">Índice de Consumo Normado</Label>
                                        <TextInput id="indice_consumo_normado" name="indice_consumo_normado" min='0' value={formData.indice_consumo_normado} color={colorInputTextEdt}
                                        helperText={
                                            <>
                                                <p>{msgInputTextEdt}</p> 
                                            </>
                                        }
                                        onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa el monto de la tarifa, debe ser mayor que  0.')} onInput={(e) => e.target.setCustomValidity('')} aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                    </div>
                                    {/** Fila 3 */}
                                    <div>
                                        <Label htmlFor="tipo_vehiculo_id">Tipo de Vehículo</Label>
                                        <Select id="tipo_vehiculo_id" name="tipo_vehiculo_id" value={formData.tipo_vehiculo_id} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                                <option value="">-Seleccione un vehículo-</option>
                                                {tipoVehiculos.map(tipoVehiculo => (
                                                    <option key={tipoVehiculo.id} value={tipoVehiculo.id}>{tipoVehiculo.nombre}</option>
                                                ))}
                                        </Select> 
                                    </div>
                                    <div>
                                        <Label htmlFor="marca_id">Marca</Label>
                                        <Select id="marca_id" name="marca_id" value={formData.marca_id} onChange={handleMarcaChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                                <option value="">-Seleccione una marca-</option>
                                                {activeMarcas.map(marca => (
                                                    <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                                                ))}
                                        </Select> 
                                    </div>
                                    <div>
                                        <Label htmlFor="modelo_id">Modelo</Label>
                                        <Select id="modelo_id" name="modelo_id" value={formData.modelo_id} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                                <option value="">-Seleccione un modelo-</option>
                                                {activeModelos.map(modelo => (
                                                    <option key={modelo.id} value={modelo.id}>{modelo.nombre}</option>
                                                ))}
                                        </Select>
                                    </div>
                                    {/** Fila 4 */}
                                    <div>
                                        <Label htmlFor="tipo_portador_id">Tipo de Portador</Label>
                                        <Select id="tipo_portador_id" name="tipo_portador_id" value={formData.tipo_portador_id} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                                <option value="">-Seleccione un tipo de portador-</option>
                                                {activeTipoPortadores.map(tipoportador => (
                                                    <option key={tipoportador.id} value={tipoportador.id}>{tipoportador.nombre}</option>
                                                ))}
                                        </Select> 
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="estado_tecnico">Estado Técnico</Label>
                                        <Select id="estado_tecnico" name="estado_tecnico" value={formData.estado_tecnico} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                                <option value="">-Seleccione un estado técnico-</option>
                                                <option value="Bueno">Bueno</option>
                                                <option value="Regular">Regular</option>
                                                <option value="Mal">Mal</option>
                                                <option value="ParalizadoCP">Paralizado Corto Plazo</option>
                                                <option value="ParalizadoLP">Paralizado Largo Plazo</option>
                                        </Select>
                                    </div>
                                    {
                                            rol === 'ROLE_ADMIN' ?
                                        <div>
                                            
                                            
                                            <Label htmlFor="unidad_id">Unidad</Label>
                                            <Select id="unidad_id" name="unidad_id" value={formData.unidad_id} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                                    <option value="">-Seleccione una unidad-</option>
                                                    {activeUnidades.map(unidad => (
                                                        <option key={unidad.id} value={unidad.id}>{unidad.nombre}</option>
                                                    ))}
                                            </Select> 
                                            
                                        </div>
                                    :   <div></div>
                                    }
                                    {/** Fila 4 */}
                                    <div>
                                        <Label htmlFor="observaciones">Observaciones</Label>
                                        <Textarea id="observaciones" name="observaciones" maxLength={1000} rows={3} value={formData.observaciones} color={colorInputTextAreaEdt}
                                         helperText={
                                            <>
                                                <p>{msgInputTextAreaEdt}</p> 
                                            </>
                                        }
                                        onChange={handleInputChange} onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa el nombre.')} onInput={(e) => e.target.setCustomValidity('')} />
                                    </div>
                                    
                                </div>
                                <Button type="submit">Guardar</Button>
                        </form>
                    </Modal.Body>
                </Modal>

                <Modal show={openViewModal}  size='6xl' onClose={() => {setOpenViewModal(false);}}>
                    <Modal.Header onClose={() => { setOpenViewModal(false);}}>
                        Ver Vehículo
                    </Modal.Header>
                    <Modal.Body>
                        <div className="space-y-4">
                                <div class="grid grid-cols-3 gap-3">
                                    <div>
                                        <Label htmlFor="no_vehiculo">No. del Vehículo:</Label><br></br>
                                        <p className="text-gray-700 dark:text-gray-400">{formDataView.no_vehiculoView}</p>
                                    </div>
                                    <div>
                                        <Label htmlFor="ubicacion">Ubicación:</Label><br></br>
                                        <p className="text-gray-700 dark:text-gray-400">{formDataView.ubicacionView}</p>                                     
                                    </div>
                                    <div>
                                        <Label htmlFor="noanho_fabricacion">Año de Fabricación:</Label><br></br>
                                        <p className="text-gray-700 dark:text-gray-400">{formDataView.anho_fabricacionView}</p>
                                    </div>
                                    
                                    {/** Fila 1 */}
                                    <div>
                                        <Label htmlFor="matricula">Matrícula:</Label><br></br>
                                        <p className="text-gray-700 dark:text-gray-400">{formDataView.matriculaView}</p>
                                    </div>
                                    <div>
                                        <Label htmlFor="no_carroceria">No. de Carrocería:</Label><br></br>
                                        <p className="text-gray-700 dark:text-gray-400">{formDataView.no_carroceriaView}</p>
                                    </div>
                                    <div>
                                        <Label htmlFor="no_vin">No. de Vin:</Label><br></br>
                                        <p className="text-gray-700 dark:text-gray-400">{formDataView.no_vinView}</p>
                                    </div>
                                    {/** Fila 2 */}
                                    <div>
                                        <Label htmlFor="no_motor_original">No. de Motor Original:</Label><br></br>
                                        <p className="text-gray-700 dark:text-gray-400">{formDataView.no_motor_originalView}</p>
                                    </div>
                                    <div>
                                        <Label htmlFor="servicio">Servicio:</Label><br></br>
                                        <p className="text-gray-700 dark:text-gray-400">{formDataView.servicioView}</p>
                                    </div>
                                    <div>
                                        <Label htmlFor="indice_consumo_normado">Índice de Consumo Normado:</Label><br></br>
                                        <p className="text-gray-700 dark:text-gray-400">{formDataView.indice_consumo_normadoView}</p>
                                    </div>
                                    {/** Fila 3 */}
                                    <div>
                                        <Label htmlFor="tipo_vehiculo_id">Tipo de Vehículo:</Label><br></br>
                                        <p className="text-gray-700 dark:text-gray-400">{formDataView.tipo_vehiculoView}</p>
                                    </div>
                                    <div>
                                        <Label htmlFor="marca_id">Marca:</Label><br></br>
                                        <p className="text-gray-700 dark:text-gray-400">{formDataView.marcaView}</p>
                                    </div>
                                    <div>
                                        <Label htmlFor="modelo_id">Modelo:</Label><br></br>
                                        <p className="text-gray-700 dark:text-gray-400">{formDataView.modeloView}</p>
                                    </div>
                                    {/** Fila 4 */}
                                    <div>
                                        <Label htmlFor="tipo_portador_id">Tipo de Portador:</Label><br></br>
                                        <p className="text-gray-700 dark:text-gray-400">{formDataView.tipo_portadorView}</p>
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="estado_tecnico">Estado Técnico:</Label><br></br>
                                        <p className="text-gray-700 dark:text-gray-400">{formDataView.estado_tecnicoView}</p>
                                    </div>
                                    {
                                            rol === 'ROLE_ADMIN' ?
                                        <div>
                                            
                                            
                                            <Label htmlFor="unidad_id">Unidad:</Label><br></br>
                                            <p className="text-gray-700 dark:text-gray-400">{formDataView.unidadView}</p>
                                            
                                        </div>
                                    :   <div></div>
                                    }
                                    {/** Fila 4 */}
                                    <div>
                                        <Label htmlFor="observaciones">Observaciones:</Label><br></br>
                                        <p className="text-gray-700 dark:text-gray-400">{formDataView.observacionesView}</p>
                                    </div>
                                    
                                </div>
                        </div>       
                        
                    </Modal.Body>
                </Modal>    

                <ConfirmacionModal show={openModal} onClose={() => setOpenModal(false)} onConfirm={confirmDelete} msg={'¿Desea eliminar este vehículo?'} />
                
            </section>
        </Layout>
    );
}
export default ParqueVehiculosActivos;