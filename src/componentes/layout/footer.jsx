"use client";

import { Footer } from "flowbite-react";
import logo from '../../img/logo.png';

export default function FooterComp() {
  return (
    <Footer container>
      <Footer.Brand
        href=""
        src={logo}
        alt="Flowbite Logo"
        name=""
      />
      <div className="w-full text-center">
        <Footer.Copyright by="SITRANS VILLA CLARA" year={new Date().getFullYear()} />
      </div>
    </Footer>
  );
}