import { Product } from "./Product";

export function ProductsGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="products-grid-empty">
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map((product) => {
        return <Product key={product.id} product={product} />;
      })}
    </div>
  );
}
