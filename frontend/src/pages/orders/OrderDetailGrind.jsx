import { Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import buy from "../../assets/images/icons/buy-again.png";

export function OrderDetailGrind({ order, loadCart }) {
  const handleAddToCart = async (productId) => {
    try {
      await axios.post("/api/cart-items", {
        productId,
        quantity: 1,
      });
      if (loadCart) {
        await loadCart();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="order-details-grid">
      {order.products.map((orderProduct) => (
        <Fragment key={orderProduct.id}>
          <div className="product-image-container">
            <img src={orderProduct.product.image} alt={orderProduct.product.name} />
          </div>

          <div className="product-details">
            <div className="product-name">{orderProduct.product.name}</div>
            <div className="product-delivery-date">
              Arriving on{" "}
              {dayjs(orderProduct.estmitedDeliveryTimeMs).format("MMMM D")}
            </div>
            <div className="product-quantity">
              Quantity: {orderProduct.quantity}
            </div>
            <button
              className="buy-again-button button-primary"
              onClick={() => handleAddToCart(orderProduct.product.id)}
            >
              <img className="buy-again-icon" src={buy} alt="Buy again" />
              <span className="buy-again-message">Add to Cart</span>
            </button>
          </div>

          <div className="product-actions">
            <Link
              to={`/tracking/${order.id}/${orderProduct.product.id}`}
            >
              <button className="track-package-button button-secondary">
                Track package
              </button>
            </Link>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
