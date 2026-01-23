import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${API_BASE}/api/admin/auth/login`,
        { email, password }
      );

      // Save token in local storage
      localStorage.setItem("adminToken", res.data.token);

      // Redirect to dashboard
      navigate("/admin/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">

      <div className="w-[400px] bg-white shadow-lg p-8 rounded-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800">Admin Login</h2>
        <p className="text-center text-gray-500 mb-6">Access your admin panel</p>

        {error && (
          <div className="bg-red-100 text-red-600 px-3 py-2 mb-4 rounded">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Admin Email"
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>

    </div>
  );
}
