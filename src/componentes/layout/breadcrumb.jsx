
"use client";

import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { useLocation } from 'react-router-dom';

function BreadCrumbComponent() {
  const location = useLocation();

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
      case '/unidades-medida':
      return (
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="/" icon={HiHome}>
            Inicio
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/unidades-medida">Unidades de Medida</Breadcrumb.Item>
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
          <Breadcrumb.Item href="/categorias-cda/inactive">Inactivos</Breadcrumb.Item>
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
