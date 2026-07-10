import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // if (authState.status === false) {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      // fetch the post data using the id
      axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
        setPostObject(response.data);

        // console.log(response.data);
      });

      axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
        setComments(response.data);
      });
    }
  }, [id, navigate]);

  const addComment = () => {
    axios
      .post(
        "http://localhost:3001/comments",
        {
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        },
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
          return;
        }
        const commentToAdd = {
          commentBody: newComment,
          username: response.data.username,
        };
        setComments([...comments, commentToAdd]);
        setNewComment("");
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id !== id;
          }),
        );
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        navigate("/");
      });
  };

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter New Title: ");
      if (newTitle === null || newTitle.trim() === "") {
        return;
      }
      axios.put(
        "http://localhost:3001/posts/title",
        {
          newTitle: newTitle,
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        },
      );
      setPostObject({ ...postObject, title: newTitle });
    } else {
      let newPostText = prompt("Enter New Text: ");
      if (newPostText === null || newPostText.trim() === "") {
        return;
      }
      axios.put(
        "http://localhost:3001/posts/postText",
        {
          newText: newPostText,
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        },
      );
      setPostObject({ ...postObject, postText: newPostText });
    }
  };

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div
            className="title"
            onClick={() => {
              authState.status &&
                authState.username === postObject.username &&
                editPost("title");
            }}
          >
            {postObject.title}
          </div>
          <div
            className="body"
            onClick={() => {
              authState.status &&
                authState.username === postObject.username &&
                editPost("body");
            }}
          >
            {postObject.postText}
          </div>
          <div className="footer">
            {postObject.username}
            {authState.status && authState.username === postObject.username && (
              <button onClick={() => deletePost(postObject.id)}>
                Delete Post
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            placeholder="Write a comment..."
            autoComplete="off"
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button onClick={addComment}>Add Comment</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div className="comment" key={key}>
                {comment.commentBody}
                <label htmlFor="username" className="username">
                  Username: {comment.username}
                </label>
                {authState.status &&
                  authState.username === comment.username && (
                    <button onClick={() => deleteComment(comment.id)}>X</button>
                  )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
