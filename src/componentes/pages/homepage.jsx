"use client";
import Layout from "../layout/layout";
import fotoFront  from "../../img/image-4.jpg";
import { Card } from "flowbite-react";
import {jwtDecode} from 'jwt-decode';

function HomePage() {
  const token = localStorage.getItem('token'); // Obtén el token desde donde lo almacenes
if (token) {
  try {
    const decodedToken = jwtDecode(token);
    console.log(decodedToken.role); // Aquí puedes ver el contenido del token decodificado
  } catch (error) {
    console.error('Error decoding token:', error);
  }
}

  return (
    <Layout>
      <div class="grid gap-4 grid-cols-2">
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
      <div>    <Card className="max-w-sm" imgSrc={fotoFront} horizontal>
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Noteworthy technology acquisitions 2021
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
      </p>
    </Card></div>
    </div>
    </Layout>
  )
}

export default HomePage;