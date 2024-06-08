"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../../utils/apiUrl';
import { renderWithTooltip } from '../../../utils/renderWithTooltip';
import { TextInput } from "flowbite-react";
import { HiOutlineSearch } from "react-icons/hi";
import Layout from "../../layout/layout";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PrimeReactProvider } from 'primereact/api';
import { Paginator } from 'primereact/paginator';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import 'flowbite/dist/flowbite.css';
import '../styles.css'

//import "primereact/resources/themes/tailwind-light/theme.css";


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
    axios.get(apiUrl+'/users')
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the users!", error);
        setLoading(false);
      });
  }, []);
  
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
                    Usuarios
                </h5>
                <br></br>
            <DataTable value={users} 
            paginator 
            rows={5} 
            rowsPerPageOptions={[5, 10, 25, 50]} 
            filters={filters}
            globalFilterFields={['nombre', 'apellido', 'username', 'rol.literal']} 
            header={header}
            filterDisplay="row"
            emptyMessage="No hay usuarios activos"
            className="p-datatable-gridlines p-component table-auto w-full text-left ">
              <Column field="nombre" header="Nombre" body={(rowData) => renderWithTooltip(rowData, 'nombre')} className="p-col text-sm font-medium text-gray-900 px-6 py-4"></Column>
              <Column field="apellido" header="Apellido" body={(rowData) => renderWithTooltip(rowData, 'apellido')} className="p-col text-sm font-medium text-gray-900 px-6 py-4"></Column>
              <Column field="username" header="Username" body={(rowData) => renderWithTooltip(rowData, 'username')}  className="p-col text-sm font-medium text-gray-900 px-6 py-4"></Column>
              <Column field="rol.literal" header="Rol" body={(rowData) => renderWithTooltip(rowData, 'rol.literal')}  className="p-col text-sm font-medium text-gray-900 px-6 py-4"></Column>
            </DataTable>
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
            </section>
        </Layout>
      );
  }
  
  export default UsariosActicvos;