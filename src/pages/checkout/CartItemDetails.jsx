import axios from "axios";
import { useState } from "react";

import { formatMoney } from "../../utils/money";
export function CartItemDetails({ cartItem, loadcart }) {
  const [quantity, setQuantity] = useState(cartItem.quantity);
  const [isUpdate, setIsUpdate] = useState(false);

  const deleteCartItem = async () => {
    await axios.delete(`/api/cart-items/${cartItem.productId}`, {});
    await loadcart();
  };

  const toggle = async () => {
    if (isUpdate) {
      await axios.put(`/api/cart-items/${cartItem.productId}`, {
      
        quantity
      });
      await loadcart();
      setIsUpdate(false);
    } else {
      setIsUpdate(true);
    }
  };

  const updateQuantity = (event) => {
    setQuantity(Number(event.target.value));
  };

  const handleEvent =(event)=>{
    if(event.key==='Enter'){
      toggle()
    }else if(event.key==='Escape'){
      setQuantity(cartItem.quantity)
      setIsUpdate(false);

    }

  }

  return (
    <>
      <img className="product-image" src={cartItem.product.image} />
      <div className="cart-item-details">
        <div className="product-name">{cartItem.product.name}</div>
        <div className="product-price">
          {formatMoney(cartItem.product.priceCents)}
        </div>
        <div className="product-quantity">
          <span>
            Quantity:
            {isUpdate ? (
              <input
                className="updaterInput"
                type="text"
                value={quantity}
                onChange={updateQuantity}
                onKeyDown={handleEvent}
              />
            ) : (
              <span className="quantity-label">{cartItem.quantity}</span>
            )}
          </span>
          <span className="update-quantity-link link-primary" onClick={toggle}>
            Update
          </span>
          <span
            className="delete-quantity-link link-primary"
            onClick={deleteCartItem}
          >
            Delete
          </span>
        </div>
      </div>
    </>
  );
}
