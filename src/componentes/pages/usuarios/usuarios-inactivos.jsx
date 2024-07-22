"use client";
import React, { useEffect, useState,useContext} from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../../../utils/apiUrl';
import { renderWithTooltip } from '../../../utils/renderWithTooltip';
import { TextInput } from "flowbite-react";
import { Tooltip,Toast } from 'flowbite-react';
import { HiOutlineSearch, HiRefresh ,HiOutlineArrowNarrowLeft,HiOutlineExclamationCircle,HiCheck,HiX} from "react-icons/hi";
import Layout from "../../layout/layout";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PrimeReactProvider } from 'primereact/api';
import { Button,Modal } from "flowbite-react";
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import 'flowbite/dist/flowbite.css';
import '../styles.css'

//import "primereact/resources/themes/tailwind-light/theme.css";


function UsariosInactivos() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        apellido: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        username: { value: null, matchMode: FilterMatchMode.IN },
        'rol.literal': { value: null, matchMode: FilterMatchMode.EQUALS }

    });

    const [openModal, setOpenModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showToastSUCC, setShowToastSUCC] = useState(false);
    const [showToastERR, setShowToastERR] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const actionBodyTemplate = (rowData) => {
      return (
          <React.Fragment>
            <div className="flex flex-wrap gap-2">
              <Tooltip content="Activar" placement="top">
                
                  <HiRefresh onClick={() => handleActivarClick(rowData.id)} className="h-6 w-6 cursor-pointer" />
                
              </Tooltip>
            </div>
          </React.Fragment>
      );
    };

    const handleActivarClick = (userId) => {
        setSelectedUserId(userId);
        setOpenModal(true);
    };

    const confirmActivar = () => {
      const token = localStorage.getItem('token');
        axios.put(`${apiUrl}/user/estado/${selectedUserId}`, { estado: "Activo" },{
          headers: {
              'Authorization': `Bearer ${token}` // Incluir el token en los encabezados
          }
      })
            .then(response => {
                setUsers(users.filter(user => user.id !== selectedUserId));
                setOpenModal(false);
                setToastMessage(response.data.message);
                setShowToastSUCC(true); // Mostrar Toast
                setTimeout(() => setShowToastSUCC(false), 5000);
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
            });
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
            <div className="flex justify-end  dark:bg-gray-800">
                
                    <TextInput value={globalFilterValue} onChange={onGlobalFilterChange}  rightIcon={HiOutlineSearch} id="input-gray" placeholder="Buscar" className=" mb-2" />
                
            </div>
        );
    };
    
    const header = renderHeader();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(apiUrl+'/users',{
      headers: {
          'Authorization': `Bearer ${token}` // Incluir el token en los encabezados
      }
    })
      .then(response => {
        setUsers(response.data);
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

  const inactiveUsers = users.filter(user => user.estado === 'Inactivo');
  const inactiveUsersCount = inactiveUsers.length;

    const renderLoadingElements = () => {
      const elements = [];
      for (let i = 0; i < 5; i++) { // Default skeleton loading elements
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
            <div className="container mx-auto px-4">
                <h5 className="text-2xl font-bold  text-cyan-700 dark:text-white">
                    Usuarios Inactivos
                </h5>
                <br></br>
                <br></br>
                  
                  
              
                 
            <DataTable value={inactiveUsers} 
            paginator 
            rows={5} 
            rowsPerPageOptions={[5, 10, 25, 50]} 
            filters={filters}
            globalFilterFields={['nombre', 'apellido', 'username', 'rol.literal']} 
            header={header}
            filterDisplay="row"
            emptyMessage="No hay datos disponibles"
            className="p-datatable-gridlines p-component table-auto w-full text-left ">
              <Column field="nombre" header="NOMBRE" body={(rowData) => renderWithTooltip(rowData, 'nombre')} className="p-col text-sm font-medium text-gray-900 px-6 py-4"></Column>
              <Column field="apellido" header="APELLIDOS" body={(rowData) => renderWithTooltip(rowData, 'apellido')} className="p-col text-sm font-medium text-gray-900 px-6 py-4"></Column>
              <Column field="username" header="USUARIO" body={(rowData) => renderWithTooltip(rowData, 'username')}  className="p-col text-sm font-medium text-gray-900 px-6 py-4"></Column>
              <Column field="rol.literal" header="ROL" body={(rowData) => renderWithTooltip(rowData, 'rol.literal')}  className="p-col text-sm font-medium text-gray-900 px-6 py-4"></Column>
              <Column field="unidad.nombre" header="UNIDAD" body={(rowData) => renderWithTooltip(rowData, 'unidad.nombre')} className="p-col text-sm font-medium text-gray-900 px-6 py-4"></Column>
              <Column body={actionBodyTemplate} header="ACCIONES" className="p-col text-sm font-medium text-gray-900 px-6 py-4" ></Column>
            </DataTable>
            <div className="flex flex-wrap gap-2">
              <Button label="2">Usuarios Inactivos: {inactiveUsersCount}</Button>
              <Button label="2" href='/users'><HiOutlineArrowNarrowLeft className="mr-2 h-5 w-5"  />Ver Usuarios Activos </Button>
            </div>
            
          </div>
        );
    };

   

    let content;

    if (loading) {
        content = renderLoadingElements();
    } else {
    content = (
        <PrimeReactProvider >
            {renderUsers()}
        </PrimeReactProvider>
    );
    }
      
    return (
        <Layout>
            <section className="bg-white dark:bg-gray-800 relative shadow-md rounded-lg mx-auto h-auto">
                
            <div role="status" className="w-full p-4 space-y-4 divide-y divide-gray-200  dark:divide-gray-700 md:p-6 dark:border-gray-700">
                
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
            <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            ¿Desea activar este usuario?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={confirmActivar}>
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
  
  export default UsariosInactivos;