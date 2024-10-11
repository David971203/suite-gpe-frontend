
"use client";

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from 'flowbite-react';
import { HiOutlineSwitchHorizontal , HiChartPie, HiClipboardList , HiChevronDoubleRight , HiCog, HiIdentification,HiAdjustments  } from 'react-icons/hi';
import { customSidebar } from '../../utils/customThemes';
import { renderTooltipSidebar } from '../../utils/renderWithTooltip';
import { Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

function SidebarComponent({ isOpen, onToggleSidebar }) {
  const location = useLocation();
  const [openCollapse, setOpenCollapse] = useState(null);
  const [selectedItem, setSelectedItem] = useState('');

  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const rol = decodedToken.role;
  const unidad_name = decodedToken.unidad_name;
  const unidad_id = decodedToken.unidad_id;

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

  useEffect(() => {
    if (location.pathname.startsWith('/tipos-vehiculos')) {
      setOpenCollapse(1);
      setSelectedItem(location.pathname);
    }
  }, [location]);

  useEffect(() => {
    if (location.pathname.startsWith('/sector')) {
      setOpenCollapse(1);
      setSelectedItem(location.pathname);
    }
  }, [location]);

  useEffect(() => {
    if (location.pathname.startsWith('/marcas')) {
      setOpenCollapse(1);
      setSelectedItem(location.pathname);
    }
  }, [location]);

  useEffect(() => {
    if (location.pathname.startsWith('/modelos')) {
      setOpenCollapse(1);
      setSelectedItem(location.pathname);
    }
  }, [location]);

  useEffect(() => {
    if (location.pathname.startsWith('/provincias')) {
      setOpenCollapse(1);
      setSelectedItem(location.pathname);
    }
  }, [location]);

  useEffect(() => {
    if (location.pathname.startsWith('/municipios')) {
      setOpenCollapse(1);
      setSelectedItem(location.pathname);
    }
  }, [location]);

  useEffect(() => {
    if (location.pathname.startsWith('/unidades')) {
      setOpenCollapse(1);
      setSelectedItem(location.pathname);
    }
  }, [location]);

  useEffect(() => {
    if (location.pathname ==='/parque-vehiculos' ) {
      setOpenCollapse(2);
      setSelectedItem(location.pathname);
    }
  }, [location]);

  useEffect(() => {
    if (location.pathname === '/parque-vehiculos-admin' ) {
      setOpenCollapse(1);
      setSelectedItem(location.pathname);
    }
  }, [location]);

  
  if(rol === 'ROLE_ADMIN'){
    useEffect(() => {
      if (location.pathname === '/parque-vehiculos/inactive' ) {
        setOpenCollapse(1);
        setSelectedItem('/parque-vehiculos-admin');
      }
    }, [location]);
  }else{
    useEffect(() => {
      if (location.pathname ==='/parque-vehiculos/inactive' ) {
        setOpenCollapse(2);
        setSelectedItem('/parque-vehiculos');
      }
    }, [location]);
  }
  
  useEffect(() => {
    if (location.pathname.startsWith('/tarjetas-magneticas')) {
      setOpenCollapse(2);
      setSelectedItem(location.pathname);
    }
  }, [location]);

  useEffect(() => {
    if (location.pathname.startsWith('/asociar-actividad')) {
      setOpenCollapse(2);
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



  return (
  
 
    <Sidebar
      id="sidebar"
      
      aria-label="Sidebar with multi-level dropdown example"
      className={` transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} fixed md:static top-0 left-0 h-full z-40 border-r border-gray-300 dark:border-gray-700`}
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
          
          <Sidebar.Item href="/planificacion-cda" icon={HiClipboardList }>
            Planificación
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiChevronDoubleRight}>
            Asignación
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiOutlineSwitchHorizontal}>
            Traspasos
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiAdjustments}>
            Control
          </Sidebar.Item>

          {
            rol === 'ROLE_ENERGETICO' ?
            <Sidebar.Collapse
              icon={HiCog}
              label="Configuración"
              open={openCollapse === 2}
              onClick={() => handleCollapseClick(2)}
            >
              <Link to="/asociar-actividad">
                <Sidebar.Item
                  
                  className={isItemSelected('/asociar-actividad')}
                  onClick={() => handleItemClick('/asociar-actividad')}
                >
                  {renderTooltipSidebar('Asociar Actividades CDA a la Unidad')}
                </Sidebar.Item>
              </Link>
              <Link to="/parque-vehiculos">
                <Sidebar.Item
                  
                  className={isItemSelected('/parque-vehiculos')}
                  onClick={() => handleItemClick('/parque-vehiculos')}
                >
                  {renderTooltipSidebar('Parque de Vehículos')}
                </Sidebar.Item>
              </Link>
              <Link to="/tarjetas-magneticas">
                <Sidebar.Item
                  
                  className={isItemSelected('/tarjetas-magneticas')}
                  onClick={() => handleItemClick('/tarjetas-magneticas')}
                >
                  {renderTooltipSidebar('Tarjetas Magnéticas')}
                </Sidebar.Item>
              </Link>
              <Sidebar.Item
                //href="#portadores2"
                //className={isItemSelected('#portadores2')}
                //onClick={() => handleItemClick('#portadores2')}
              >
                Mi Unidad
              </Sidebar.Item>
            </Sidebar.Collapse>
            :
            null
          }
          
          {
            rol === 'ROLE_ADMIN' ?
            <Sidebar.Collapse
              icon={HiIdentification}
              label="Administración"
              open={openCollapse === 1}
              onClick={() => handleCollapseClick(1)}
              
            >
              <Link to="/users">
                <Sidebar.Item
                  className={isItemSelected('/users')}
                  onClick={() => handleItemClick('/users')}
                >
                {renderTooltipSidebar('Usuarios')}

                </Sidebar.Item>
              </Link>

              <Link to="/unidades">
                <Sidebar.Item
                  className={isItemSelected('/unidades')}
                  onClick={() => handleItemClick('/unidades')}
                >
                {renderTooltipSidebar('Unidades')}

                </Sidebar.Item>
              </Link>

              <Link to="/portadores">
                <Sidebar.Item
                  className={isItemSelected('/portadores')}
                  onClick={() => handleItemClick('/portadores')}
                >
                {renderTooltipSidebar('Portadores Energéticos')} 
              
                </Sidebar.Item>
              </Link>

              <Link to="/tipo-portadores">
                <Sidebar.Item
                  className={isItemSelected('/tipo-portadores')}
                  onClick={() => handleItemClick('/tipo-portadores')}
                >
                {renderTooltipSidebar('Tipos de Portadores Energéticos')} 

                </Sidebar.Item>
              </Link>

              <Link to="/categorias-cda">  
                <Sidebar.Item
                  
                  className={isItemSelected('/categorias-cda')}
                  onClick={() => handleItemClick('/categorias-cda')}
                >
                {renderTooltipSidebar('Categorías de CDA')} 
                  
                </Sidebar.Item>
              </Link>

              <Link to="/actividades-cda">
                <Sidebar.Item
                  
                  className={isItemSelected('/actividades-cda')}
                  onClick={() => handleItemClick('/actividades-cda')}
                >
                {renderTooltipSidebar('Actividades de CDA')} 
                  
                </Sidebar.Item>
              </Link>

              <Link to="/unidades-medida">
                <Sidebar.Item
                  
                  className={isItemSelected('/unidades-medida')}
                  onClick={() => handleItemClick('/unidades-medida')}
                >
                {renderTooltipSidebar('Unidades de Medida')} 
                  
                </Sidebar.Item>
              </Link>

              <Link to="/tipos-vehiculos">
                <Sidebar.Item
                  
                  className={isItemSelected('/tipos-vehiculos')}
                  onClick={() => handleItemClick('/tipos-vehiculos')}
                >
                {renderTooltipSidebar('Tipos de Vehículos')} 
                  
                </Sidebar.Item>
              </Link>

              <Link to="/parque-vehiculos-admin">
                <Sidebar.Item
                  
                  className={isItemSelected('/parque-vehiculos-admin')}
                  onClick={() => handleItemClick('/parque-vehiculos-admin')}
                >
                {renderTooltipSidebar('Vehículos')} 
                  
                </Sidebar.Item>
              </Link>

              <Link to="/sector">
                <Sidebar.Item
                  
                  className={isItemSelected('/sector')}
                  onClick={() => handleItemClick('/sector')}
                >
                {renderTooltipSidebar('Sectores')} 
                  
                </Sidebar.Item>
              </Link>

              <Link to="/marcas">
                <Sidebar.Item 
                 
                  className={isItemSelected('/marcas')}
                  onClick={() => handleItemClick('/marcas')}

                >
                  {renderTooltipSidebar('Marcas')} 
                
                </Sidebar.Item>
              </Link>

              <Link to="/modelos">
                <Sidebar.Item 
                  
                  className={isItemSelected('/modelos')}
                  onClick={() => handleItemClick('/modelos')}
                >
                {renderTooltipSidebar('Modelos')} 
                </Sidebar.Item>
              </Link>

              <Link to="/provincias">
                <Sidebar.Item 
                  
                  className={isItemSelected('/provincias')}
                  onClick={() => handleItemClick('/provincias')}
                >
                  {renderTooltipSidebar('Provincias')} 
                </Sidebar.Item>
              </Link>
            
              <Link to="/municipios">
                <Sidebar.Item 
                  
                  className={isItemSelected('/municipios')}
                  onClick={() => handleItemClick('/municipios')}
                >
                  {renderTooltipSidebar(' Municipios')} 
                </Sidebar.Item>
              </Link>
            </Sidebar.Collapse>
            : null
          }
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>

  );
}

export default SidebarComponent;
