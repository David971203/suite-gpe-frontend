// src/componentes/PrivateRoute.js

import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const PrivateRoute = ({ component: Component }) => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();


  if (!auth.token) {
    return <Navigate to="/login" />;
  }else{
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const rol = decodedToken.role;
    if((rol === 'ROLE_ADMIN' || rol === 'ROLE_USER')&&  location.pathname === '/parque-vehiculos'){
      return <Navigate to="/" />;
    }

    if((rol === 'ROLE_USER' || rol === 'ROLE_ENERGETICO') &&  
      (
        location.pathname === '/users' ||
        location.pathname === '/users/inactive' ||
        location.pathname === '/portadores' ||
        location.pathname === '/portadores/inactive' ||
        location.pathname === '/unidades-medida' ||
        location.pathname === '/tipo-portadores' ||
        location.pathname === '/tipo-portadores/inactive' ||
        location.pathname === '/categorias-cda/inactive' ||
        location.pathname === '/sector-cda'||
        location.pathname === '/actividades-cda'||
        location.pathname === '/marcas' ||
        location.pathname === '/marcas/inactive' ||
        location.pathname === '/modelos' ||
        location.pathname === '/modelos/inactive' ||
        location.pathname === '/provincias' ||
        location.pathname === '/municipios' ||
        location.pathname === '/tipos-vehiculos' ||
        location.pathname === '/unidades' ||
        location.pathname === '/unidades/inactive' ||
        location.pathname === '/parque-vehiculos-admin' 
        
      )){
      return <Navigate to="/" />;
    }

    if((rol === 'ROLE_USER' || rol === 'ROLE_ENERGETICO') &&  
    (
      location.pathname === '/parque-vehiculos/inactive'
    )){
      return <Component />;
    }
    return <Component />;
  }

  
};

export default PrivateRoute;