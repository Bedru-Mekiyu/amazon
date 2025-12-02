
import { useState } from 'react';
import { useNavigate,NavLink,useSearchParams } from 'react-router';
import './header.css'
import logoWhite from '../assets/images/logo-white.png';
import mobileLogoWhite from '../assets/images/mobile-logo-white.png';
import searchIcon from '../assets/images/icons/search-icon.png';
import cartIcon from '../assets/images/icons/cart-icon.png';

export function Header({cart}){
  const navigate=useNavigate();
  const [SearchParams]=useSearchParams();
  const searchText=SearchParams.get('search');
  
  // let totalQuantity= 0;
  //      cart.forEach((CartItem) => {
  //     totalQuantity += CartItem.quantity;

  //   })
  const [search,setSearch]=useState(searchText||'');

  let totalQuantity = 0;

  if (Array.isArray(cart)) {
    cart.forEach((CartItem) => {
      totalQuantity += CartItem.quantity;
    });
  }

const handleSearchInput=(event)=>{
  setSearch(event.target.value)
}

const handleSearchButton= ()=>{
  navigate(`/?search=${search}`)
  
}
    return (
        <div className="header">
        <div className="left-section">
          <NavLink to="/" className="header-link">
            <img className="logo"
              src={logoWhite} />
            <img className="mobile-logo"
              src={mobileLogoWhite} />
          </NavLink>
        </div>
  
        <div className="middle-section">
          <input className="search-bar" type="text" placeholder="Search" value={search} onChange={handleSearchInput}/>
  
          <button className="search-button" onClick={handleSearchButton}>
            <img className="search-icon" src={searchIcon} />
          </button>
        </div>
  
        <div className="right-section">
          <NavLink className="orders-link header-link" to="/orders">
  
            <span className="orders-text">Orders</span>
          </NavLink>
  
          <NavLink className="cart-link header-link" to="/checkout">
            <img className="cart-icon" src={cartIcon} />
            <div className="cart-quantity">{totalQuantity}</div>
            <div className="cart-text">Cart</div>
          </NavLink>
        </div>
      </div>
    );
}