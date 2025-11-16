import { Link } from "react-router";
import "./CheckoutHeader.css";

import logo from "../../assets/images/logo.png";
import mobileLogoWhite from "../../assets/images/mobile-logo-white.png";
import checkoutIcon from "../../assets/images/icons/checkout-lock-icon.png";



export function CheckoutHeader({cart}){
  let totalQuantity= 0;
    cart.forEach((CartItem) => {
      totalQuantity += CartItem.quantity;
    })
    return(
        <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <Link to="/">
              <img className="logo" src={logo} />
              <img className="mobile-logo" src={mobileLogoWhite} />
            </Link>
          </div>
  
          <div className="checkout-header-middle-section">
            Checkout (<Link className="return-to-home-link"
              to="/">{totalQuantity} items</Link>)
          </div>
  
          <div className="checkout-header-right-section">
            <img src={checkoutIcon} />
          </div>
        </div>
      </div>
    );
}