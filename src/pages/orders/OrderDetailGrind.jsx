import { Fragment } from "react";
import axios from "axios";
import { Link } from "react-router";
import dayjs from "dayjs";
import buy from "../../assets/images/icons/buy-again.png";
export function OrderDetailGrind({ order, loadcart }) {
  return (
    <div className="order-details-grid">
      {order.products.map((orderProduct) => {

        const addtocart = async () => {
          await axios.post("/api/cart-items", {
            productId: orderProduct.product.id,
            quantity: 1,
          });
          await loadcart();
          
        };
        return (
          <Fragment key={orderProduct.id}>
            <div className="product-image-container">
              <img src={orderProduct.product.image} />
            </div>

            <div className="product-details">
              <div className="product-name">{orderProduct.product.name}</div>
              <div className="product-delivery-date">
                Arriving on:{" "}
                {dayjs(orderProduct.estmitedDeliveryTimeMs).format("MMMM D")}
              </div>
              <div className="product-quantity">
                Quantity: {orderProduct.quantity}
              </div>
              <button className="buy-again-button button-primary">
                <img className="buy-again-icon" src={buy} />
                <span className="buy-again-message" onClick={addtocart}>
                  Add to Cart
                </span>
              </button>
            </div>

            <div className="product-actions">
              <Link to={`/tracking/${order.id}/${orderProduct.product.id}`}>
                <button className="track-package-button button-secondary">
                  Track package
                </button>
              </Link>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
