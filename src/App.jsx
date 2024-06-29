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
  LOGIN,
} from './routes/Paths';
import HomePage from './componentes/pages/homepage';
import UsariosActivos from './componentes/pages/usuarios/usarios-activos';
import UsariosInactivos from './componentes/pages/usuarios/usuarios-inactivos';
import PortadoresActivos from './componentes/pages/portadores_energeticos/portadores-energeticos-activos';
import PortadoresInactivos from './componentes/pages/portadores_energeticos/portadores-energeticos-inactivos';
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
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Flowbite>
  );
}
export default App;