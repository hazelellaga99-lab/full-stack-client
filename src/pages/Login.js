import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/auth/auth").then((response) => {
      if (!response.data.error) {
        navigate("/");
      }
    });
  }, [navigate]);

  const login = () => {
    const data = { username: username, password: password };
    axios.post("http://localhost:3001/auth/login", data).then((response) => {
      console.log(response.data);
      if (response.data.error) {
        alert(response.data.error);
        return;
      } else {
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        }); // Update auth state to true
        navigate("/");
      }
    });
  };

  return (
    <div className="loginContainer">
      <label htmlFor="inputLoginUsername">Username:</label>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label htmlFor="inputLoginPassword">Password:</label>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;
