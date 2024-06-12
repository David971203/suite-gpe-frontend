
"use client";

import React from 'react';
import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import { DarkThemeToggle } from 'flowbite-react';
import BreadCrumb from './breadcrumb';
import logo from '../../img/barrelr-energy-factory-svgrepo-com.svg';
import avatar from '../../img/img_avatar1.png';
import { HiMenu } from 'react-icons/hi';

function NavbarComponent({ showToggle, onToggleSidebar }) {
  return (
    <Navbar className="border-b border-gray-300 dark:border-gray-700">
      {showToggle &&
        <button
          aria-expanded="true"
          onClick={onToggleSidebar}
          className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <HiMenu className="w-6 h-6" />
          <span className="sr-only">Toggle sidebar</span>
        </button>
      }
      <Navbar.Brand href="/">
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">SUIETE-GPE</span>
      </Navbar.Brand>
      <BreadCrumb />
      <div className="flex md:order-2">
        <DarkThemeToggle className="mx-2" />
        <Dropdown
          arrowIcon={false}
          inline
          label={<Avatar className="w-10 h-10 rounded-full cursor-pointer" alt="User settings" img={avatar} rounded />}
        >
          <Dropdown.Header>
            <span className="block text-sm">Bonnie Green</span>
            <span className="block truncate text-sm font-medium">name@flowbite.com</span>
          </Dropdown.Header>
          <Dropdown.Item>Dashboard</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Item>Earnings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>
      </div>
    </Navbar>
  );
}

export default NavbarComponent;

