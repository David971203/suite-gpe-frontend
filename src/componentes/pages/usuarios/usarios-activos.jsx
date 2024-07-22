"use client";
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../../../utils/apiUrl';
import { renderWithTooltip } from '../../../utils/renderWithTooltip';
import { TextInput } from "flowbite-react";
import { Label, Select} from 'flowbite-react';
import { Tooltip ,Toast } from 'flowbite-react';
import { HiOutlineSearch, HiPencil, HiTrash,HiOutlineArrowNarrowRight,HiOutlinePlus,HiOutlineExclamationCircle,HiX,HiCheck,HiEye, HiEyeOff} from "react-icons/hi";
import Layout from "../../layout/layout";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PrimeReactProvider } from 'primereact/api';
import { Button, Modal } from "flowbite-react";
import { FilterMatchMode } from 'primereact/api';
import 'flowbite/dist/flowbite.css';
import '../styles.css';

function UsariosActivos() {
  

    const [users, setUsers] = useState([]);
    const [user, setUser] = useState([]);
    const [unidadesSelect, setUnidadesSelect] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [openModal, setOpenModal] = useState(false);
    const [openNewModal, setOpenNewModal] = useState(false);
    const [openEdtModal, setOpenEdtModal] = useState(false);
    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        username: '',
        hashed_password: '',
        confirm_password: '',
        estado: 'Activo',
        rol_id: '',
        unidad_id: 0
      });
    const [showPassword, setShowPassword] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showToastSUCC, setShowToastSUCC] = useState(false);
    const [showToastERR, setShowToastERR] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [colorInputText, setcolorInputText] = useState('gray');
    const [msgInputText, setmsgInputText] = useState('');

    const [colorSelect, setcolorSelect] = useState('gray');
    const [msgSelect, setmsgSelect] = useState('');

    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isUnidadDisabled, setIsUnidadDisabled] = useState(false);

    
   
    const resetFormData = () => {
        setFormData({
            nombre: '',
            apellido: '',
            username: '',
            hashed_password: '',
            confirm_password: '',
            estado: 'Activo',
            rol_id: '',
            unidad_id: 0
        });

        setIsUnidadDisabled(false);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`${apiUrl}/unidades`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => setUnidadesSelect(response.data))
        .catch(error => {
            const errorMsg = error.response?.data?.detail || 'Error al actualizar el estado';
            setToastMessage(errorMsg);
            setShowToastERR(true);
            setTimeout(() => setShowToastERR(false), 5000);
        });
    }, []);

    const activeUnidadesSelect = unidadesSelect.filter(unidadSelect => unidadSelect.estado === 'Activo');

    //Add
          
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`${apiUrl}/rols`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => setRoles(response.data))
        .catch(error => console.error("Error fetching roles:", error));
    }, []);

    const handleRoleChange = (e) => {
        const selectedRoleId = e.target.value;
        
        
        if (selectedRoleId === '1') {
            setIsUnidadDisabled(true);
        } else {
            setIsUnidadDisabled(false);
        }

        handleInputChange(e);
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
        return regex.test(password);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.hashed_password !== formData.confirm_password) {
            setcolorInputText('failure');
            setmsgInputText('Las contraseñas no coinciden!!');
            
            setTimeout(() => {
                setShowToastERR(false);
                setcolorInputText('gray');
                setmsgInputText('');
            }
            , 5000);
            
            return;
        }

        if (!validatePassword(formData.hashed_password)) {
            setcolorInputText('failure');
            setmsgInputText('La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un caracter especial!!');
            
            setTimeout(() => {
                setShowToastERR(false);
                setcolorInputText('gray');
                setmsgInputText('');
            }, 5000);
            return;
        }

        
        if(parseInt(formData.rol_id) !== 1 && parseInt(formData.unidad_id) === 0){
            setcolorSelect('failure');
            setmsgSelect('Debe seleccionar una unidad sino tiene rol Administrador!!');
            
            setTimeout(() => {
                setShowToastERR(false);
                setcolorSelect('gray');
                setmsgSelect('');
            }, 5000);
            return;
        }

        let uni_tmp = 0;
        if(parseInt(formData.rol_id) !== 1){
            uni_tmp = parseInt(formData.unidad_id);
        }

        const token = localStorage.getItem('token');
        axios.post(`${apiUrl}/user`, {
            nombre: formData.nombre,
            apellido: formData.apellido,
            username: formData.username,
            hashed_password: formData.hashed_password,
            estado: formData.estado,
            rol_id: formData.rol_id,
            unidad_id: uni_tmp
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setUsers([response.data.user,...users]);
            setToastMessage(response.data.message);
            setShowToastSUCC(true);
            setTimeout(() => setShowToastSUCC(false), 5000);
            setOpenNewModal(false);
            resetFormData();
        })
        .catch(error => {
            setOpenNewModal(false);
            resetFormData();
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

    // Edt
    const openModalWithUserData = (userId) => {
        
        setSelectedUserId(userId);
        fetchUserData(userId);
        setOpenEdtModal(true);
        
    };
    useEffect(() => {
        if (selectedUserId !== null) {
            fetchUserData(selectedUserId);
        }
    }, [selectedUserId]);

    const fetchUserData = async (selectedUserId) => {
        const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
        let uni = 0;
        await axios.get(`${apiUrl}/user/${selectedUserId}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Incluir el token en los encabezados
            }
        })
            .then(response => {

                if(response.data.unidad_id !== null)
                    uni = response.data.unidad_id;

                if(response.data.rol_id === 1)
                    setIsUnidadDisabled(true);
                
                setFormData({
                    nombre: response.data.nombre,
                    apellido: response.data.apellido,
                    username: response.data.username,
                    hashed_password: '',
                    confirm_password: '',
                    estado: response.data.estado,
                    rol_id: response.data.rol_id,
                    unidad_id: uni
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

        if(formData.hashed_password !== '' || formData.confirm_password !== ''){
            if (formData.hashed_password !== formData.confirm_password) {
                setcolorInputText('failure');
                setmsgInputText('Las contraseñas no coinciden!!');
                
                setTimeout(() => {
                    setShowToastERR(false);
                    setcolorInputText('gray');
                    setmsgInputText('');
                }
                , 5000);
                
                return;
            }
    
            if (!validatePassword(formData.hashed_password)) {
                setcolorInputText('failure');
                setmsgInputText('La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un caracter especial!!');
                
                setTimeout(() => {
                    setShowToastERR(false);
                    setcolorInputText('gray');
                    setmsgInputText('');
                }, 5000);
                return;
            }
        }
        
        console.log(formData.rol_id);
        console.log(formData.unidad_id);
        if(parseInt(formData.rol_id) !== 1 && parseInt(formData.unidad_id) === 0){
            setcolorSelect('failure');
            setmsgSelect('Debe seleccionar una unidad sino tiene rol Administrador!!');
            
            setTimeout(() => {
                setShowToastERR(false);
                setcolorSelect('gray');
                setmsgSelect('');
            }, 5000);
            return;
        }

        const token = localStorage.getItem('token');
        let uni_p = 0;
        

        
        if(parseInt(formData.rol_id) !== 1){
            if(formData.unidad_id === null)
                uni_p = 0;
            else
                uni_p = parseInt(formData.unidad_id); 
        }

        console.log(uni_p);    
        axios.put(`${apiUrl}/user/${selectedUserId}`, {
            nombre: formData.nombre,
            apellido: formData.apellido,
            username: formData.username,
            hashed_password: formData.hashed_password,
            estado: formData.estado,
            rol_id: formData.rol_id,
            unidad_id: uni_p
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setUsers((prevUsers) => 
                prevUsers.map(user => user.id === selectedUserId ? response.data.user : user)
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
    const handleDeleteClick = (userId) => {
        setSelectedUserId(userId);
        setOpenModal(true);
    };

    const confirmDelete = () => {
        const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local

        axios.put(`${apiUrl}/user/estado/${selectedUserId}`, { estado: "Inactivo" }, {
            headers: {
                'Authorization': `Bearer ${token}` // Incluir el token en los encabezados
            }
        })
            .then(response => {
                setUsers(users.filter(user => user.id !== selectedUserId));
                setOpenModal(false);
                setToastMessage(response.data.message);
                setShowToastERR(true); // Mostrar Toast
                setTimeout(() => setShowToastERR(false), 5000);
            })
            .catch(error => {
              setOpenModal(false);
              
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

    //Tabla

    const actionBodyTemplate = (rowData) => {
        
        
        return (
            <React.Fragment>
              <div className="flex flex-wrap gap-2">
                <Tooltip content="Editar" placement="top">
                  <HiPencil onClick={() => {openModalWithUserData(rowData.id),setUser(rowData.username);}} className="h-6 w-6 cursor-pointer" />
                </Tooltip>
                {rowData.username !== 'admin' && (
                  <Tooltip content="Eliminar" placement="top">
                    <HiTrash onClick={() => handleDeleteClick(rowData.id)} className="h-6 w-6 cursor-pointer" />
                  </Tooltip>
                )}
              </div>
            </React.Fragment>
        );
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-end dark:bg-gray-800">
                <TextInput value={globalFilterValue} onChange={onGlobalFilterChange} rightIcon={HiOutlineSearch} id="input-gray" placeholder="Buscar" className="mb-2" />
            </div>
        );
    };

    const header = renderHeader();

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(apiUrl + '/users', {
            headers: {
                'Authorization': `Bearer ${token}` // Incluir el token en los encabezados
            }
        })
            .then(response => {
                const sortedUsers = response.data.sort((a, b) => b.id - a.id);
                setUsers(sortedUsers);
                setLoading(false);
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
                    }, 3000); // 2 segundos de retraso antes de la redirección
                    setLoading(false);
                }else{
                    setToastMessage(error.response.data.detail);
                    setShowToastERR(true); // Mostrar Toast
                    setTimeout(() => setShowToastERR(false), 5000);
                    setTimeout(() => {
                        setShowToastERR(false);
                        if (error.response.data.detail === 'No tiene permisos para acceder a esta ruta') {
                        // Token inválido o expirado, redirigir a la página de inicio de sesión
                        
                        navigate('/');
                        }
                    }, 3000); 
                    
                    setLoading(false);
                }
                
                
            });
    }, []);

    const activeUsers = users.filter(user => user.estado === 'Activo');
    const activeUsersCount = activeUsers.length;

    const renderLoadingElements = () => {
        const elements = [];
        for (let i = 0; i < 5; i++) {
            elements.push(
                <div key={i} className="flex items-center justify-between pt-4">
                    <div>
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                        <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                    </div>
                    <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                </div>
            );
        }
        return elements;
    };

    const renderUsers = () => {
        return (
            <div className="container mx-auto h-auto px-4">
                <h5 className="text-2xl font-bold text-cyan-700 dark:text-white">Usuarios</h5>
                <br />
                <Button onClick={() => setOpenNewModal(true)} className='mb-2'>Nuevo Usuario <HiOutlinePlus className="ml-2 h-5 w-5"  /></Button>
                <DataTable value={activeUsers}
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    filters={filters}
                    globalFilterFields={['nombre', 'apellido', 'username', 'rol.literal']}
                    header={header}
                    filterDisplay="row"
                    emptyMessage="No hay datos disponibles"
                    className="p-datatable-gridlines p-component table-auto w-full text-left">
                    <Column field="nombre" header="NOMBRE" body={(rowData) => renderWithTooltip(rowData, 'nombre')} className="p-col text-sm font-medium text-gray-900 px-6 py-4"></Column>
                    <Column field="apellido" header="APELLIDOS" body={(rowData) => renderWithTooltip(rowData, 'apellido')} className="p-col text-sm font-medium text-gray-900 px-6 py-4"></Column>
                    <Column field="username" header="USUARIO" body={(rowData) => renderWithTooltip(rowData, 'username')} className="p-col text-sm font-medium text-gray-900 px-6 py-4"></Column>
                    <Column field="rol.literal" header="ROL" body={(rowData) => renderWithTooltip(rowData, 'rol.literal')} className="p-col text-sm font-medium text-gray-900 px-6 py-4"></Column>
                    <Column field="unidad.nombre" header="UNIDAD" body={(rowData) => renderWithTooltip(rowData, 'unidad.nombre')} className="p-col text-sm font-medium text-gray-900 px-6 py-4"></Column>
                    <Column body={actionBodyTemplate} header="ACCIONES" className="p-col text-sm font-medium text-gray-900 px-6 py-4"></Column>
                </DataTable>
                <div className="flex flex-wrap  gap-2">
                    <Button>Usuarios Activos: {activeUsersCount}</Button>
                    <Button href='/users/inactive'>Ver Usuarios Inactivos <HiOutlineArrowNarrowRight className="ml-2 h-5 w-5" /></Button>
                </div>
            </div>
        );
    };

    let content;
    if (loading) {
        content = renderLoadingElements();
    } else {
        content = (
            <PrimeReactProvider>
                {renderUsers()}
            </PrimeReactProvider>
        );
    }
    //Tabla
    
    
    return (
        <Layout>
            <section className="bg-white dark:bg-gray-800 relative shadow-md rounded-lg mx-auto h-auto">
              
                <div role="status" className="w-full p-4 space-y-4 divide-y divide-gray-200 dark:divide-gray-700 md:p-6 dark:border-gray-700">
                    {content}
                </div>
                {showToastSUCC && (
                    <div className="fixed top-24 right-8">
                        <Toast>
                            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                            <HiCheck className="h-5 w-5" />
                            </div>
                            <div className="ml-3 text-sm font-normal">{toastMessage}</div>
                            <Toast.Toggle />
                        </Toast>
                    </div>
                )}
                {showToastERR && (
                    <div className="fixed top-24 right-8">
                        <Toast>
                            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                                <HiX className="h-5 w-5" />
                            </div>
                            <div className="ml-3 text-sm font-normal">{toastMessage}</div>
                            <Toast.Toggle />
                        </Toast>
                    </div>
                )}

                <Modal show={openNewModal}  size='md'onClose={() => {setOpenNewModal(false); resetFormData();}}>
                    <Modal.Header onClose={() => { setOpenNewModal(false); resetFormData(); }}>
                        Nuevo Usuario
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="nombre">Nombre</Label>
                                <TextInput id="nombre" name="nombre" maxLength={30} value={formData.nombre} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa tu nombre.')} onInput={(e) => e.target.setCustomValidity('')}/>
                            </div>
                            <div>
                                <Label htmlFor="apellido">Apellido</Label>
                                <TextInput id="apellido" name="apellido" maxLength={30} value={formData.apellido} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa tu apellido.')} onInput={(e) => e.target.setCustomValidity('')}/>
                            </div>
                            <div>
                                <Label htmlFor="username">Nombre de Usuario</Label>
                                <TextInput id="username" name="username" minLength={5} maxLength={30} value={formData.username} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa tu usuario debe de tener de 5 a 30 caracteres.')} onInput={(e) => e.target.setCustomValidity('')}/>
                            </div>
                            <div>
                                <Label htmlFor="hashed_password">Contraseña</Label>
                                <TextInput id="hashed_password" name="hashed_password" color={colorInputText} minLength={8} maxLength={16} type={showPassword ? 'text' : 'password'} value={formData.hashed_password} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa tu contraseña debe de tener de 8 a 16 caracteres.')} onInput={(e) => e.target.setCustomValidity('')}/>
                            </div>
                            <div>
                                <Label htmlFor="confirm_password">Confirmar Contraseña</Label>
                                <TextInput id="confirm_password" name="confirm_password" color={colorInputText}
                                    helperText={
                                        <>
                                            <p>{msgInputText}</p> 
                                        </>
                                    } 
                                    minLength={8} maxLength={16} type="password" value={formData.confirm_password} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, confirma tu contraseña debe de tener de 8 a 16 caracteres.')} onInput={(e) => e.target.setCustomValidity('')}/>
                            </div>
                            
                            <div>
                                <Label htmlFor="rol_id">Rol</Label>
                                <Select id="rol_id" name="rol_id" value={formData.rol_id}  onChange={handleRoleChange}  required  onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                    <option value="">-Seleccione un rol-</option>
                                    {roles.map(rol => (
                                        <option key={rol.id} value={rol.id}>{rol.literal}</option>
                                    ))}
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="unidad_padre_id">Unidad</Label>
                                <Select id="unidad_id" name="unidad_id" value={formData.unidad_id} color={colorSelect} onChange={handleInputChange} disabled={isUnidadDisabled} onInput={(e) => e.target.setCustomValidity('')}>
                                    <option value="0">-Seleccione una unidad-</option>
                                    {activeUnidadesSelect.map(unidad => (
                                        <option key={unidad.id} value={unidad.id}>{unidad.nombre}</option>
                                    ))}
                                </Select>
                                <p className="red-text">{msgSelect}</p>
                            </div>
                            <Button type="submit">Guardar</Button>
                        </form>
                    </Modal.Body>
                </Modal>

                
                <Modal show={openEdtModal}  size='md'onClose={() => {setOpenEdtModal(false); resetFormData();}}>
                    <Modal.Header onClose={() => { setOpenEdtModal(false); resetFormData(); }}>
                        Editar Usuario
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleEdtSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="nombre">Nombre</Label>
                                <TextInput id="nombre" name="nombre" maxLength={30} value={formData.nombre} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa tu nombre.')} onInput={(e) => e.target.setCustomValidity('')}/>
                            </div>
                            <div>
                                <Label htmlFor="apellido">Apellido</Label>
                                <TextInput id="apellido" name="apellido" maxLength={30} value={formData.apellido} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa tu apellido.')} onInput={(e) => e.target.setCustomValidity('')}/>
                            </div>
                            <div>
                                <Label htmlFor="username">Nombre de Usuario</Label>
                                {
                                user === 'admin' ? 
                                <TextInput id="username" name="username" minLength={5} maxLength={30} value={formData.username} onChange={handleInputChange} required disabled readOnly onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa tu usuario debe de tener de 5 a 30 caracteres.')} onInput={(e) => e.target.setCustomValidity('')}/>
                                :    
                                <TextInput id="username" name="username" minLength={5} maxLength={30} value={formData.username} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa tu usuario debe de tener de 5 a 30 caracteres.')} onInput={(e) => e.target.setCustomValidity('')}/>    
                                }
                            </div>
                            <div>
                                <Label htmlFor="hashed_password">Contraseña</Label>
                                <TextInput id="hashed_password" name="hashed_password" color={colorInputText} minLength={8} maxLength={16} type="password" value={formData.hashed_password} onChange={handleInputChange}  onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa tu contraseña debe de tener de 8 a 16 caracteres.')} onInput={(e) => e.target.setCustomValidity('')}/>
                            </div>
                            <div>
                                <Label htmlFor="confirm_password">Confirmar Contraseña</Label>
                                <TextInput id="confirm_password" name="confirm_password" color={colorInputText}
                                    helperText={
                                        <>
                                            <p>{msgInputText}</p> 
                                        </>
                                    } 
                                    minLength={8} maxLength={16} type="password" value={formData.confirm_password} onChange={handleInputChange} onInvalid={(e) => e.target.setCustomValidity('Por favor, confirma tu contraseña debe de tener de 8 a 16 caracteres.')} onInput={(e) => e.target.setCustomValidity('')}/>
                            </div>
                            <div>
                                <Label htmlFor="rol_id">Rol</Label>

                                {
                                user === 'admin' ? 
                                    
                                    <Select id="rol_id" name="rol_id" value={formData.rol_id} onChange={handleRoleChange} required disabled readOnly onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                        <option value="">-Seleccione un rol-</option>
                                        {roles.map(rol => (
                                            <option key={rol.id} value={rol.id}>{rol.literal}</option>
                                        ))}
                                    </Select> 
                                : 
                                    <Select id="rol_id" name="rol_id" value={formData.rol_id} onChange={handleRoleChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                        <option value="">-Seleccione un rol-</option>
                                        {roles.map(rol => (
                                            <option key={rol.id} value={rol.id}>{rol.literal}</option>
                                        ))}
                                    </Select>
                                }     
                                
                            </div>
                            <div>
                                {
                                user === 'admin' ?

                                    <><Label htmlFor="unidad_padre_id">Unidad</Label>
                                        <Select id="unidad_id" name="unidad_id" value={formData.unidad_id} disabled readOnly color={colorSelect}  onChange={handleInputChange} onInput={(e) => e.target.setCustomValidity('')}>
                                            <option value="0">-Seleccione una unidad-</option>
                                            {activeUnidadesSelect.map(unidad => (
                                                <option key={unidad.id} value={unidad.id}>{unidad.nombre}</option>
                                            ))}
                                        </Select><p className="red-text">{msgSelect}</p></>
                                :
                                    <><Label htmlFor="unidad_padre_id">Unidad</Label>
                                        <Select id="unidad_id" name="unidad_id" value={formData.unidad_id}  color={colorSelect} onChange={handleInputChange} disabled={isUnidadDisabled} onInput={(e) => e.target.setCustomValidity('')}>
                                            <option value="0">-Seleccione una unidad-</option>
                                            {activeUnidadesSelect.map(unidad => (
                                                <option key={unidad.id} value={unidad.id}>{unidad.nombre}</option>
                                            ))}
                                        </Select><p className="red-text">{msgSelect}</p></>
                                }    
                            </div>
                            <Button type="submit">Guardar</Button>
                        </form>
                    </Modal.Body>
                </Modal>


                <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                    <Modal.Header></Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                ¿Desea eliminar este usuario?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="failure" onClick={confirmDelete}>
                                    {"Sí, estoy seguro"}
                                </Button>
                                <Button color="gray" onClick={() => setOpenModal(false)}>
                                    No, cancelar
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </section>
        </Layout>
    );
}

export default UsariosActivos;