import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../../../utils/apiUrl';
import { renderWithTooltip } from '../../../utils/renderWithTooltip';
import { TextInput,Select,Label, Textarea ,Modal } from "flowbite-react";
import { HiOutlineSearch, HiOutlinePlus, HiOutlineArrowNarrowRight,HiOutlineDownload  } from "react-icons/hi";
import Layout from "../../layout/layout";
import { Card } from "flowbite-react";
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

function PlanificacionCDA() {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const rol = decodedToken.role;
    const unidad_name = decodedToken.unidad_name;
    const unidad_id = decodedToken.unidad_id;

    return (
        <Layout>
            <section className="bg-white dark:bg-gray-800 relative shadow-md rounded-lg mx-auto h-auto">
                <div role="status" className="w-full p-4 space-y-4 divide-y divide-gray-200 dark:divide-gray-700 md:p-6 dark:border-gray-700">
                    
                <Card className='max-w-sm'>
                    <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">Crear Nuevo CDA 001</h5>
                    <div className="flex items-baseline text-gray-900 dark:text-white">
                        
                        <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">{unidad_name}</span>
                    </div>
                    
                    <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-900"
                    >
                        Nuevo CDA 001
                    </button>
                </Card>

                </div>
                
                
                
                
            </section>
        </Layout>
    );
}export default PlanificacionCDA;