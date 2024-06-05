import { useState } from 'react'
import Layout from './componentes/layout/layout'
import { BrowserRouter, Routes, Route, Navigate,useLocation  } from "react-router-dom";
import {
  HOME,
  EMPTY
} from "./routes/Paths";
import HomePage from './componentes/pages/homepage'

import './App.css'
import { Button } from 'flowbite-react'
import { Flowbite } from "flowbite-react";

function App() {
  const [count, setCount] = useState(0)

  return (
    <Flowbite>
      <BrowserRouter>
        <Routes>
          {/* Default route */}
          <Route path={EMPTY} element={<Navigate to={HOME} />} />

          {/* Home page */}
          <Route path={HOME} element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </Flowbite>
    
  );
}

export default App
