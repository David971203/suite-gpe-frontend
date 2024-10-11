"use client";

import { Footer } from "flowbite-react";
import logo from '../../img/logo.png';

export default function FooterComp() {
  return (
    <Footer container className="py-2"> {/* Ajusta el padding vertical */}
      <Footer.Brand
        href=""
        src={logo}
        alt="Flowbite Logo"
        name=""
        
      />
      <div className="w-full text-center py-2"> {/* Ajusta el padding dentro del div */}
        <Footer.Copyright by="SITRANS VILLA CLARA" year={new Date().getFullYear()} />
      </div>
    </Footer>

  );
}