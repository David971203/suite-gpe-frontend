
"use client";

import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { DarkThemeToggle, Flowbite } from "flowbite-react";
import logo from "../../img/logo.png";
import avatar from "../../img/img_avatar1.png";
function navbarComponent() {
  return (
    <Navbar>
      <Navbar.Brand href="/">
      <img src={logo} className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">SUIETE-GPE</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
      <DarkThemeToggle className="mx-2"/>
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar className="w-10 h-10 rounded-full cursor-pointer" alt="User settings" img={avatar} rounded />
          }
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
        <Navbar.Toggle />
      </div>
      
      <Navbar.Collapse>
        <Navbar.Link href="#" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="#">About</Navbar.Link>
        <Navbar.Link href="#">Services</Navbar.Link>
        <Navbar.Link href="#">Pricing</Navbar.Link>
        <Navbar.Link href="#">Contact</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default  navbarComponent;
