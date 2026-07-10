import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

const fetchPosts = async () => {
  const response = await axios.get("http://localhost:3001/posts");

  return response.data;
};

function Home() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    enabled: true,
    retry: false,
  });

  const likePostMutation = useMutation({
    mutationFn: async (postId) => {
      const response = await axios.post(
        "http://localhost:3001/likes",
        { PostId: postId },
        {
          withCredentials: true,
        },
      );

      return response.data;
    },
    onSuccess: (response, postId) => {
      queryClient.setQueryData(["posts"], (oldData) => {
        if (!oldData) return oldData;

        const updatedPosts = oldData.listOfPosts.map((post) => {
          if (post.id !== postId) return post;

          if (response.liked) {
            return { ...post, Likes: [...post.Likes, 0] };
          }

          const likesArray = [...post.Likes];
          likesArray.pop();
          return { ...post, Likes: likesArray };
        });

        const updatedLikedPosts = response.liked
          ? [...oldData.likedPosts, { PostId: postId }]
          : oldData.likedPosts.filter((like) => like.PostId !== postId);

        return {
          ...oldData,
          listOfPosts: updatedPosts,
          likedPosts: updatedLikedPosts,
        };
      });
    },
  });

  useEffect(() => {
    axios.get("http://localhost:3001/auth/auth").then((response) => {
      if (response.data.error) {
        navigate("/login");
      }
    });
  }, [navigate]);

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  if (isError) {
    return <div>Error loading posts: {error.message}</div>;
  }

  const listOfPosts = data?.listOfPosts || [];
  const likedPosts = (data?.likedPosts || []).map((like) => like.PostId);

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
                  onClick={() => likePostMutation.mutate(value.id)}
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
