import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {jwtDecode} from 'jwt-decode'; // Importar jwtDecode correctamente

const PrivateRoute = ({ component: Component }) => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();

  // Si no hay token, redirigir al login
  if (!auth?.token) {
    return <Navigate to="/login" />;
  }

  let decodedToken;
  try {
    decodedToken = jwtDecode(auth.token);
  } catch (error) {
    console.error("Error decoding token", error);
    return <Navigate to="/login" />;
  }

  const rol = decodedToken.role;

  // Definir rutas restringidas por rol
  const roleBasedRedirections = {
    ROLE_ADMIN: ['/parque-vehiculos', '/tarjetas-magneticas', '/asociar-actividad', '/planificacion-cda'],
    ROLE_USER: [
      '/users', '/users/inactive', '/portadores', '/portadores/inactive',
      '/unidades-medida', '/tipo-portadores', '/tipo-portadores/inactive',
      '/categorias-cda/inactive', '/sector-cda', '/actividades-cda',
      '/marcas', '/marcas/inactive', '/modelos', '/modelos/inactive',
      '/provincias', '/municipios', '/tipos-vehiculos', '/unidades', 
      '/unidades/inactive', '/parque-vehiculos-admin'
    ],
    ROLE_ENERGETICO: [
      '/users', '/users/inactive', '/portadores', '/portadores/inactive',
      '/unidades-medida', '/tipo-portadores', '/tipo-portadores/inactive',
      '/categorias-cda/inactive', '/sector-cda', '/actividades-cda',
      '/marcas', '/marcas/inactive', '/modelos', '/modelos/inactive',
      '/provincias', '/municipios', '/tipos-vehiculos', '/unidades', 
      '/unidades/inactive', '/parque-vehiculos-admin'
    ]
  };

  // Redirigir si el rol no tiene acceso a la ruta
  const restrictedPaths = roleBasedRedirections[rol] || [];
  if (restrictedPaths.includes(location.pathname)) {
    return <Navigate to="/" />;
  }

  return <Component />;
};

export default PrivateRoute;