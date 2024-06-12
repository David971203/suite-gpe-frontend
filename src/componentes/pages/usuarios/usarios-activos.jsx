"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../../utils/apiUrl';
import { renderWithTooltip } from '../../../utils/renderWithTooltip';
import { TextInput } from "flowbite-react";
import { Tooltip ,Toast } from 'flowbite-react';
import { HiOutlineSearch, HiPencil, HiTrash,HiOutlineArrowNarrowRight,HiOutlinePlus,HiOutlineExclamationCircle,HiX  } from "react-icons/hi";
import Layout from "../../layout/layout";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PrimeReactProvider } from 'primereact/api';
import { Button, Modal } from "flowbite-react";
import { FilterMatchMode } from 'primereact/api';
import 'flowbite/dist/flowbite.css';
import '../styles.css';

function UsariosActicvos() {
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
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const actionBodyTemplate = (rowData) => {
      return (
          <React.Fragment>
            <div className="flex flex-wrap gap-2">
              <Tooltip content="Editar" placement="top">
                <HiPencil className="h-6 w-6 cursor-pointer" />
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

    const handleDeleteClick = (userId) => {
        setSelectedUserId(userId);
        setOpenModal(true);
    };

    const confirmDelete = () => {
        axios.put(`${apiUrl}/user/estado/${selectedUserId}`, { estado: "Inactivo" })
            .then(response => {
                setUsers(users.filter(user => user.id !== selectedUserId));
                setOpenModal(false);
                setToastMessage(response.data.message);
                setShowToast(true); // Mostrar Toast
                setTimeout(() => setShowToast(false), 5000);
            })
            .catch(error => {
              setOpenModal(false);
              setToastMessage('El usuario ha sido eliminado exitosamente');
              setShowToast(true); // Mostrar Toast
              setTimeout(() => setShowToast(false), 5000); 
                console.error("There was an error updating the user state!", error);
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
            <div className="flex justify-end dark:bg-gray-800">
                <TextInput value={globalFilterValue} onChange={onGlobalFilterChange} rightIcon={HiOutlineSearch} id="input-gray" placeholder="Buscar" className="mb-2" />
            </div>
        );
    };

    const header = renderHeader();

    useEffect(() => {
        axios.get(apiUrl + '/users')
            .then(response => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the users!", error);
                setLoading(false);
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
            <div className="container mx-auto px-4">
                <h5 className="text-2xl font-bold text-cyan-700 dark:text-white">Usuarios</h5>
                <br />
                <Button className='mb-2'>Nuevo Usuario <HiOutlinePlus className="ml-2 h-5 w-5" /></Button>
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
                    <Column body={actionBodyTemplate} header="ACCIONES" className="p-col text-sm font-medium text-gray-900 px-6 py-4"></Column>
                </DataTable>
                <div className="flex flex-wrap gap-2">
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

    return (
        <Layout>
            <section className="bg-white dark:bg-gray-800 relative shadow-md rounded-lg mx-auto h-auto">
              
                <div role="status" className="w-full p-4 space-y-4 divide-y divide-gray-200 dark:divide-gray-700 md:p-6 dark:border-gray-700">
                    {content}
                </div>
                {showToast && (
                    <div className="absolute  top-4 right-4">
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

export default UsariosActicvos;
