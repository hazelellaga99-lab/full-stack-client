import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import { AuthContext } from "./helpers/AuthContext";

axios.defaults.withCredentials = true;

let csrfToken = null;

const getCsrfToken = async () => {
  if (csrfToken) return csrfToken;

  const response = await axios.get("http://localhost:3001/auth/csrf-token");
  csrfToken = response.data.csrfToken;
  return csrfToken;
};

axios.interceptors.request.use(async (config) => {
  if (
    ["post", "put", "patch", "delete"].includes(config.method?.toLowerCase())
  ) {
    const token = await getCsrfToken();
    config.headers["X-CSRF-Token"] = token;
  }
  return config;
});

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios.get("http://localhost:3001/auth/auth").then((response) => {
      if (response.data.error) {
        setAuthState({ username: "", id: 0, status: false });
      } else {
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
      }
    });
  }, []);

  const logout = () => {
    axios.post("http://localhost:3001/auth/logout").finally(() => {
      setAuthState({ username: "", id: 0, status: false });
      window.location.href = "/login";
    });
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            {!authState.status ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/registration">Registration</Link>
              </>
            ) : (
              <>
                <Link to="/">Home Page</Link>
                <Link to="/createpost">Create A Post</Link>
                {/* <Link to="/profile">Profile</Link> */}
              </>
            )}
            <div className="loggedInContainer">
              <h1>{authState.username} </h1>
              {authState.status && <button onClick={logout}> Logout</button>}
            </div>
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/not-found" element={<PageNotFound />} />
            <Route path="/changepassword" element={<ChangePassword />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
