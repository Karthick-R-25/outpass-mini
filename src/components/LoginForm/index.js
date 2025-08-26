import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { useUser } from "../userFile/UserContext"; // import context
import "./index.css";

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUserData } = useUser();
  const {userData}=useUser() // get context setter

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/login", formData);
      console.log(res.data.type)
      if (res.data.validation) {
        const { username } = formData;
        console.log(username)
        const userType = res.data.type;
        console.log(userType)
        // ✅ Save in Context
        setUserData({ username,user:userType});
        console.log(userData)

        // ✅ Store token
        Cookies.set("jwt_token", res.data.jeevToken);

        // ✅ Navigate
        const routes = {
          student: "/",
          staff: "/history",
          hod: "/history",
        };
        navigate(routes[userType] || "/", { replace: true });
      } else {
        setError(res.data.Error || "Invalid login attempt");
      }
    } catch (err) {
      console.error("Login error:", err.message);
      setError("Server error, please try again later.");
    }
  };

  return (
    <div className="login-form-container">
      <img
        src="https://res.cloudinary.com/dprxsgnqn/image/upload/v1694320298/vc9ukp7bdnvkhkvzkn3n.jpg"
        className="login-image"
        alt="website login"
      />
      <form className="form-container" onSubmit={submitForm}>
        <div className="login-image-container">
          <img
            src="https://yt3.ggpht.com/a/AATXAJwORzAUuq_u1LIlDdiqGEJCGq9rSm8AphjwjQ=s900-c-k-c0xffffffff-no-rj-mo"
            className="login-website-logo-desktop-image"
            alt="website logo"
          />
        </div>

        <div className="input-container">
          <label className="input-label" htmlFor="username">
            USERNAME
          </label>
          <input
            type="text"
            id="username"
            className="username-input-field"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-container">
          <label className="input-label" htmlFor="password">
            PASSWORD
          </label>
          <input
            type="password"
            id="password"
            className="password-input-field"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="login-button">
          Login
        </button>

        {error && <p className="error-message">*{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
