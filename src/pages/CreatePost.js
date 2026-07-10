import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { AuthContext } from "../helpers/AuthContext";

function CreatePost() {
  let navigate = useNavigate();
  const queryClient = useQueryClient();
  // const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios.get("http://localhost:3001/auth/auth").then((response) => {
      if (response.data.error) {
        navigate("/login");
      }
    });
  }, [navigate]);

  const initialValues = {
    title: "",
    postText: "",
    // username: "",
  };

  const createPostMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post("http://localhost:3001/posts", data, {
        withCredentials: true,
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/");
    },
  });

  const onSubmit = (data) => {
    createPostMutation.mutate(data);
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    postText: Yup.string().required("Post text is required"),
    // username: Yup.string().min(3).max(15).required("Username is required"),
  });

  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {() => (
          <Form className="formContainer">
            <label htmlFor="inputCreatePost">Title:</label>
            <ErrorMessage name="title" component="span" />
            <Field
              id="inputCreatePost"
              autoComplete="off"
              name="title"
              placeholder="Title"
            />
            <label htmlFor="inputCreatePostText">Post:</label>
            <ErrorMessage name="postText" component="span" />
            <Field
              id="inputCreatePost"
              autoComplete="off"
              name="postText"
              placeholder="Post Text"
            />
            {/* <label htmlFor="inputCreateUsername">Username:</label>
            <ErrorMessage name="username" component="span" />
            <Field
              id="inputCreatePost"
              autoComplete="off"
              name="username"
              placeholder="Username"
            /> */}
            <button type="submit">Create Post</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CreatePost;
