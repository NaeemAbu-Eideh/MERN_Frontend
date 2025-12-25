import React from 'react';
import './App.css'
import Login from './Components/Login';
import { Routes, Route } from 'react-router-dom';
import Register from './Components/Register';
import {BrowserRouter} from "react-router-dom";
import Navbar from './Components/Navbar';
import Tournaments from './Components/Tournaments';
import Stadiums from './Components/Stadiums';
import Home from './Components/Home';


function App() {

  return (
    <>
      
      {/* وضعنا الناف بار هنا ليظهر في كل الصفحات */}
            <Navbar />
      
      <div className="bg-gray-50 min-h-screen"> 
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* يمكنك إضافة باقي المسارات هنا */}
          <Route path='/tournaments' element={<Tournaments/>} />
          <Route path="/stadiums" element={<Stadiums />} />
          <Route path="/home" element={<Home />} />
          
        </Routes>
      </div>
    
    </>
  )
}

export default App
