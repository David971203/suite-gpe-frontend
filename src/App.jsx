import { useState } from 'react';
import Layout from './componentes/layout/layout';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import {
  HOME,
  EMPTY,
  USERS_ACT,
  USERS_INACT,
  PORTADORES_ACT,
  PORTADORES_INACT,
  UNIDADES_MEDIDA,
  TIPO_PORTADORES_ACT,
  TIPO_PORTADORES_INACT,
  CATEGORIA_CDA_ACT,
  CATEGORIA_CDA_INACT,
  ACTIVIDAD_CDA_ACT,
  ACTIVIDAD_CDA_INACT,
  SECTOR,
  LOGIN,
} from './routes/Paths';
import HomePage from './componentes/pages/homepage';
import UsariosActivos from './componentes/pages/usuarios/usarios-activos';
import UsariosInactivos from './componentes/pages/usuarios/usuarios-inactivos';
import PortadoresActivos from './componentes/pages/portadores_energeticos/portadores-energeticos-activos';
import PortadoresInactivos from './componentes/pages/portadores_energeticos/portadores-energeticos-inactivos';
import UnidadesMedidas from './componentes/pages/unidades_medidas/unidades-medidas';
import TipoPortadoresActivos from './componentes/pages/tipo_portadores_energeticos/tipo_portadores-energeticos-activos';
import TipoPortadoresInactivos from './componentes/pages/tipo_portadores_energeticos/tipo_portadores-energeticos-inactivos';
import CategoriasCdaActivos from './componentes/pages/categorias-cda/categorias-cda-activos';
import CategoriasCdaInactivos from './componentes/pages/categorias-cda/categorias-cda-inactivos';
import ActividadesCdaActivos from './componentes/pages/actividades-cda/actividades-cda-activos';
import ActividadesCdaInactivos from './componentes/pages/actividades-cda/actividades-cda-inactivos';
import Sectores from './componentes/pages/sector/sector';
import Login from './componentes/pages/login';
import PrivateRoute from './componentes/pages/PrivateRoute';
import './App.css';
import { Flowbite } from 'flowbite-react';

function App() {
  return (
    <Flowbite>
      <AuthProvider>
        <BrowserRouter>
        <Routes>
            {/* Default route */}
            <Route path={EMPTY} element={<Navigate to={HOME} />} />

            {/* Login page */}
            <Route path={LOGIN} element={<Login />} />

            {/* Protected routes */}
            
    
              <Route path={HOME} element={<PrivateRoute component={HomePage} />} />

              <Route path={USERS_ACT} element={<PrivateRoute component={UsariosActivos} />} />
              <Route path={USERS_INACT} element={<PrivateRoute component={UsariosInactivos} />} />

              <Route path={PORTADORES_ACT} element={<PrivateRoute component={PortadoresActivos} />} />
              <Route path={PORTADORES_INACT} element={<PrivateRoute component={PortadoresInactivos} />} />

              <Route path={UNIDADES_MEDIDA} element={<PrivateRoute component={UnidadesMedidas} />} />

              <Route path={TIPO_PORTADORES_ACT} element={<PrivateRoute component={TipoPortadoresActivos} />} />
              <Route path={TIPO_PORTADORES_INACT} element={<PrivateRoute component={TipoPortadoresInactivos} />} />

              <Route path={CATEGORIA_CDA_ACT} element={<PrivateRoute component={CategoriasCdaActivos} />} />
              <Route path={CATEGORIA_CDA_INACT} element={<PrivateRoute component={CategoriasCdaInactivos} />} />

              <Route path={ACTIVIDAD_CDA_ACT} element={<PrivateRoute component={ActividadesCdaActivos} />} />
              <Route path={ACTIVIDAD_CDA_INACT} element={<PrivateRoute component={ActividadesCdaInactivos} />} />

              <Route path={SECTOR} element={<PrivateRoute component={Sectores} />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Flowbite>
  );
}
export default App;