
"use client";

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from 'flowbite-react';
import { HiOutlineSwitchHorizontal , HiChartPie, HiClipboardList , HiChevronDoubleRight , HiCog, HiIdentification,HiAdjustments  } from 'react-icons/hi';
import { customSidebar } from '../../utils/customThemes';
import { renderTooltipSidebar } from '../../utils/renderWithTooltip';
import {jwtDecode} from 'jwt-decode';

function SidebarComponent({ isOpen, onToggleSidebar }) {
  const location = useLocation();
  const [openCollapse, setOpenCollapse] = useState(null);
  const [selectedItem, setSelectedItem] = useState('');

  useEffect(() => {
    if (location.pathname.startsWith('/users')) {
      setOpenCollapse(1);
      setSelectedItem(location.pathname);
    }
  }, [location]);

  useEffect(() => {
    if (location.pathname.startsWith('/portadores')) {
      setOpenCollapse(1);
      setSelectedItem(location.pathname);
    }
  }, [location]);

  useEffect(() => {
    if (location.pathname.startsWith('/unidades-medida')) {
      setOpenCollapse(1);
      setSelectedItem(location.pathname);
    }
  }, [location]);

  useEffect(() => {
    if (location.pathname.startsWith('/tipo-portadores')) {
      setOpenCollapse(1);
      setSelectedItem(location.pathname);
    }
  }, [location]);

  useEffect(() => {
    if (location.pathname.startsWith('/categorias-cda')) {
      setOpenCollapse(1);
      setSelectedItem(location.pathname);
    }
  }, [location]);

  useEffect(() => {
    if (location.pathname.startsWith('/actividades-cda')) {
      setOpenCollapse(1);
      setSelectedItem(location.pathname);
    }
  }, [location]);

  const handleCollapseClick = (index) => {
    setOpenCollapse(openCollapse === index ? null : index);
  };

  const handleItemClick = (href) => {
    setSelectedItem(href);
  };

  const isItemSelected = (href) => {

    return selectedItem.startsWith( href) ? 'border border-cyan-700' : '';
  };
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const rol = decodedToken.role

  return (
    <Sidebar
      id="sidebar"
      theme={customSidebar}
      aria-label="Sidebar with multi-level dropdown example"
      className={`transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} fixed md:static top-0 left-0 h-full z-40 border-r border-gray-300 dark:border-gray-700`}
    >
      <div className="py-5 block sm:hidden pb-3">
        <h5 id="sidebar-label" className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">Menú</h5>
        <button type="button" onClick={onToggleSidebar} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white">
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
      </div>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="#" icon={HiChartPie}>
            Dashboard {rol}
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiClipboardList }>
            Planificación
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiChevronDoubleRight}>
            Administración
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiOutlineSwitchHorizontal}>
            Traspasos
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiAdjustments}>
            Control
          </Sidebar.Item>
          <Sidebar.Collapse
            icon={HiCog}
            label="Configuración"
            open={openCollapse === 2}
            onClick={() => handleCollapseClick(2)}
          >
            <Sidebar.Item
              href="#portadores2"
              className={isItemSelected('#portadores2')}
              onClick={() => handleItemClick('#portadores2')}
            >
              Portadores Energéticos
            </Sidebar.Item>
          </Sidebar.Collapse>
          <Sidebar.Collapse
            icon={HiIdentification}
            label="Administración"
            open={openCollapse === 1}
            onClick={() => handleCollapseClick(1)}
          >
            <Sidebar.Item
              href="/users"
              className={isItemSelected('/users')}
              onClick={() => handleItemClick('/users')}
            >
            {renderTooltipSidebar('Usuarios')} 

            </Sidebar.Item>
            <Sidebar.Item
               href="/portadores"
              className={isItemSelected('/portadores')}
              onClick={() => handleItemClick('/portadores')}
            >
            {renderTooltipSidebar('Portadores Energéticos')} 
          
            </Sidebar.Item>
            <Sidebar.Item
              href="/tipo-portadores"
              className={isItemSelected('/tipo-portadores')}
              onClick={() => handleItemClick('/tipo-portadores')}
            >
             {renderTooltipSidebar('Tipos de Portadores Energéticos')} 

            </Sidebar.Item>
            <Sidebar.Item
              href="/categorias-cda"
              className={isItemSelected('/categorias-cda')}
              onClick={() => handleItemClick('/categorias-cda')}
            >
            {renderTooltipSidebar('Categorías de CDA')} 
              
            </Sidebar.Item>
            
            <Sidebar.Item
              href="/actividades-cda"
              className={isItemSelected('/actividades-cda')}
              onClick={() => handleItemClick('/actividades-cda')}
            >
            {renderTooltipSidebar('Actividades de CDA')} 
              
            </Sidebar.Item>

            <Sidebar.Item
              href="/unidades-medida"
              className={isItemSelected('/unidades-medida')}
              onClick={() => handleItemClick('/unidades-medida')}
            >
            {renderTooltipSidebar('Unidades de Medida')} 
              
            </Sidebar.Item>
          </Sidebar.Collapse>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default SidebarComponent;
