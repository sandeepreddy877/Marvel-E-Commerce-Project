import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../services/api';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

function ProductDetails() {
  const { id } = useParams();
  
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  // 🔥 SINGLE useEffect
  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);

        // ✅ default size = M
        if (res.data.size) {
          const sizes = res.data.size.split(",");
          if (sizes.includes("M")) {
            setSelectedSize("M");
          }
        }
      })
      .catch((err) => console.log(err));
  }, [id]);

  const addToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    // console.log("USER:", user);
    if (!user) {
      
      toast.error("Please login to add to cart! 🔑");
      setTimeout(() => {
        navigate('/login'); // Redirect to login
      }, 2500);
      return;
    }

    if (
      product.category?.toLowerCase().trim() === "marvel clothes" &&
      !selectedSize
    ) {
      alert("Please select size ❗");
      return;
    }

    try {
      await API.post("/cart/add", {
        userId: user.id,
        productId: product.id,
        quantity: quantity,
        size: selectedSize || null
      });

      toast.success("Added to cart 🛒");
    }
    catch (err) {
      console.log("FULL ERROR:", err);
      console.log("ERROR DATA:", err.response?.data);
      console.log("STATUS:", err.response?.status);

      alert("Error ❌");
    }
  };

  if (!product) return <h2>Loading...</h2>;

  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="row">

        {/* 🖼 IMAGE */}
        <div className="col-md-5 text-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="details-img"
          />
        </div>

        {/* 📦 DETAILS */}
        <div className="col-md-7">

          <h2>{product.name}</h2>

          <h4 className="text-warning mt-3">
            ${product.price}
          </h4>

          <p className="mt-3">
            {product.description}
          </p>

          {/* 👕 SIZE BUTTONS */}
          {product.category?.toLowerCase().trim() === "marvel clothes" &&
            product.size && (
              <div className="mt-3">
                <h5>Select Size:</h5>

                <div className="size-container">
                  {product.size.split(",").map((s, i) => {
                    const size = s.trim();
                    return (
                      <button
                        key={i}
                        className={`size-btn ${selectedSize === size ? "active-size" : ""
                          }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          {/* 🔢 QUANTITY */}
          <div className="mt-3">
            <h5>Quantity:</h5>

            <div className="qty-box">
              <button
                onClick={() =>
                  setQuantity(quantity > 1 ? quantity - 1 : 1)
                }
              >
                -
              </button>

              <span>{quantity}</span>

              <button onClick={() => setQuantity(quantity + 1)}>
                +
              </button>
            </div>
          </div>

          {/* 🛒 BUTTON */}
          <button
            className="btn btn-primary mt-4"
            onClick={addToCart}
          >
            Add to Cart 🛒
          </button>

        </div>
      </div>
    </div>
  );
}

export default ProductDetails;