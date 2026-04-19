import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ 1. Fixed the Fetch logic to use the identifier from your backend logic
  const fetchOrders = async () => {
    if (!user) return;
    try {
      // Use name/username fallback as per your original logic
      const identifier = user.email;
      const res = await API.get(`/orders/user/${identifier}`);
      const updatedOrders = res.data.map(order => {
        if (order.deliveryStatus === "PENDING") {
          const date = new Date(order.dateOfOrder);
          const randomDays = Math.floor(Math.random() * 5) + 2;
          date.setDate(date.getDate() + randomDays);
      
          return {
            ...order,
            expectedDate: date.toISOString().split("T")[0]
          };
        }
      
        return order;
      });
      
      
      const statusPriority = {
        "PENDING": 1,
        "DELIVERED": 2,
        "CANCELLED": 3
      };

      const sortedOrders = updatedOrders.sort((a, b) => {
        return statusPriority[a.deliveryStatus] - statusPriority[b.deliveryStatus];
      });
      
      
      setOrders(updatedOrders);
    } catch (err) {
      console.error("Error fetching orders", err);
      toast.error("Failed to load orders from the vault.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  
  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        
        await API.put(`/orders/cancel/${id}`, "CANCELLED");
        
        toast.success("Order Cancelled Successfully ❌");
        fetchOrders(); // Refresh the list
      } catch (err) {
        console.error(err);
        toast.error("Cancellation failed. The Bifrost is down.");
      }
    }
  };

  return (
    <div className="container mt-5 text-white">
      <ToastContainer />
      <h2 className="mb-4 fw-bold text-center" style={{ color: '#00BFFF' }}>
        MY ASGARDIAN SHIPMENTS 📦
      </h2>
      
      {orders.length === 0 ? (
        <p className="text-center mt-5">No orders found in the vault.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-hover border-info shadow-lg">
            <thead>
              <tr style={{ color: '#00BFFF' }}>
                <th>Item</th>
                <th>Category</th>
                <th>Size</th>
                <th>Qty</th>
                <th>Price</th>
                
                <th>Address</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isCancelled = order.deliveryStatus === "CANCELLED";
                const isDelivered = order.deliveryStatus === "DELIVERED";

                return (
                  <tr
                    key={order.id}
                    style={{
                      opacity: order.deliveryStatus === "DELIVERED" ? 0.5 : 1
                    }}
                  >
                    <td style={{ textDecoration: isDelivered ? 'line-through' : 'none' }}>
                      {order.itemName}
                    </td>
                    <td>{order.itemCategory}</td>
                    <td>{order.size}</td>
                    <td>{order.quantity}</td>
                    <td>${order.totalPrice}</td>
                    
                    
                    <td style={{ fontSize: '0.8rem', maxWidth: '150px' }}>
                      {order.address || "N/A"}
                    </td>
                    
                    <td>
                      {order.deliveryStatus === "PENDING"
                        ? order.expectedDate
                        : order.dateOfOrder}
                    </td>
                    <td
                    className="fw-bold"
                    style={{
                      color:
                        order.deliveryStatus === "PENDING"
                          ? "#FFA500"   // 🟡 ORANGE (pending)
                          : order.deliveryStatus === "DELIVERED"
                          ? "#32CD32"   // 🟢 GREEN
                          : "#FF0000"   // 🔴 RED (cancelled)
                    }}
                  >
                    {order.deliveryStatus}
                  </td>
                    <td>
                      {order.deliveryStatus === "PENDING" && (
                        <button 
                          className="btn btn-sm btn-outline-danger" 
                          onClick={() => handleCancel(order.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyOrders;