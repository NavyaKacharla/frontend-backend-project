import React, { useState } from "react";
import axios from "axios";
import "./styles.css";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gmail validation
    if (!form.email.endsWith("@gmail.com")) {
      alert("Please use a valid Gmail address (example@gmail.com)");
      return;
    }

    try {
      await axios.post("http://localhost:5000/register", form);
      alert("Registered successfully!");
      window.location.href = "/login";
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div className="register-container">
      <h1>Frontend Developer Project</h1>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          type="text"
          name="name"
          placeholder="Enter name"
          value={form.name}
          onChange={handleChange}
          autoComplete="off"  // ← prevent autofill
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Enter Gmail ID"
          value={form.email}
          onChange={handleChange}
          autoComplete="off"  // ← prevent autofill
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"  // ← prevent autofill
          required
        />
        <button type="submit">Register</button>
      </form>

      {/* 🔹 Added Line Below */}
      <p>
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => (window.location.href = "/login")}
          style={{
            background: "none",
            border: "none",
            color: "#FFD700",
            cursor: "pointer",
            textDecoration: "underline",
            fontWeight: "600",
          }}
        >
          Login here
        </button>
      </p>
    </div>
  );
}

export default Register;
