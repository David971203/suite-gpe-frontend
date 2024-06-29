// src/componentes/pages/Login.js

"use client";

import React, { useState, useContext } from 'react';
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Toast } from 'flowbite-react';
import { HiX  } from "react-icons/hi";
import { HiEye, HiEyeOff } from 'react-icons/hi';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (error) {
      
      setToastMessage(error.response.data.detail);
      setShowToast(true); // Mostrar Toast
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (!value) {
      e.target.setCustomValidity('Por favor, ingresa tu nombre de usuario.');
    } else {
      e.target.setCustomValidity('');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (!value) {
      e.target.setCustomValidity('Por favor, ingresa tu contraseña.');
    } else {
      e.target.setCustomValidity('');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
  <div className="relative w-full max-w-md max-h-full">
    {showToast && (        
      <Toast className='mx-9 mb'>
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 ">
          <HiX className="h-5 w-5" />
        </div>
        <div className="ml-3 text-sm font-normal">{toastMessage}</div>
        <Toast.Toggle />
      </Toast>
    )}
    <h2 className="text-4xl font-medium text-cyan-700 text-center mr-10">Autenticarse</h2>
    <div className="login-container" style={{ marginBottom: showToast ? '4rem' : 0 }}>
      <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1" value="Usuario" />
          </div>
          <TextInput 
            
            maxLength={30} 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            id="email1"
            type="text" 
            placeholder="Usuario" 
            required 
            onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa tu nombre de usuario.')}
            onInput={(e) => e.target.setCustomValidity('')}
            />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1" value="Contraseña" />
          </div>
          <div className="relative">
          <TextInput 
            className="dark:bg-white dark:text-black dark:border-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            maxLength={30}
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            required
            onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa tu contraseña.')}
            onInput={(e) => e.target.setCustomValidity('')}
          ></TextInput>
          <div
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <HiEye /> : <HiEyeOff />}
          </div>
        </div>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className='dark:text-black'>Recordarme</Label>
        </div>
        <Button type="submit">Autenticar</Button>
      </form>
    </div>
  </div>
</div>

  );
  /*
  <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
   */
};

export default Login;

