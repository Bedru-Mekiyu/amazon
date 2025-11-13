import { Product } from "./Product";

export function ProductsGrid({ products, loadcart }) {
  return (
    <div className="products-grid">
      {products.map((product) => {
        return (
          <Product key={product.id} loadcart={loadcart} product={product} />
        );
      })}
    </div>
  );
}
