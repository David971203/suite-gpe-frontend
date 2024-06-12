
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
