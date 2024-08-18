// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import { apiUrl } from '../utils/apiUrl';
export const AuthContext = createContext();
import axios from 'axios';

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? { token } : '';
  });

  const login = async (username, password) => {
    
      const response = await axios.post(`${apiUrl}/login`, {
        username: username,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'accept': 'application/json'
        }
      })

      
      if (response.status === 200) {
        // Guardar el token en el almacenamiento local
        localStorage.setItem('token', response.data.access_token);
        // Actualizar el estado de autenticación
        setAuth({ token: response.data.access_token });
        
        
         
        
      } else if (response.status === 401){
        console.error(response.detail);
      }else{
        console.error('Error en la solicitud de inicio de sesión. Estado:', response.status);
      }

    
  };

  const logout =  () => {
    localStorage.setItem('token', '');
    setAuth({ token: '' });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuth({ token });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
