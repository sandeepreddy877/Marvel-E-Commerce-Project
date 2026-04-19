import React, { useEffect, useState } from 'react';
import API from '../services/api';

import { toast, ToastContainer } from 'react-toastify';

function AdminProducts() {

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: ""
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await API.put(`/products/update/${editingId}`, form);
        setEditingId(null);
        toast.success("Product updated successfully! ✅");
      } else {
        await API.post("/products/add", form);
        toast.success("Product added successfully! ✅");
      }

      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        imageUrl: ""
      });

      fetchProducts();
    } catch (err) {
      alert("Error ❌", err);
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product.id);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      await API.delete(`/products/delete/${id}`);
      fetchProducts();
    }
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh", padding: "20px" }}>
      <ToastContainer />
      <h2 style={{ textAlign: "center", color: "#9b59b6" }}>
        ADMIN: PRODUCT MANAGEMENT 🛠️
      </h2>

      <h3 style={{ color: "#00ff37" }}>
        FORM</h3>

      <div style={{ display: "flex", flexWrap: "wrap", gap: '8px', textAlign: "center", marginBottom: "20px" }}>
        <input placeholder="Name" value={form.name} className="form-control bg-dark text-white border-secondary mb-3"
          style={{ width: '15%' }}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <input placeholder="Description" value={form.description} className="form-control bg-dark text-white border-secondary mb-3"
          style={{ width: '15%' }}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <input placeholder="Price" value={form.price} className="form-control bg-dark text-white border-secondary mb-3"
          style={{ width: '15%' }}
          onChange={(e) => setForm({ ...form, price: e.target.value })} />

        <select
          value={form.category}
          className="form-select bg-dark text-white border-secondary mb-3"
          style={{ width: '20%' }} // Slightly wider to fit the text
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="" disabled>Select Category</option>
          <option value="marvel clothes">Marvel Clothes</option>
          <option value="marvel magnets">Marvel Magnets</option>
          <option value="marvel keychains">Marvel Keychains</option>
          <option value="marvel action figures">Marvel Action Figures</option>
          <option value="marvel tools">Marvel Replica's</option>
        </select>

        <input placeholder="Image URL" value={form.imageUrl} className="form-control bg-dark text-white border-secondary mb-3"
          style={{ width: '15%' }}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />

        <button onClick={handleSubmit} className="btn fw-bold border-secondary mb-3"
          style={{ width: '15%', backgroundColor: "#00ff26" }}>
          {editingId ? "Update" : "Add Product"}
        </button>
      </div>

      {/* 🔥 PRODUCT CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px"
      }}>

        {products.map(product => (

          <div key={product.id} style={{
            background: "#111",
            borderRadius: "10px",
            padding: "15px",
            textAlign: "center",
            boxShadow: "0 0 10px rgba(0,255,255,0.2)"
          }}>

            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />

            <h4 style={{ color: "#00BFFF" }}>{product.name}</h4>
            <p style={{ color: "#fff" }}>${product.price}</p>

            {/* 🔥 ADMIN BUTTONS */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>

              <button
                onClick={() => handleEdit(product)}
                style={{ background: "orange", border: "none", padding: "5px 10px" }}
              >
                Edit ✏️
              </button>

              <button
                onClick={() => handleDelete(product.id)}
                style={{ background: "red", border: "none", padding: "5px 10px", color: "white" }}
              >
                Delete 🗑️
              </button>

            </div>

          </div>

        ))}

      </div>
    </div>
  );
}

export default AdminProducts;