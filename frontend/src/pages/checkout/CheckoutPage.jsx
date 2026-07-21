import axios from "axios";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import "./checkout.css";
import { CheckoutHeader } from "./CheckoutHeader";
import { OrderSummary } from "./OrderSummary";
import { PaymentSummary } from "./PaymentSummary";

export function CheckoutPage() {
  const { cart } = useCart();
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
      <CheckoutHeader />

      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">
          <OrderSummary deliveryOptions={deliveryOptions} cart={cart} />

          <PaymentSummary paymentSummary={paymentSummary} />
        </div>
      </div>
    </>
  );
}
