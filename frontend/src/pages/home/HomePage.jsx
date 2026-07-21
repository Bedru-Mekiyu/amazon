import { Header } from "../../components/Header.jsx";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import axios from "axios";
import "./HomePage.css";
import { ProductsGrid } from "./productsGrid.jsx";
import { ProductsGridSkeleton } from "../../components/Skeleton.jsx";

export function HomePage() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const urlPath = search
          ? `/api/products?search=${search}`
          : "/api/products";
        const response = await axios.get(urlPath);
        if (!cancelled) {
          setProducts(response.data);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    fetchProducts();
    return () => { cancelled = true; };
  }, [search]);

  return (
    <>
      <title>ecommerce</title>
      <link rel="icon" type="image/svg+xml" href="home-favicon.png" />
      <Header />

      <div className="home-page">
        {loading ? <ProductsGridSkeleton /> : <ProductsGrid products={products} />}
      </div>
    </>
  );
}
