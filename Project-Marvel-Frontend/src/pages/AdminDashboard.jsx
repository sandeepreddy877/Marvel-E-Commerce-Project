import React, { useEffect, useState } from 'react'
import API from '../services/api'

function AdminDashboard() {

  const [allOrders, setAllOrders] = useState([])

  useEffect(() => {
    fetchAllOrders()
  }, [])

  // ✅ FETCH ALL ORDERS
  const fetchAllOrders = async () => {
    try {
      const res = await API.get("/orders/all")
      console.log("Orders:", res.data); // 🔥 debug

      // 🔥 PRIORITY MAP
      // 1 = Top (Pending), 2 = Middle (Delivered), 3 = Bottom (Cancelled)
      const statusPriority = {
        "PENDING": 1,
        "DELIVERED": 2,
        "CANCELLED": 3
      }

      // 🔥 SORTING LOGIC
      const sortedOrders = res.data.sort((a, b) => {
        return statusPriority[a.deliveryStatus] - statusPriority[b.deliveryStatus]
      })

      setAllOrders(sortedOrders)

    } catch (err) {
      console.error("Error fetching orders", err)
    }
  }

  // ✅ FIXED HERE (REMOVED /api)
  const markDelivered = async (id) => {
    try {
      await API.put(`/orders/deliver/${id}`) // ✅ CORRECT
      fetchAllOrders()
    } catch (err) {
      console.error(err)
      alert("Failed to update status ❌")
    }
  }

  return (
    <div className="container mt-5 text-white">

      <h2 className="text-center mb-4 fw-bold" style={{ color: '#32CD32' }}>
        ADMIN CONTROL: ORDERS 👨‍💼
      </h2>

      <table className="table table-dark border-success">
        <thead>
          <tr style={{ color: '#32CD32' }}>
            <th>User</th>
            <th>Product</th>

            <th>Shipping Address</th>
            <th>Total</th>
            <th>Status</th>
            <th>Control</th>
          </tr>
        </thead>

        <tbody>
          {allOrders.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No Orders Found</td>
            </tr>
          ) : (
            allOrders.map(order => (
              <tr key={order.id}
                style={{
                  opacity: order.deliveryStatus === "CANCELLED" ? 0.5 : 1
                }}
              >

                <td>{order.username}</td>

                <td style={{
                  textDecoration: order.deliveryStatus === "DELIVERED" ? 'line-through' : 'none',
                  textDecorationColor: order.deliveryStatus === "DELIVERED" ? '#32CD32' : 'transparent', // Green line
                  textDecorationThickness: '2px', // Makes the line stand out
                  color: order.deliveryStatus === "DELIVERED" ? '#32CD32' : 'white'
                }}>
                  {order.itemName} (x{order.quantity})
                </td>


                <td style={{ fontSize: '0.9rem', maxWidth: '200px' }}>
                  {order.address || "N/A"}
                </td>

                <td>${order.totalPrice}</td>

                <td style={{
                  color: order.deliveryStatus === "DELIVERED" ? '#32CD32' : // 🟢 Green
                    order.deliveryStatus === "CANCELLED" ? '#FF0000' : // 🔴 Red
                      '#FFA500'
                }}>{order.deliveryStatus}</td>

                <td>
                  {order.deliveryStatus === "PENDING" && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => markDelivered(order.id)}
                    >
                      Mark Delivered ✅
                    </button>
                  )}
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default AdminDashboard