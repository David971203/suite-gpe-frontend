
"use client";

import React, { useContext,useEffect,useState } from 'react';
import { TextInput,Select,Label, Modal, Button } from "flowbite-react";
import axios from 'axios';
import { apiUrl } from '../../utils/apiUrl';
import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import { Tooltip ,Toast } from 'flowbite-react';
import {HiX,HiCheck} from "react-icons/hi";
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { DarkThemeToggle } from 'flowbite-react';
import BreadCrumb from './breadcrumb';
import logo from '../../img/barrelr-energy-factory-svgrepo-com.svg';
import avatar from '../../img/img_avatar1.png';
import { HiMenu } from 'react-icons/hi';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ToastNotification from '../../utils/ToastNotification';
import {jwtDecode} from 'jwt-decode';


function NavbarComponent({ showToggle, onToggleSidebar }) {



  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [showToastSUCC, setShowToastSUCC] = useState(false);
  const [showToastERR, setShowToastERR] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [openNewModal, setOpenNewModal] = useState(false);
  const [colorInputText, setcolorInputText] = useState('gray');
  const [msgInputText, setmsgInputText] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setshowNewPassword] = useState(false);
  const [showConfPassword, setshowConfPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setshowNewPassword(!showNewPassword);
  };

  const toggleConfPasswordVisibility = () => {
    setshowConfPassword(!showConfPassword);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  

  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const nombre = decodedToken.name;
  const user = decodedToken.sub;

  const [formData, setFormData] = useState({
    actual: '',
    nueva:'',
    confirmar: '',
  });

  const resetFormData = () => {
    setFormData({
      actual: '',
      nueva:'',
      confirmar: '',
        });
    };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    return regex.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.nueva !== formData.confirmar) {
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

    if (!validatePassword(formData.nueva)) {
        setcolorInputText('failure');
        setmsgInputText('La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un caracter especial!!');
        
        setTimeout(() => {
            setShowToastERR(false);
            setcolorInputText('gray');
            setmsgInputText('');
        }, 5000);
        return;
    }

    const token = localStorage.getItem('token');
    axios.put(`${apiUrl}/users/change-password`, {
        current_password: formData.actual,
        new_password: formData.nueva,
        confirm_password: formData.confirmar
    }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        setOpenNewModal(false);
        setToastMessage(response.data.message);
        setShowToastSUCC(true);
        setTimeout(() => setShowToastSUCC(false), 5000);
        resetFormData();
        setShowPassword(false);
        setshowNewPassword(false);
        setshowConfPassword(false);
    })
    .catch(error => {
        setOpenNewModal(false);
        resetFormData();
        setShowPassword(false);
        setshowNewPassword(false);
        setshowConfPassword(false);
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
          <Dropdown.Item onClick={() => setOpenNewModal(true)} >Cambiar Contraseña</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
        </Dropdown>
      </div>
      {showToastSUCC && (
        <div className="absolute  top-3 right-28">
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
        <div className="absolute  top-3 right-28">
            <Toast>
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                    <HiX className="h-5 w-5" />
                </div>
                <div className="ml-3 text-sm font-normal">{toastMessage}</div>
                <Toast.Toggle />
            </Toast>
        </div>
      )}
      <Modal show={openNewModal}  size='md'onClose={() => {setOpenNewModal(false); resetFormData(); setShowPassword(false); setshowNewPassword(false); setshowConfPassword(false); }}>
          <Modal.Header onClose={() => { setOpenNewModal(false); resetFormData(); }}>
              Cambiar Contraseña
          </Modal.Header>
          <Modal.Body>
              
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                      <Label htmlFor="actual">Contraseña Actual</Label>
                      <TextInput type={showPassword ? 'text' : 'password'} id="actual" name="actual" minLength={8} maxLength={16} value={formData.actual} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingrese la contraseña actual debe de tener de 8 a 16 caracteres.')} onInput={(e) => e.target.setCustomValidity('')}/>
                      <div
                        className="absolute bottom-64 right-6 flex items-center pr-3 cursor-pointer"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <HiEye /> : <HiEyeOff />}
                      </div>
                  </div>
                  <div>
                      <Label htmlFor="nueva">Nueva Contraseña</Label>
                      <TextInput type={showNewPassword ? 'text' : 'password'} id="nueva" name="nueva" minLength={8} maxLength={16} color={colorInputText} value={formData.nueva} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingrese la nueva contraseña debe de tener de 8 a 16 caracteres.')} onInput={(e) => e.target.setCustomValidity('')}/>
                      <div
                        className="absolute bottom-44 right-6 flex items-center pr-3 cursor-pointer"
                        onClick={toggleNewPasswordVisibility}
                      >
                        {showNewPassword ? <HiEye /> : <HiEyeOff />}
                      </div>
                  </div>
                  <div>
                      <Label htmlFor="confirmar">Confirmar Contraseña</Label>
                      <TextInput type={showConfPassword ? 'text' : 'password'} id="confirmar" name="confirmar" minLength={8} maxLength={16} color={colorInputText} 
                      helperText={
                        <>
                            <p>{msgInputText}</p> 
                        </>
                      }
                      value={formData.confirmar} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, confirme la contraseña debe de tener de 8 a 16 caracteres.')} onInput={(e) => e.target.setCustomValidity('')}/>
                    <div
                      className="absolute bottom-24 right-6 flex items-center pr-3 cursor-pointer"
                      onClick={toggleConfPasswordVisibility}
                    >
                      {showConfPassword ? <HiEye /> : <HiEyeOff />}
                    </div>
                  </div>
                  
                  <Button type="submit">Guardar</Button>
                </form>
          </Modal.Body>
      </Modal>
    </Navbar>
    
  );
}

export default NavbarComponent;

