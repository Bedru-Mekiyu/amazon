/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const loadcart = async () => {
    try {
      const response = await api.get("/api/cart-items?expand=product");
      setCart(response.data);
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  useEffect(() => {
    loadcart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, loadcart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
