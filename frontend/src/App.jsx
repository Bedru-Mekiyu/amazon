import axios  from 'axios'
import { useState,useEffect } from 'react'
import { Route,Routes } from 'react-router'
import './App.css'
import { HomePage } from './pages/home/HomePage'
import { CheckoutPage } from './pages/checkout/CheckoutPage'
import { OrdersPage } from './pages/orders/OrdersPage'
import { TrackingPage } from './pages/TrackingPage'
import { NotFound } from './pages/NotFound'


function App() {
 
  const [cart,setCart] = useState([])

  const loadcart=async ()=>{
    const Response= await axios.get('/api/cart-items?expand=product')
    setCart(Response.data)
   
     };

 useEffect(()=>{
//  axios.get('/api/cart-items?expand=product')
// .then((Response)=>{
//   setCart(Response.data) ;
// });

   loadcart();

 },[])
  

  return (
    <Routes>  
      <Route path='/' element={ <HomePage cart={cart} loadcart={loadcart}/>}></Route>
      <Route path='checkout' element={<CheckoutPage cart={cart} loadcart={loadcart}/>}></Route>
      <Route path='orders' element={<OrdersPage cart={cart} loadcart={loadcart}/>}></Route>
      <Route path='tracking/:orderId/:productId' element={<TrackingPage cart={cart}/>}></Route>
      <Route path='*' element={<NotFound cart={cart}/>}></Route>
    </Routes>
  
  )
}

export default App
