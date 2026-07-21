import { Header } from "../../components/Header.jsx";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import axios from "axios";
import "./HomePage.css";
import { ProductsGrid } from "./productsGrid.jsx";

export function HomePage() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const HomeData = async () => {
      const urlPath = search
        ? `/api/products?search=${search}`
        : "/api/products";
      const Response = await axios.get(urlPath);
      setProducts(Response.data);
    };
    HomeData();
  }, [search]);

  return (
    <>
      <title>ecommerce</title>
      <link rel="icon" type="image/svg+xml" href="home-favicon.png" />
      <Header />

      <div className="home-page">
        <ProductsGrid products={products} />
      </div>
    </>
  );
}
