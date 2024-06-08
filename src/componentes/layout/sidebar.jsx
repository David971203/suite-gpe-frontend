
"use client";

import React, { useState, useEffect  } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiCog ,HiIdentification  } from "react-icons/hi";

function sidebarComponent() {
  const location = useLocation();
  const [openCollapse, setOpenCollapse] = useState(null); // Guarda el índice del Collapse abierto
  const [selectedItem, setSelectedItem] = useState(''); // Guarda el href del elemento seleccionado

  useEffect(() => {
    // Determina qué collapse debe estar abierto basado en la ruta actual
    if (location.pathname.startsWith('/users')) {
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
    return selectedItem === href ? 'border border-cyan-700' : '';
  };

  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example">
    <Sidebar.Items>
      <Sidebar.ItemGroup>
        <Sidebar.Item href="#" icon={HiChartPie}>
          Dashboard
        </Sidebar.Item>

        <Sidebar.Item href="#" icon={HiInbox}>
          Inbox
        </Sidebar.Item>
        <Sidebar.Item href="#" icon={HiShoppingBag}>
          Products
        </Sidebar.Item>
        <Sidebar.Item href="#" icon={HiArrowSmRight}>
          Sign In
        </Sidebar.Item>
        <Sidebar.Item href="#" icon={HiTable}>
          Sign Up
        </Sidebar.Item>

        <Sidebar.Collapse
          icon={HiCog}
          label="Configuración"
          open={openCollapse === 2}  // Correcto atributo para abrir el collapse
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
          open={openCollapse === 1}  // Correcto atributo para abrir el collapse
          onClick={() => handleCollapseClick(1)}
        >
          <Sidebar.Item
            href="/users"
            className={isItemSelected('/users')}
            onClick={() => handleItemClick('/users')}
          >
            Usuarios
          </Sidebar.Item>
          <Sidebar.Item
            href="#portadores"
            className={isItemSelected('#portadores')}
            onClick={() => handleItemClick('#portadores')}
          >
            Portadores Energéticos
          </Sidebar.Item>
          <Sidebar.Item
            href="#refunds"
            className={isItemSelected('#refunds')}
            onClick={() => handleItemClick('#refunds')}
          >
            Refunds
          </Sidebar.Item>
          <Sidebar.Item
            href="#shipping"
            className={isItemSelected('#shipping')}
            onClick={() => handleItemClick('#shipping')}
          >
            Shipping
          </Sidebar.Item>
        </Sidebar.Collapse>
      </Sidebar.ItemGroup>
    </Sidebar.Items>
  </Sidebar>
  );
}

export default sidebarComponent;
