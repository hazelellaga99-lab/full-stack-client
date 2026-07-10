import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/auth/auth").then((response) => {
      if (response.data.error) {
        navigate("/login");
      }
    });
  }, [navigate]);

  const changePassword = () => {
    axios
      .put(
        "http://localhost:3001/auth/changepassword",
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        {},
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          alert("Password changed successfully!");
          navigate("/");
        }
      });
  };

  return (
    <div>
      <h1>Change Password</h1>
      <input
        type="password"
        placeholder="Current Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      {/* <input type="password" placeholder="Confirm New Password" /> */}
      <button onClick={changePassword}>Change Password</button>
    </div>
  );
}

export default ChangePassword;
