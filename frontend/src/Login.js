import React, { useState } from "react";
import "./styles.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });


  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gmail validation
    if (!form.email.endsWith("@gmail.com")) {
      alert("Please use a valid Gmail address (example@gmail.com)");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        setForm({ email: "", password: "" });
        window.location.href = "/dashboard";
      } else {
        alert(data.message || "Invalid credentials!");
      }
    } catch {
      alert("Server not reachable. Try again later.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Welcome Back</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          type="email"
          name="email"
          placeholder="Enter your Gmail"
          value={form.email}
          onChange={handleChange}
          autoComplete="off"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />
        <button type="submit">Login</button>
      </form>

      <p>
        Don’t have an account?{" "}
        <button
          type="button"
          onClick={() => (window.location.href = "/register")}
          style={{
            background: "none",
            border: "none",
            color: "#FFD700",
            cursor: "pointer",
            textDecoration: "underline",
            fontWeight: "600",
          }}
        >
          Register here
        </button>
      </p>
    </div>
  );
}

export default Login;
