import { CartProvider } from "../context/CartContext";
import { vi } from "vitest";

export function renderWithCart(ui, { cart = [], loadcart = vi.fn() } = {}) {
  // Mock the context module so useCart returns our test values
  vi.mock("../context/CartContext", async () => {
    const actual = await vi.importActual("../context/CartContext");
    return {
      ...actual,
      useCart: () => ({ cart, loadcart }),
    };
  });

  return { cart, loadcart };
}
