import React, { useState } from "react";
import axios from "axios";

const AdminLogin = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://127.0.0.1:8000/admin/", form);
      alert("Đăng nhập thành công!");
      // window.location.href = "/dashboard";
    } catch (err) {
      setError(
        err.response?.data?.detail || "Đăng nhập thất bại. Kiểm tra lại tài khoản!"
      );
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto" }}>
      <h2>Đăng nhập Superuser</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Tên đăng nhập"
          value={form.username}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
        />
        <input
          name="password"
          type="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
        />
        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin; 