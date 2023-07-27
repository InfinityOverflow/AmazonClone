import './App.css';
import Navbar from './components/header/navbar';
import Newnav from './components/newnavbar/Newnav';
import MainComp from './components/home/MainComp';
import Footer from './components/footer/Footer';
import SignUp from './components/Signup_signIn/SignUp';
import SignIn from './components/Signup_signIn/SignIn';
import Product from './components/Product/Product';
import Cart from './components/cart/Cart'
import CircularProgress from '@mui/material/CircularProgress';

import {Routes,Route} from "react-router-dom";
import { useEffect, useState } from 'react';

function App() {

  const [data,setData]=useState(false);

  useEffect(()=>{
    setTimeout(()=>{
      setData(true)
    },2000)
  })

  return (
    <>
    {
      data ? (
        <>
        <Navbar/>
      <Newnav/>
      <Routes>
          <Route path='/' element={<MainComp/>}/>
          <Route path='/login' element={<SignIn/>}/>
          <Route path='/register' element={<SignUp/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/buyProduct/:id' element={<Product/>}/>
      </Routes>
      <Footer/>
        </>
      ):  (
        <div className="circle">
          <CircularProgress />
          <h2> Loading....</h2>
        </div>
      )
    }
      
    </>
  );
}

export default App;
