import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });

  // Fetch items
  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/items");
      setItems(response.data);
    } catch (error) {
      alert("Failed to load items");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle edit form input
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Add new item
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/items", form);
      alert("Item added successfully!");
      setForm({ name: "", description: "" });
      fetchItems();
    } catch (error) {
      alert("Failed to add item");
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/items?id=${id}`);
      alert("Item deleted!");
      fetchItems();
    } catch (error) {
      alert("Failed to delete item");
    }
  };

  // Enable edit mode
  const handleEdit = (item) => {
    setEditId(item._id);
    setEditForm({ name: item.name, description: item.description });
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditId(null);
    setEditForm({ name: "", description: "" });
  };

  // Update item
  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/items?id=${id}`, editForm);
      alert("Item updated successfully!");
      setEditId(null);
      fetchItems();
    } catch (error) {
      alert("Failed to update item");
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Frontend Developer Project</h1>

      <div className="dashboard-header">
        <h2>Dashboard</h2>
      </div>

      <form className="dashboard-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Item Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Item</button>
      </form>

      <div className="item-list">
        {items.map((item) => (
          <div key={item._id} className="item-card">
            {editId === item._id ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  placeholder="Edit name"
                />
                <input
                  type="text"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  placeholder="Edit description"
                />
                <button onClick={() => handleUpdate(item._id)}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="item-actions">
                  <button onClick={() => handleEdit(item)}>Edit</button>
                  <button onClick={() => handleDelete(item._id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
