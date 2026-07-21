import dayjs from "dayjs";
import { formatMoney } from "../../utils/money";
import api from "../../api";
import { useCart } from "../../context/CartContext";

export function DeliveryOption({ deliveryOptions, cartItem }) {
  const { loadcart } = useCart();

  const updateDeliveryOptions = async (deliveryOption) => {
    await api.put(`/api/cart-items/${cartItem.productId}`, {
      deliveryOptionId: deliveryOption.id,
    });
    await loadcart();
  };

  return (
    <div className="delivery-options">
      <div className="delivery-options-title">Choose a delivery option:</div>
      {deliveryOptions.map((deliveryOption) => {
        let priceString = "FREE Shipping";
        if (deliveryOption.priceCents > 0) {
          priceString = `$${formatMoney(deliveryOption.priceCents)}-Shipping`;
        }

        return (
          <div
            key={deliveryOption.id}
            className="delivery-option"
            onClick={() => updateDeliveryOptions(deliveryOption)}
          >
            <input
              type="radio"
              checked={deliveryOption.id === cartItem.deliveryOptionId}
              className="delivery-option-input"
              onChange={() => {}}
              name={`delivery-option-${cartItem.productId}`}
            />
            <div>
              <div className="delivery-option-date">
                {dayjs(deliveryOption.estimatedDeliveryTimeMs).format(
                  "dddd, MMMM D"
                )}
              </div>
              <div className="delivery-option-price">{priceString}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
