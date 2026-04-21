import React from 'react'
import { useNavigate } from 'react-router-dom'

function ProductCart({ product }) {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    alert(`${product.name} added to cart 🛒`);
  };

  return (
    <div className="card mt-4 shadow-lg">

      {/* Product Image */}
      <img
        src={product.image_url}
        className="card-img-top"
        alt={product.name}
        style={{ height: "200px", objectFit: "cover", cursor: "pointer" }}
        onClick={() => navigate(`/product/${product.id}`)}
      />

      {/* Product Info */}
      <div className="card-body text-center">
        <h5 className="card-title">{product.name}</h5>

        <p className="card-text text-success fw-bold">
          ${product.price}
        </p>

        <button
          className="btn btn-danger w-100"
          onClick={handleAddToCart}
        >
          Add to Cart 🛒
        </button>
      </div>

    </div>
  )
}

export default ProductCart
