
"use client";

import React, { useContext,useEffect,useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../utils/apiUrl';
import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import { Tooltip ,Toast } from 'flowbite-react';
import {HiX,HiCheck} from "react-icons/hi";
import { DarkThemeToggle } from 'flowbite-react';
import BreadCrumb from './breadcrumb';
import logo from '../../img/barrelr-energy-factory-svgrepo-com.svg';
import avatar from '../../img/img_avatar1.png';
import { HiMenu } from 'react-icons/hi';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function NavbarComponent({ showToggle, onToggleSidebar }) {

  
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [user, setUser] = useState('');


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(apiUrl + '/users/me', {
        headers: {
            'Authorization': `Bearer ${token}` // Incluir el token en los encabezados
        }
    })
        .then(response => {
            
            setNombre(response.data.nombre);
            setUser(response.data.username);
        })
        .catch(error => {
            console.log(error);
            
          }); 
}, []);

    
  return (
    <Navbar className="border-b border-gray-300 dark:border-gray-700">
      {showToggle &&
        <button
          aria-expanded="true"
          onClick={onToggleSidebar}
          className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <HiMenu className="w-6 h-6" />
          <span className="sr-only">Toggle sidebar</span>
        </button>
      }
      <Navbar.Brand href="/">
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">SUIETE-GPE</span>
      </Navbar.Brand>
      <BreadCrumb />
      <div className="flex md:order-2">
      <Tooltip content='Modo oscuro' placement="top">
          
          <DarkThemeToggle className="mx-2" />
        </Tooltip>
        
        <Dropdown
          arrowIcon={false}
          inline
          label={<Avatar className="w-10 h-10 rounded-full cursor-pointer" alt="User settings" img={avatar} rounded />}
        >
          <Dropdown.Header>
            <span className="block text-sm">{nombre}</span>
            <span className="block truncate text-sm font-medium">{user}</span>
          </Dropdown.Header>
          <Dropdown.Item>Ver Perfil</Dropdown.Item>
          <Dropdown.Item>Cambiar Contraseña</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
        </Dropdown>
      </div>
    </Navbar>
    
  );
}

export default NavbarComponent;

