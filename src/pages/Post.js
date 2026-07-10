import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../helpers/AuthContext";

const fetchPostById = async (id) => {
  const response = await axios.get(`http://localhost:3001/posts/byId/${id}`);
  return response.data;
};

const fetchCommentsByPostId = async (id) => {
  const response = await axios.get(`http://localhost:3001/comments/${id}`);
  return response.data;
};

function Post() {
  let { id } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data: postData, isLoading: isPostLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPostById(id),
    enabled: true,
    retry: false,
  });

  const { data: commentsData, isLoading: isCommentsLoading } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => fetchCommentsByPostId(id),
    enabled: true,
    retry: false,
  });

  useEffect(() => {
    if (!isPostLoading && postData == null) {
      navigate("/not-found", { replace: true });
    }
  }, [isPostLoading, postData, navigate]);

  useEffect(() => {
    axios.get("http://localhost:3001/auth/auth").then((response) => {
      if (response.data.error) {
        navigate("/login");
      } else if (commentsData) {
        setComments(commentsData);
      }
    });
  }, [commentsData, id, navigate]);

  const addComment = () => {
    axios
      .post(
        "http://localhost:3001/comments",
        {
          commentBody: newComment,
          PostId: id,
        },
        {},
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
    axios.delete(`http://localhost:3001/comments/${id}`, {}).then(() => {
      setComments(
        comments.filter((val) => {
          return val.id !== id;
        }),
      );
    });
  };

  const deletePost = (id) => {
    axios.delete(`http://localhost:3001/posts/${id}`, {}).then(() => {
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
        {},
      );
      setComments(comments);
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
        {},
      );
      setComments(comments);
    }
  };

  if (isPostLoading || isCommentsLoading) {
    return <div>Loading post...</div>;
  }

  const postObject = postData || {};

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
