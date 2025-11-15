
import axios  from 'axios'; 

import { useState,useEffect, Fragment } from 'react';
import './OrdersPage.css'
import {Header} from "../../Components/Header"


import { OrdersGrid } from './OrdersGrid';

export function OrdersPage({cart,loadcart}){
  const [orders,setOrders]=useState([])

  useEffect(()=>{

    const fetchorderdata= async ()=>{
      const Response = await  axios.get('/api/orders?expand=products')
      setOrders(Response.data)

    };
    // axios.get('/api/orders?expand=products')
    // .then((Response)=>{
    //   setOrders(Response.data)
    // })
    fetchorderdata();

  },[])

    return(
        <>
    <title>Orders</title>
    <link rel="icon" type="image/svg+xml" href="orders-favicon.png" />
            <Header cart={cart} />
    <div className="orders-page">
      <div className="page-title">Your Orders</div>

       <OrdersGrid orders={orders} loadcart={loadcart}/>
    </div>
        </>
    );
}