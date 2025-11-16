import axios from "axios";

import { useState, useEffect } from "react";
import "./checkout.css";
import { CheckoutHeader } from "./CheckoutHeader";
import { OrderSummary } from "./OrderSummary.jsx";
import { PaymentSummary } from "./PaymentSummary.jsx";

export function CheckoutPage({ cart, loadcart }) {
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);

  useEffect(() => {
    const fetchcheckoutdata = async () => {
      const Response = await axios.get("/api/payment-summary");
      setPaymentSummary(Response.data);
    };
   

    fetchcheckoutdata();
    
  }, [cart]);

  useEffect(() => {
    // axios.get('/api/delivery-options?expand=estimatedDeliveryTime')
    // .then((Response)=>{
    //   setDeliveryOptions(Response.data)
    // })
    const fetchsummarydata = async () => {
      const Response = await axios.get(
        "/api/delivery-options?expand=estimatedDeliveryTime"
      );
      setDeliveryOptions(Response.data);

 
    };
    

    fetchsummarydata();
 
  }, []);

  return (
    <>
      <title>checkout</title>
      <link rel="icon" type="image/svg+xml" href="cart-favicon.png" />
      <CheckoutHeader cart={cart} />

      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">
          <OrderSummary
            deliveryOptions={deliveryOptions}
            cart={cart}
            loadcart={loadcart}
          />

          <PaymentSummary paymentSummary={paymentSummary} loadcart={loadcart} />
        </div>
      </div>
    </>
  );
}
