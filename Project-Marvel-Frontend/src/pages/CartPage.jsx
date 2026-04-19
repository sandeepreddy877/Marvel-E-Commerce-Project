import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import API from '../services/api';

function CartPage() {

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("USER:", user);
    if (user && user.id) {
      API.get(`/cart/${user.id}`)
        .then((res) => {
          // console.log("CART RESPONSE:", res.data);

          if (res.data && res.data.length > 0) {
            const dbCart = res.data.map(item => ({
              ...item.product,
              quantity: item.quantity,
              selectedSize: item.size,
              dbId: item.id
            }));


            setCart(dbCart);
            localStorage.setItem("cart", JSON.stringify(dbCart));
          }
        })
        .catch(err => console.error("Could not sync cart from database", err));
    }
  }, []);

  // 🔥 FIX: normalize quantity
  const [cart, setCart] = useState(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      const parsed = storedCart ? JSON.parse(storedCart) : [];

      return parsed.map((item) => ({
        ...item,
        quantity: item.quantity || 1,
      }));
    } catch {
      return [];
    }
  });

  // ❌ REMOVE
  const removeItem = async (index) => {
    const itemToRemove = cart[index];
    const user = JSON.parse(localStorage.getItem("user"));

    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));

    if (user) {
      try {

        await API.delete(`/cart/${itemToRemove.dbId}`);
      } catch (err) {
        console.error("Failed to remove from DB", err);
      }
    }
  };

  // ➕ FIXED
  // Inside increaseQty:
  const increaseQty = (index) => {
    const updated = [...cart];
    updated[index].quantity += 1;
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));

    // SYNC TO DB
    updateQtyInDb(updated[index].dbId, 1, updated[index].selectedSize);
  };

  // ➖ FIXED
  const decreaseQty = (index) => {
    const updated = [...cart];

    const currentQty = updated[index].quantity || 1;

    if (currentQty > 1) {
      updated[index].quantity = currentQty - 1;
    }

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };


  const total = cart.reduce((sum, item) => {

    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;
    return sum + (price * qty);
  }, 0);



  const handleCheckout = () => {

    const user = JSON.parse(localStorage.getItem("user")); // Check for user

    if (!user) {
      toast.error("Please login to proceed to checkout! 🔑");
      setTimeout(() => {
        navigate('/login'); // Redirect to login
      }, 1500);
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty! 🛒");
    } else {
      navigate('/checkout'); // Redirect to your new form page
    }
  };


  const handleViewOrders = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      toast.error("Please login to view your order history! 🛡️");
      setTimeout(() => {
        navigate('/login'); // Redirect to login
      }, 1500);
      return;
    }

    navigate('/orders');
  };


  const updateQtyInDb = async (cartId, newQty, size) => {
    try {
      await API.put(`/cart/update/${cartId}`, {
        quantity: newQty,
        size: size
      });

      console.log("Quantity updated in DB ✅");

    } catch (err) {
      console.log("DB UPDATE ERROR:", err.response?.data);
    }
  };


  return (
    <div className="cart-container">
      <ToastContainer />
      {/* LEFT SIDE */}
      <div className="cart-left">

        <h2>Your Cart 🛒</h2>

        {cart.length === 0 ? (
          <p>No items added yet.</p>
        ) : (
          cart.map((item, index) => (
            <div key={index} className="cart-row">

              {/* IMAGE */}
              <img src={item.imageUrl} alt={item.name} />

              {/* DETAILS */}
              <div className="cart-details">
                <h4>{item.name}</h4>

                {item.selectedSize && (
                  <p>Size: {item.selectedSize}</p>
                )}

                {/* 🔢 QTY FIXED */}
                <div className="qty-box">
                  <button onClick={() => decreaseQty(index)}>-</button>
                  <span>{item.quantity || 1}</span>
                  <button onClick={() => increaseQty(index)}>+</button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>
              </div>

              {/* PRICE COLUMN */}
              <div className="cart-price">
                <p>${item.price}</p>

                {/* 💰 FIXED */}
                <p className="item-total">
                  ${item.price * (item.quantity || 1)}
                </p>
              </div>

            </div>
          ))
        )}
      </div>

      {/* RIGHT SIDE (The Checkout Sidebar) */}

      <div className="cart-right">

        <h3>Subtotal</h3>
        <h2>${total}</h2>

        <button className="checkout-btn" onClick={handleCheckout}>
          Proceed to Checkout
        </button>

        {/* VIEW MY ORDERS BUTTON */}
        <button
          className="view-orders-btn"
          onClick={() => handleViewOrders()}
          style={{
            marginTop: '15px',
            width: '100%',
            padding: '12px',
            backgroundColor: 'transparent',
            color: '#00BFFF',
            border: '2px solid #00BFFF',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          View My Orders 🛡️
        </button>
      </div>

    </div>
  );
}

export default CartPage;