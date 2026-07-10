import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../helpers/AuthContext";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  // const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // if (authState.status === false) {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      axios
        .get("http://localhost:3001/posts", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          // console.log(response.data);
          setListOfPosts(response.data.listOfPosts);
          setLikedPosts(
            response.data.likedPosts.map((like) => {
              return like.PostId;
            }),
          );
          console.log(response.data.likedPosts);
        });
    }
  }, [navigate]);

  const likeAPost = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } },
      )
      .then((response) => {
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          }),
        );
        setLikedPosts(
          response.data.liked
            ? [...likedPosts, postId]
            : likedPosts.filter((id) => {
                return id !== postId;
              }),
        );
      });
  };

  return (
    <div>
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
              <div
                className="username"
                onClick={() => {
                  navigate(`/profile/${value.UserId}`);
                }}
              >
                {value.username}
              </div>
              <div className="buttons">
                <ThumbUpIcon
                  className={
                    likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                  }
                  onClick={() => likeAPost(value.id)}
                />
                <label>{value.Likes.length}</label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
