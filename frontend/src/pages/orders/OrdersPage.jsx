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

  useEffect(() => {
    let cancelled = false;
    const fetchOrderData = async () => {
      try {
        const response = await axios.get("/api/orders?expand=products");
        if (!cancelled) {
          setOrders(response.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchOrderData();
    return () => { cancelled = true; };
  }, []);

  return (
    <Fragment>
      <title>Orders</title>
      <link rel="icon" type="image/svg+xml" href="/orders-favicon.png" />

      <Header />

      <div className="orders-page">
        <div className="page-title">Your Orders</div>

        <div className="orders-grid">
          {loading
            ? Array.from({ length: 3 }, (_, i) => <OrderSkeleton key={i} />)
            : orders.map((order) => (
                <div key={order.id} className="order-container">
                  <OrderHeader order={order} />
                  <OrderDetailGrind order={order} />
                </div>
              ))}
        </div>
      </div>
    </Fragment>
  );
}

export default OrdersPage;
