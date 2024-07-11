"use client";
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../../../utils/apiUrl';
import { renderWithTooltip } from '../../../utils/renderWithTooltip';
import { TextInput } from "flowbite-react";
import { HiOutlineSearch, HiOutlineArrowNarrowLeft, HiOutlineExclamationCircle, HiCheck, HiX } from "react-icons/hi";
import Layout from "../../layout/layout";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PrimeReactProvider } from 'primereact/api';
import { Button, Modal, Toast } from "flowbite-react";
import { FilterMatchMode } from 'primereact/api';
import 'flowbite/dist/flowbite.css';
import '../styles.css'
import { TableActionsItemsInactive } from '../../../utils/TableActions';
import ConfirmacionModal from '../../../utils/ConfirmacionModal';
import ToastNotification from '../../../utils/ToastNotification';

function MarcasInactivos() {
    const [marcas, setMarcas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [openModal, setOpenModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showToastSUCC, setShowToastSUCC] = useState(false);
    const [showToastERR, setShowToastERR] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleActivarClick = (id) => {
        setSelectedId(id);
        setOpenModal(true);
    };

    const confirmActivar = () => {
        const token = localStorage.getItem('token');
        axios.put(`${apiUrl}/marca/estado/${selectedId}`, { estado: "Activo" }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setMarcas(marcas.filter(marca => marca.id !== selectedId));
                setOpenModal(false);
                setToastMessage(response.data.message);
                setShowToastSUCC(true);
                setTimeout(() => setShowToastSUCC(false), 5000);
            })
            .catch(error => {
                setOpenModal(false);
                const errorMsg = error.response?.data?.detail || 'Error al activar el estado';
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

    const actionBodyTemplate = (rowData) => (
        <TableActionsItemsInactive
            onActive={() => handleActivarClick(rowData.id)} 
        />
    );

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        setFilters({ ...filters, global: { value, matchMode: FilterMatchMode.CONTAINS } });
        setGlobalFilterValue(value);
    };

    const renderHeader = () => (
        <div className="flex justify-end dark:bg-gray-800">
            <TextInput value={globalFilterValue} onChange={onGlobalFilterChange} rightIcon={HiOutlineSearch} id="input-gray" placeholder="Buscar" className="mb-2" />
        </div>
    );

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`${apiUrl}/marcas`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setMarcas(response.data);
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

    const inactiveMarca = marcas.filter(marca => marca.estado === 'Inactivo');
    const inactiveMarca_Count = inactiveMarca.length;

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

    const renderMarcas = () => (
        <div className="container mx-auto px-4">
            <h5 className="text-2xl font-bold text-cyan-700 dark:text-white">Marcas Inactivas</h5>
            <br />
            <DataTable 
                value={inactiveMarca}
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                filters={filters}
                globalFilterFields={['nombre']}
                header={renderHeader()}
                filterDisplay="row"
                emptyMessage="No hay datos disponibles"
                className="p-datatable-gridlines p-component table-auto w-full text-left"
            >
                <Column field="nombre" header="NOMBRE" body={(rowData) => renderWithTooltip(rowData, 'nombre')} className="p-col text-sm font-medium text-gray-900 px-6 py-4" />
                <Column body={actionBodyTemplate} header="ACCIONES" className="p-col text-sm font-medium text-gray-900 px-6 py-4" />
            </DataTable>
            <div className="flex flex-wrap gap-2">
                <Button>Marcas Inactivas: {inactiveMarca_Count}</Button>
                <Button href='/marcas'>
                    <HiOutlineArrowNarrowLeft className="mr-2 h-5 w-5" />Ver Marcas Activas
                </Button>
            </div>
        </div>
    );

    return (
        <Layout>
            <section className="bg-white dark:bg-gray-800 relative shadow-md rounded-lg mx-auto h-auto">
                <div role="status" className="w-full p-4 space-y-4 divide-y divide-gray-200 dark:divide-gray-700 md:p-6 dark:border-gray-700">
                    {loading ? renderLoadingElements() : (
                        <PrimeReactProvider>
                            {renderMarcas()}
                        </PrimeReactProvider>
                    )}
                </div>
                <ToastNotification show={showToastSUCC} type="success" message={toastMessage} onClose={() => setShowToastSUCC(false)} />
                <ToastNotification show={showToastERR} type="error" message={toastMessage} onClose={() => setShowToastERR(false)} />
                <ConfirmacionModal show={openModal} onClose={() => setOpenModal(false)} onConfirm={confirmActivar} msg={'¿Desea activar esta marca?'} />
            </section>
        </Layout>
    );
}

export default MarcasInactivos;