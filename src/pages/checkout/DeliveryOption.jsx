import dayjs from "dayjs";
import { formatMoney } from "../../utils/money";
import axios from "axios";
export function DeliveryOption({ deliveryOptions, cartItem ,loadcart }) {
  return (
    <div className="delivery-options">
      <div className="delivery-options-title">Choose a delivery option:</div>
      {deliveryOptions.map((deliveryOption) => {
        let priceString = "FREE Shipping";
        if (deliveryOption.priceCents > 0) {
          priceString = `$${formatMoney(deliveryOption.priceCents)}-Shipping`;
        }
            const updateDeliveryOptions=async ()=>{
              await axios.put(`/api/cart-items/${cartItem.productId}`,{
                deliveryOptionId:deliveryOption.id
              })
             await loadcart();
            };

        return (
          <div key={deliveryOption.id} className="delivery-option" 
           onClick={updateDeliveryOptions}
          >
            <input
              type="radio"
              checked={deliveryOption.id === cartItem.deliveryOptionId}
              className="delivery-option-input"
              onChange={()=>{}}
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
