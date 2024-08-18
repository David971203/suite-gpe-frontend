
"use client";

import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { useLocation } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
function BreadCrumbComponent() {
  const location = useLocation();
const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const rol = decodedToken.role;
  switch(location.pathname){
    case '/':
      return (
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="/" icon={HiHome}>
            Inicio
          </Breadcrumb.Item>
        </Breadcrumb>
      );
    case '/users':
      return (
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="/" icon={HiHome}>
            Inicio
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/users">Usuarios</Breadcrumb.Item>
        </Breadcrumb>
      );
    case '/users/inactive':
      return (
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="/" icon={HiHome}>
            Inicio
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/users">Usuarios</Breadcrumb.Item>
          <Breadcrumb.Item href="/users/inactive">Inactivos</Breadcrumb.Item>
        </Breadcrumb>
      );
    case '/portadores':
      return (
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="/" icon={HiHome}>
            Inicio
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/portadores">Portadores Energéticos</Breadcrumb.Item>
        </Breadcrumb>
      );
      case '/portadores/inactive':
        return (
          <Breadcrumb aria-label="Default breadcrumb example">
            <Breadcrumb.Item href="/" icon={HiHome}>
              Inicio
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/portadores">Portadores Energéticos</Breadcrumb.Item>
            <Breadcrumb.Item href="/portadores/inactive">Inactivos</Breadcrumb.Item>
          </Breadcrumb>
        );
      case '/tipo-portadores':
      return (
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="/" icon={HiHome}>
            Inicio
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/tipo-portadores">Tipo de Portadores Energéticos</Breadcrumb.Item>
        </Breadcrumb>
      );
      case '/tipo-portadores/inactive':
        return (
          <Breadcrumb aria-label="Default breadcrumb example">
            <Breadcrumb.Item href="/" icon={HiHome}>
              Inicio
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/tipo-portadores">Tipo de Portadores Energéticos</Breadcrumb.Item>
            <Breadcrumb.Item href="/tipo-portadores/inactive">Inactivos</Breadcrumb.Item>
          </Breadcrumb>
        );
      case '/categorias-cda':
        return (
          <Breadcrumb aria-label="Default breadcrumb example">
            <Breadcrumb.Item href="/" icon={HiHome}>
              Inicio
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/categorias-cda">Categorías CDA</Breadcrumb.Item>
          </Breadcrumb>
        );
      case '/categorias-cda/inactive':
      return (
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="/" icon={HiHome}>
            Inicio
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/categorias-cda">Categorías CDA</Breadcrumb.Item>
          <Breadcrumb.Item href="/categorias-cda/inactive">Inactivas</Breadcrumb.Item>
        </Breadcrumb>
      );
      case '/actividades-cda':
        return (
          <Breadcrumb aria-label="Default breadcrumb example">
            <Breadcrumb.Item href="/" icon={HiHome}>
              Inicio
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/actividades-cda">Actividades CDA</Breadcrumb.Item>
          </Breadcrumb>
        );    
        case '/actividades-cda/inactive':
          return (
            <Breadcrumb aria-label="Default breadcrumb example">
              <Breadcrumb.Item href="/" icon={HiHome}>
                Inicio
              </Breadcrumb.Item>
              <Breadcrumb.Item href="/actividades-cda">Actividades CDA</Breadcrumb.Item>
              <Breadcrumb.Item href="/actividades-cda/inactive">Inactivas</Breadcrumb.Item>
            </Breadcrumb>
          );  
        case '/unidades-medida':
        return (
          <Breadcrumb aria-label="Default breadcrumb example">
            <Breadcrumb.Item href="/" icon={HiHome}>
              Inicio
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/unidades-medida">Unidades de Medida</Breadcrumb.Item>
          </Breadcrumb>
        );
        case '/tipos-vehiculos':
          return (
            <Breadcrumb aria-label="Default breadcrumb example">
              <Breadcrumb.Item href="/" icon={HiHome}>
                Inicio
              </Breadcrumb.Item>
              <Breadcrumb.Item href="/tipos-vehiculos">Tipos de Vehículos</Breadcrumb.Item>
            </Breadcrumb>
          );
        case '/parque-vehiculos-admin':
          return (
            <Breadcrumb aria-label="Default breadcrumb example">
              <Breadcrumb.Item href="/" icon={HiHome}>
                Inicio
              </Breadcrumb.Item>
              <Breadcrumb.Item href="/parque-vehiculos-admin">Vehículos</Breadcrumb.Item>
            </Breadcrumb>
          );
        case '/parque-vehiculos':
          return (
            <Breadcrumb aria-label="Default breadcrumb example">
              <Breadcrumb.Item href="/" icon={HiHome}>
                Inicio
              </Breadcrumb.Item>
              <Breadcrumb.Item href="/parque-vehiculos">Parque de  Vehículos</Breadcrumb.Item>
            </Breadcrumb>
          );
          case '/parque-vehiculos/inactive':
            return (
              <Breadcrumb aria-label="Default breadcrumb example">
                <Breadcrumb.Item href="/" icon={HiHome}>
                  Inicio
                </Breadcrumb.Item>
                {
                    rol === 'ROLE_ADMIN' ?
                    <Breadcrumb.Item href="/parque-vehiculos-admin">Vehículos</Breadcrumb.Item>
                : 
                    <Breadcrumb.Item href="/parque-vehiculos">Parque de  Vehículos</Breadcrumb.Item>
                }
                
                <Breadcrumb.Item href="/parque-vehiculos/inactive">Vehículos Inactivos</Breadcrumb.Item>
              </Breadcrumb>
            );
        case '/marcas':
          return (
            <Breadcrumb aria-label="Default breadcrumb example">
              <Breadcrumb.Item href="/" icon={HiHome}>
                Inicio
              </Breadcrumb.Item>
              <Breadcrumb.Item href="/marcas">Marcas</Breadcrumb.Item>
            </Breadcrumb>
          );
        case '/marcas/inactive':
        return (
          <Breadcrumb aria-label="Default breadcrumb example">
            <Breadcrumb.Item href="/" icon={HiHome}>
              Inicio
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/marcas">Marcas</Breadcrumb.Item>
            <Breadcrumb.Item href="/marcas/inactive">Inactivas</Breadcrumb.Item>
          </Breadcrumb>
        );
        case '/modelos':
          return (
            <Breadcrumb aria-label="Default breadcrumb example">
              <Breadcrumb.Item href="/" icon={HiHome}>
                Inicio
              </Breadcrumb.Item>
              <Breadcrumb.Item href="/modelos">Modelos</Breadcrumb.Item>
            </Breadcrumb>
          );
        case '/modelos/inactive':
        return (
          <Breadcrumb aria-label="Default breadcrumb example">
            <Breadcrumb.Item href="/" icon={HiHome}>
              Inicio
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/modelos">Modelos</Breadcrumb.Item>
            <Breadcrumb.Item href="/modelos/inactive">Inactivas</Breadcrumb.Item>
          </Breadcrumb>
        );
        case '/provincias':
        return (
          <Breadcrumb aria-label="Default breadcrumb example">
            <Breadcrumb.Item href="/" icon={HiHome}>
              Inicio
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/provincias">Provincias</Breadcrumb.Item>
          </Breadcrumb>
        );
        case '/municipios':
        return (
          <Breadcrumb aria-label="Default breadcrumb example">
            <Breadcrumb.Item href="/" icon={HiHome}>
              Inicio
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/municipios">Municipios</Breadcrumb.Item>
          </Breadcrumb>
        );
        case '/unidades':
        return (
          <Breadcrumb aria-label="Default breadcrumb example">
            <Breadcrumb.Item href="/" icon={HiHome}>
              Inicio
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/unidades">Unidades</Breadcrumb.Item>
          </Breadcrumb>
        );
        case '/unidades/inactive':
        return (
          <Breadcrumb aria-label="Default breadcrumb example">
            <Breadcrumb.Item href="/" icon={HiHome}>
              Inicio
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/unidades">Unidades</Breadcrumb.Item>
            <Breadcrumb.Item href="/unidades/inactive">Inactivas</Breadcrumb.Item>
          </Breadcrumb>
        );    
        default:
        return (
          <Breadcrumb aria-label="Default breadcrumb example">
            <Breadcrumb.Item href="#" icon={HiHome}>
              {location.pathname}
            </Breadcrumb.Item>
            <Breadcrumb.Item href="#">Projects</Breadcrumb.Item>
            <Breadcrumb.Item>Flowbite React</Breadcrumb.Item>
          </Breadcrumb>
        );
  }
}

export default BreadCrumbComponent;
