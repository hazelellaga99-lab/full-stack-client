import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Profile() {
  let { id } = useParams();
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({});
  const [listOfPosts, setListOfPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/auth/auth").then((response) => {
      if (response.data.error) {
        navigate("/login");
      } else {
        //   // fetch the post data using the id
        axios
          .get(`http://localhost:3001/auth/basicinfo/${id}`)
          .then((response) => {
            if (!response.data) {
              navigate("/not-found", { replace: true });
            } else {
              setUserInfo(response.data);
            }
          })
          .catch(() => navigate("/not-found", { replace: true }));
        axios
          .get(`http://localhost:3001/posts/byUserId/${id}`)
          .then((response) => {
            setListOfPosts(response.data);
          });
      }
    });
  }, [id, navigate]);

  return (
    <div className="profilePageContainer">
      <div className="basicInfo">
        <h1>Username: {userInfo.username}</h1>
        {authState.status && authState.username === userInfo.username && (
          <button
            onClick={() => {
              navigate("/changepassword");
            }}
          >
            Change Password
          </button>
        )}
      </div>
      <div className="listofPosts">
        {listOfPosts.map((value, key) => {
          return (
            <div className="post" key={key}>
              <div className="title">{value.title}</div>
              <div
                className="body"
                onClick={() => {
                  navigate(`/post/${value.id}`);
                }}
              >
                {value.postText}
              </div>
              <div className="footer">
                <div className="username">{value.username}</div>
                <div className="buttons">
                  <label>{value.Likes.length}</label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Profile;
