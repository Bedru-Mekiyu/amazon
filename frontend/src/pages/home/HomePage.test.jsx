import { it, expect, describe, vi, beforeEach } from "vitest";
import { render, screen, within, waitFor, act } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import { HomePage } from "./HomePage.jsx";

vi.mock("axios");

describe("home page component", () => {
  let loadcart;
  let user;

  beforeEach(() => {
    loadcart = vi.fn();
    user = userEvent.setup();

    axios.get.mockResolvedValue({
      data: [
        {
          id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          image: "images/products/athletic-cotton-socks-6-pairs.jpg",
          name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
          rating: { stars: 4.5, count: 87 },
          priceCents: 1090,
        },
        {
          id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
          image: "images/products/intermediate-composite-basketball.jpg",
          name: "Intermediate Size Basketball",
          rating: { stars: 4, count: 127 },
          priceCents: 2095,
        },
      ],
    });
  });

  it("handles quantity selection and add-to-cart correctly", async () => {
    render(
      <MemoryRouter>
        <HomePage cart={[]} loadcart={loadcart} />
      </MemoryRouter>
    );

    // Wait for products and selectors
    const quantitySelectors = await screen.findAllByTestId("quantity-container");
    const productContainers = await screen.findAllByTestId("products-container");

    // select different quantities safely
    await act(async () => {
      await user.selectOptions(quantitySelectors[0], "2");
      await user.selectOptions(quantitySelectors[1], "3");
    });

    expect(quantitySelectors[0]).toHaveValue("2");
    expect(quantitySelectors[1]).toHaveValue("3");

    // click add-to-cart for both
    await act(async () => {
      await user.click(within(productContainers[0]).getByTestId("add-to-cart-button"));
      await user.click(within(productContainers[1]).getByTestId("add-to-cart-button"));
    });

    // wait for axios and loadcart
    await waitFor(() => {
      expect(axios.post).toHaveBeenNthCalledWith(1, "/api/cart-items", {
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2,
      });
      expect(axios.post).toHaveBeenNthCalledWith(2, "/api/cart-items", {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 3,
      });
      expect(loadcart).toHaveBeenCalledTimes(2);
    });
  });
});
