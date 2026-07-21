import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router";
import { it, expect, describe, vi, beforeEach } from "vitest";

import { PaymentSummary } from "./PaymentSummary";

vi.mock("../../context/CartContext", () => ({
  useCart: () => ({ cart: [], loadcart: vi.fn() }),
}));

function Location() {
  const location = useLocation();
  return <div data-testid="url-path">{location.pathname}</div>;
}

describe("PaymentSummary Integration Test (Navigation + API)", () => {
  const mockPaymentSummary = {
    totalItems: 2,
    productCostCents: 2000,
    shippingCostCents: 500,
    totalCostBeforeTaxCents: 2500,
    taxCents: 250,
    totalCostCents: 2750,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls onPlaceOrder when clicked and navigates to /orders", async () => {
    const onPlaceOrder = vi.fn().mockResolvedValueOnce();

    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <PaymentSummary
          paymentSummary={mockPaymentSummary}
          onPlaceOrder={onPlaceOrder}
        />
        <Location /> {/* show current URL */}
      </MemoryRouter>
    );

    // Confirm we start on /cart
    expect(screen.getByTestId("url-path")).toHaveTextContent("/cart");

    // Click button
    const button = screen.getByRole("button", { name: /place your order/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(onPlaceOrder).toHaveBeenCalled();
    });
  });
});
