import { Link } from "react-router";
import axios from "axios";
import dayjs from "dayjs";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import "./TrackingPage.css";
import { Header } from "../components/Header";
import { TrackingSkeleton } from "../components/Skeleton";

export function TrackingPage() {
  const { orderId, productId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchTrackingData = async () => {
      try {
        const response = await axios.get(
          `/api/orders/${orderId}?expand=products`
        );
        if (!cancelled) {
          setOrder(response.data);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    fetchTrackingData();
    return () => { cancelled = true; };
  }, [orderId]);

  if (loading) {
    return (
      <>
        <Header />
        <TrackingSkeleton />
      </>
    );
  }

  if (!order) {
    return null;
  }

  const orderProduct = order.products.find(
    (p) => String(p.productId) === String(productId)
  );

  if (!orderProduct) {
    return (
      <>
        <title>tracking</title>
        <Header />
        <div className="tracking-page">
          <p>Product not found in this order.</p>
        </div>
      </>
    );
  }

  const totalDeliveryTimeMs =
    orderProduct.estimatedDeliveryTimeMs - order.orderTimeMs;
  const timePassedMs = dayjs().valueOf() - order.orderTimeMs;
  let deliveryPercent = (timePassedMs / totalDeliveryTimeMs) * 100;
  if (deliveryPercent > 100) {
    deliveryPercent = 100;
  }

  let isPreparing, isShipped, isDelivered;
  if (deliveryPercent < 33) {
    isPreparing = deliveryPercent;
  } else if (deliveryPercent >= 33 && deliveryPercent < 100) {
    isShipped = deliveryPercent;
  } else if (deliveryPercent === 100) {
    isDelivered = deliveryPercent;
  }

  return (
    <>
      <title>tracking</title>
      <link rel="icon" type="image/svg+xml" href="tracking-favicon.png" />

      <Header />

      <div className="tracking-page">
        <div className="order-tracking">
          <Link className="back-to-orders-link link-primary" to="/orders">
            View all orders
          </Link>

          <div className="delivery-date">
            {deliveryPercent >= 100 ? "delivered on" : "Arriving on"}{" "}
            {dayjs(orderProduct.estimatedDeliveryTimeMs).format("MMMM D")}
          </div>

          <div className="product-info">{orderProduct.product.name}</div>

          <div className="product-info">
            Quantity: {orderProduct.quantity}
          </div>

          <img className="product-image" src={orderProduct.product.image} />

          <div className="progress-labels-container">
            <div
              className={`progress-label ${isPreparing && "current-status"}`}
            >
              Preparing
            </div>
            <div className={`progress-label ${isShipped && "current-status"}`}>
              Shipped
            </div>
            <div
              className={`progress-label ${isDelivered && "current-status"}`}
            >
              Delivered
            </div>
          </div>

          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${deliveryPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
