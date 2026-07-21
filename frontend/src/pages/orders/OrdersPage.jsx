import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import "./OrdersPage.css";
import { Header } from "../../components/Header";
import { OrderHeader } from "./OrderHeader";
import { OrderDetailGrind } from "./OrderDetailGrind";
import { OrderSkeleton } from "../../components/Skeleton";

export function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchOrderData = async () => {
      try {
        const response = await axios.get("/api/orders?expand=products");
        if (!cancelled) {
          setOrders(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Failed to load orders. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchOrderData();
    return () => { cancelled = true; };
  }, []);

  const renderContent = () => {
    if (loading) {
      return Array.from({ length: 3 }, (_, i) => <OrderSkeleton key={i} />);
    }

    if (error) {
      return <div className="orders-empty">{error}</div>;
    }

    if (orders.length === 0) {
      return (
        <div className="orders-empty">
          <p>No orders yet.</p>
          <p>Start shopping to see your orders here.</p>
          <a href="/" className="button-primary">Browse products</a>
        </div>
      );
    }

    return orders.map((order) => (
      <div key={order.id} className="order-container">
        <OrderHeader order={order} />
        <OrderDetailGrind order={order} />
      </div>
    ));
  };

  return (
    <Fragment>
      <title>Orders</title>
      <link rel="icon" type="image/svg+xml" href="/orders-favicon.png" />

      <Header />

      <div className="orders-page">
        <div className="page-title">Your Orders</div>

        <div className="orders-grid">
          {renderContent()}
        </div>
      </div>
    </Fragment>
  );
}

export default OrdersPage;
