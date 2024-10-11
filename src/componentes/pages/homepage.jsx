"use client";
import React, { useEffect, useState, useContext } from 'react';
import Layout from "../layout/layout";
import fotoFront  from "../../img/image-4.jpg";
import fotoCard  from "../../img/12_1.png";
import { Card } from "flowbite-react";
import {jwtDecode} from 'jwt-decode';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { HiPencil, HiTrash,HiRefresh, HiEye  } from "react-icons/hi";
import { Tooltip } from 'flowbite-react';

function HomePage() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Obtén el token desde donde lo almacenes
if (token) {
  try {
    const decodedToken = jwtDecode(token);

    const currentTime = Math.floor(Date.now() / 1000);

    // Verificar si el token ha vencido
    const tokenExpired = currentTime > decodedToken.exp;

    if (tokenExpired) {
      localStorage.setItem('rol', '');
      logout();
      navigate('/login');
    }
    
  } catch (error) {
    console.error('Error decoding token:', error);
  }
}

  
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
      setIsFlipped(!isFlipped);
    };

  return (
    <Layout>
      <div className="grid gap-4 lg:grid-cols-2 md:lg:grid-cols-2 sm:lg:grid-cols-1">
        <div>
        <Card className="max-w-sm" imgSrc={fotoFront} horizontal>
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Portadores Energeticos
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
      </p>
    </Card>
        </div>
      <div>
      <Card className="max-w-sm" imgSrc={fotoFront} horizontal>
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Noteworthy technology acquisitions 2021
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
      </p>
    </Card>
      </div>
      <div>    <Card className="max-w-sm" imgSrc={fotoFront} horizontal>
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Noteworthy technology acquisitions 2021
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
      </p>
    </Card></div>
      <div>
        <Card className="max-w-sm" imgSrc={fotoFront} horizontal>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Noteworthy technology acquisitions 2021
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
          </p>
        </Card>
      </div>
      
      
    </div>
    </Layout>
  )
}

export default HomePage;