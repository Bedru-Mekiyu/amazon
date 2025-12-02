import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import "./OrdersPage.css";
import { Header } from "../../components/Header";

import { OrderHeader } from "./OrderHeader";
import { OrderDetailGrind } from "./OrderDetailGrind";

export function OrdersPage({ cart, loadCart }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get("/api/orders?expand=products");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrderData();
  }, []);

  return (
    <Fragment>
      <title>Orders</title>
      <link
        rel="icon"
        type="image/svg+xml"
        href="/orders-favicon.png"
      />

      <Header cart={cart} />

      <div className="orders-page">
        <div className="page-title">Your Orders</div>

        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order.id} className="order-container">
              <OrderHeader order={order} />
              <OrderDetailGrind order={order} loadCart={loadCart} />
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
}

export default OrdersPage;
