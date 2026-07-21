import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../../context/CartContext";
import "./checkout.css";
import { CheckoutHeader } from "./CheckoutHeader";
import { OrderSummary } from "./OrderSummary";
import { PaymentSummary } from "./PaymentSummary";

export function CheckoutPage() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const [paymentRes, deliveryRes] = await Promise.all([
          axios.get("/api/payment-summary"),
          axios.get("/api/delivery-options?expand=estimatedDeliveryTime"),
        ]);
        if (!cancelled) {
          setPaymentSummary(paymentRes.data);
          setDeliveryOptions(deliveryRes.data);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load checkout data. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [cart]);

  const handlePlaceOrder = useCallback(async () => {
    setPlacingOrder(true);
    setError(null);
    try {
      await axios.post("/api/orders");
      navigate(`/orders`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <>
        <CheckoutHeader />
        <div className="checkout-page">
          <div className="checkout-loading">Loading checkout...</div>
        </div>
      </>
    );
  }

  if (error && !paymentSummary) {
    return (
      <>
        <CheckoutHeader />
        <div className="checkout-page">
          <div className="checkout-error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="button-primary">
              Try again
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <>
        <title>checkout</title>
        <link rel="icon" type="image/svg+xml" href="cart-favicon.png" />
        <CheckoutHeader />
        <div className="checkout-page">
          <div className="page-title">Review your order</div>
          <div className="checkout-empty">
            <p>Your cart is empty.</p>
            <a href="/" className="button-primary">Browse products</a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <title>checkout</title>
      <link rel="icon" type="image/svg+xml" href="cart-favicon.png" />
      <CheckoutHeader />

      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        {error && <div className="checkout-error-banner">{error}</div>}

        <div className="checkout-grid">
          <OrderSummary deliveryOptions={deliveryOptions} cart={cart} />

          <PaymentSummary
            paymentSummary={paymentSummary}
            onPlaceOrder={handlePlaceOrder}
            placingOrder={placingOrder}
          />
        </div>
      </div>
    </>
  );
}
