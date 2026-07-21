import "./Skeleton.css";

export function ProductSkeleton() {
  return (
    <div className="product-skeleton" data-testid="product-skeleton">
      <div className="skeleton product-skeleton-image" />
      <div className="skeleton product-skeleton-text" />
      <div className="skeleton product-skeleton-text" />
      <div className="skeleton product-skeleton-rating" />
      <div className="skeleton product-skeleton-price" />
    </div>
  );
}

export function ProductsGridSkeleton({ count = 8 }) {
  return (
    <div className="products-grid">
      {Array.from({ length: count }, (_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

export function OrderSkeleton() {
  return (
    <div className="order-skeleton" data-testid="order-skeleton">
      <div className="order-skeleton-header">
        <div className="skeleton" style={{ width: "120px" }} />
        <div className="skeleton" style={{ width: "80px" }} />
        <div className="skeleton" style={{ width: "100px" }} />
      </div>
      <div className="order-skeleton-body">
        <div className="skeleton order-skeleton-image" />
        <div className="order-skeleton-details">
          <div className="skeleton" style={{ height: "0.875rem", width: "70%" }} />
          <div className="skeleton" style={{ height: "0.75rem", width: "40%" }} />
          <div className="skeleton" style={{ height: "0.75rem", width: "55%" }} />
        </div>
      </div>
    </div>
  );
}

export function TrackingSkeleton() {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <div
        className="skeleton"
        style={{ height: "1.5rem", width: "200px", marginBottom: "1.5rem" }}
      />
      <div
        className="skeleton"
        style={{ height: "200px", width: "100%", borderRadius: "8px" }}
      />
    </div>
  );
}
